const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const uuid = require('uuid');

const PORT = 8082;
const app = express();

let _simulation;

const simulationExists = () => {
  return !!_simulation;
};

const startSimulation = (symbols) => {
  // Finish the in-progres simulation if there is one.
  finishSimulation();

  console.log(`Creating a new simulation of ${symbols.length} stocks.`);

  _simulation = {
    symbols,
    ticks: [],
  };
};

const addTick = (stocks) => {
  if (!simulationExists()) {
    return false;
  }

  const n = _simulation.ticks.length + 1;
  console.log(`Adding tick #${n} to the current simulation with data for ${stocks.length} stocks.`);

  _simulation.ticks.push({ stocks });
  return true;
};

const finishSimulation = () => {
  if (!simulationExists()) {
    return false;
  }

  const { symbols, ticks } = _simulation;

  // Don't save this simulation if there isn't any data to save.
  if (ticks.length === 0) {
    const n = ticks.length + 1;
    console.log(`Discarding empty simulation`);
    return false;
  }

  const n = ticks.length + 1;
  console.log(`Completing simulation of ${n} ticks over ${symbols.length} stocks.`);

  const fileName = `${uuid.v4()}.json`;
  const filePath = path.join(__dirname, '../data/tix-simulations', fileName);
  const content = JSON.stringify(_simulation);

  fs.writeFileSync(filePath, content);
  _simulation = undefined;

  return true;
};

app.use(cors());

app.get('/simulation/new', (req, res) => {
  const { symbols } = JSON.parse(req.query.data);
  startSimulation(symbols);
  return res.json({ ok: true });
});

app.get('/simulation/tick', (req, res) => {
  const { stocks } = JSON.parse(req.query.data);

  if (!addTick(stocks)) {
    return res.json({ ignored: true });
  }

  return res.json({ ok: true });
});

app.get('/simulation/done', (req, res) => {
  if (!finishSimulation()) {
    return res.json({ ignored: true });
  }

  return res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`TIX API Simulation Server listening on http://localhost:${PORT}`);
});
