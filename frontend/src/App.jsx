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

      setCoverage(covData);
      setDecoys(decoyData);
      setLegitimateLogs(legitData || []);
      
      if (traceData && traceData.length > 0) {
        setAlerts(traceData.slice());
      } else {
        setAlerts([]);
      }

      if (graph && graph.nodes) {
        setGraphData({
          nodes: graph.nodes,
          links: graph.edges ? graph.edges.map(e => ({ source: e.source, target: e.target, ...e })) : []
        });
      }

      if (incidentData && Array.isArray(incidentData)) {
        setIncidents(incidentData);
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

  const handleWebSocketMessage = useCallback(async (msg) => {
    if (msg.type === 'alert') {
      setAlerts(prev => {
        if (prev.some(a => a.id === msg.data.id)) return prev;
        return [msg.data, ...prev];
      });

      try {
        const [graph, cov, updatedDecoys] = await Promise.all([
          getTraceGraph(),
          getCoverage(),
          getDecoys()
        ]);
        if (graph && graph.nodes) {
          setGraphData({
            nodes: graph.nodes,
            links: graph.edges ? graph.edges.map(e => ({ source: e.source, target: e.target, ...e })) : []
          });
        }
        setCoverage(cov);
        setDecoys(updatedDecoys);
      } catch (e) {
        console.error('Error updating after alert:', e);
      }
    } else if (msg.type === 'incident') {
      setIncidents(prev => [msg.data, ...prev]);
      setSimulating(false);
    } else if (msg.type === 'legitimate_activity') {
      setLegitimateLogs(prev => [msg.data, ...prev]);
      setLegitimateSimulating(false);
    } else if (msg.type === 'reset') {
      setAlerts([]);
      setIncidents([]);
      setLegitimateLogs([]);
      setGraphData({ nodes: [], links: [] });
      fetchInitialData();
    }
  }, []);

  const { connected } = useWebSocket(user ? 'ws://localhost:3001' : null, handleWebSocketMessage);

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
      if (res && res.logs) {
        setLegitimateLogs(prev => [...res.logs, ...prev]);
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

  const handleOpenPlantForAsset = (assetId) => {
    setPreselectedAssetId(assetId);
    setPlantModalOpen(true);
  };

  const handleDecoyPlanted = async () => {
    const [cov, updatedDecoys] = await Promise.all([getCoverage(), getDecoys()]);
    setCoverage(cov);
    setDecoys(updatedDecoys);
  };

  const handleDeleteDecoy = async (id) => {
    try {
      await deleteDecoy(id);
      const [cov, updatedDecoys] = await Promise.all([getCoverage(), getDecoys()]);
      setCoverage(cov);
      setDecoys(updatedDecoys);
    } catch (e) {
      console.error('Delete decoy failed:', e);
    }
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
