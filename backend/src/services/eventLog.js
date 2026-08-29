const { db } = require('../db');

function getAll() {
  return db.getAllEvents();
}

function getForGraph() {
  return db.getForGraph();
}

function getLatestIncident() {
  return db.getLatestIncident();
}

function saveIncident(summary) {
  return db.insertIncident(summary);
}

module.exports = {
  getAll,
  getForGraph,
  getLatestIncident,
  saveIncident
};
