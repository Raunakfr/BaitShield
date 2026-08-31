import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import LoginScreen from './components/LoginScreen';
import AnalyzeModal from './components/AnalyzeModal';
import PlantModal from './components/PlantModal';
import { useWebSocket } from './hooks/useWebSocket';
import {
  getCoverage,
  getTrace,
  getTraceGraph,
  getDecoys,
  deleteDecoy,
  getIncidents,
  getLegitimateLogs,
  simulateAttacker,
  simulateLegitimate,
  reset,
  logout
} from './lib/api';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('baitshield_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [alerts, setAlerts] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [coverage, setCoverage] = useState({ covered: 0, total: 0, percentage: 0 });
  const [decoys, setDecoys] = useState([]);
  const [legitimateLogs, setLegitimateLogs] = useState([]);
  const [simulating, setSimulating] = useState(false);
  const [legitimateSimulating, setLegitimateSimulating] = useState(false);

  // Modals state
  const [analyzeModalOpen, setAnalyzeModalOpen] = useState(false);
  const [plantModalOpen, setPlantModalOpen] = useState(false);
  const [preselectedAssetId, setPreselectedAssetId] = useState('');

  const fetchInitialData = async () => {
    try {
      const [covData, graph, decoyData, traceData, incidentData, legitData] = await Promise.all([
        getCoverage().catch(() => ({ percentage: 0, covered: 0, total: 0 })),
        getTraceGraph().catch(() => ({ nodes: [], edges: [] })),
        getDecoys().catch(() => []),
        getTrace().catch(() => []),
        getIncidents().catch(() => []),
        getLegitimateLogs().catch(() => [])
      ]);

      setCoverage(covData && typeof covData.percentage === 'number' ? covData : { percentage: 0, covered: 0, total: 0 });
      setDecoys(Array.isArray(decoyData) ? decoyData : []);
      setLegitimateLogs(Array.isArray(legitData) ? legitData : []);
      setAlerts(Array.isArray(traceData) ? traceData : []);
      setIncidents(Array.isArray(incidentData) ? incidentData : []);

      if (graph && Array.isArray(graph.nodes)) {
        setGraphData({
          nodes: graph.nodes,
          links: Array.isArray(graph.edges) ? graph.edges.map(e => ({ source: e.source, target: e.target, ...e })) : []
        });
      } else {
        setGraphData({ nodes: [], links: [] });
      }
    } catch (e) {
      console.error('Error fetching initial data:', e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchInitialData();
    }
  }, [user]);

  // Handle incoming real-time WebSocket events
  const handleWebSocketMessage = useCallback((msg) => {
    if (msg.type === 'alert' && msg.data) {
      const newAlert = msg.data;
      setAlerts(prev => {
        const safePrev = Array.isArray(prev) ? prev : [];
        if (safePrev.some(a => a.id === newAlert.id)) return safePrev;
        return [newAlert, ...safePrev];
      });

      setGraphData(prev => {
        const nodes = Array.isArray(prev.nodes) ? [...prev.nodes] : [];
        const links = Array.isArray(prev.links) ? [...prev.links] : [];

        const attackerIp = newAlert.source_ip || '192.168.1.200';
        let attackerNode = nodes.find(n => n.type === 'attacker');
        if (!attackerNode) {
          attackerNode = { id: 'attacker', label: `Attacker (${attackerIp})`, ip: attackerIp, type: 'attacker' };
          nodes.push(attackerNode);
        }

        const decoyNodeId = `decoy-${newAlert.decoy_id}`;
        let decoyNode = nodes.find(n => n.id === decoyNodeId);
        if (!decoyNode) {
          decoyNode = {
            id: decoyNodeId,
            label: newAlert.decoy_name || newAlert.decoy_id,
            type: 'decoy',
            path: newAlert.decoy_path,
            severity: newAlert.severity
          };
          nodes.push(decoyNode);
        }

        const edgeId = `edge-${newAlert.id}`;
        if (!links.some(l => l.id === edgeId)) {
          const lastNodeId = nodes[nodes.length - 2]?.id || 'attacker';
          links.push({
            id: edgeId,
            source: lastNodeId,
            target: decoyNodeId,
            label: newAlert.action
          });
        }

        return { nodes, links };
      });

      setDecoys(prev => {
        const safePrev = Array.isArray(prev) ? prev : [];
        return safePrev.map(d => d.id === newAlert.decoy_id ? { ...d, triggered: true } : d);
      });
    } else if (msg.type === 'incident' && msg.data) {
      setIncidents(prev => {
        const safePrev = Array.isArray(prev) ? prev : [];
        if (safePrev.some(inc => inc.id === msg.data.id)) return safePrev;
        return [msg.data, ...safePrev];
      });
      setSimulating(false);
    } else if (msg.type === 'legitimate_activity' && msg.data) {
      setLegitimateLogs(prev => [msg.data, ...(Array.isArray(prev) ? prev : [])]);
      setLegitimateSimulating(false);
    } else if (msg.type === 'reset') {
      fetchInitialData();
      setSimulating(false);
      setLegitimateSimulating(false);
    }
  }, []);

  const { connected } = useWebSocket(handleWebSocketMessage);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem('baitshield_user', JSON.stringify(userData));
    } catch (e) {}
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {}
    setUser(null);
    try {
      localStorage.removeItem('baitshield_user');
    } catch (e) {}
  };

  const handleSimulateAttacker = async () => {
    setSimulating(true);
    try {
      await simulateAttacker();
      setTimeout(() => setSimulating(false), 12000);
    } catch (e) {
      console.error('Attacker simulation failed:', e);
      setSimulating(false);
    }
  };

  const handleSimulateLegitimate = async () => {
    setLegitimateSimulating(true);
    try {
      const res = await simulateLegitimate();
      if (res && Array.isArray(res.logs)) {
        setLegitimateLogs(prev => [...res.logs, ...(Array.isArray(prev) ? prev : [])]);
      }
    } catch (e) {
      console.error('Legitimate simulation failed:', e);
    } finally {
      setLegitimateSimulating(false);
    }
  };

  const handleReset = async () => {
    try {
      await reset();
      setAlerts([]);
      setIncidents([]);
      setLegitimateLogs([]);
      setGraphData({ nodes: [], links: [] });
      await fetchInitialData();
    } catch (e) {
      console.error('Reset failed:', e);
    }
  };

  const handleDeleteDecoy = async (id) => {
    try {
      await deleteDecoy(id);
      await fetchInitialData();
    } catch (e) {
      console.error('Delete decoy failed:', e);
    }
  };

  const handleOpenPlantForAsset = (assetId) => {
    setPreselectedAssetId(assetId || '');
    setPlantModalOpen(true);
  };

  const handleDecoyPlanted = async () => {
    await fetchInitialData();
  };

  if (!user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-bg text-text font-sans selection:bg-accent selection:text-white">
      <Header
        connected={connected}
        user={user}
        onLogout={handleLogout}
        onOpenAnalyze={() => setAnalyzeModalOpen(true)}
        onOpenPlant={() => {
          setPreselectedAssetId('');
          setPlantModalOpen(true);
        }}
      />

      <Dashboard
        alerts={alerts}
        incidents={incidents}
        graphData={graphData}
        coverage={coverage}
        decoys={decoys}
        legitimateLogs={legitimateLogs}
        simulating={simulating}
        legitimateSimulating={legitimateSimulating}
        onSimulate={handleSimulateAttacker}
        onSimulateLegitimate={handleSimulateLegitimate}
        onReset={handleReset}
        onDeleteDecoy={handleDeleteDecoy}
        connected={connected}
      />

      <AnalyzeModal
        isOpen={analyzeModalOpen}
        onClose={() => setAnalyzeModalOpen(false)}
        onPlantRecommendation={handleOpenPlantForAsset}
      />

      <PlantModal
        isOpen={plantModalOpen}
        onClose={() => setPlantModalOpen(false)}
        onDecoyPlanted={handleDecoyPlanted}
        defaultAssetId={preselectedAssetId}
      />
    </div>
  );
}
