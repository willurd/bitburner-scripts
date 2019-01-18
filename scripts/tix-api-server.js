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
    names: {
      ECP: 'ECorp',
      MGCP: 'MegaCorp',
      BLD: 'Blade Industries',
      CLRK: 'Clarke Incorporated',
      OMTK: 'OmniTek Incorporated',
      FSIG: 'Four Sigma',
      KGI: 'KuaiGong International',
      FLCM: 'Fulcrum Technologies',
      STM: 'Storm Technologies',
      DCOMM: 'DefComm',
      HLS: 'Helios Labs',
      VITA: 'VitaLife',
      ICRS: 'Icarus Microsystems',
      UNV: 'Universal Energy',
      AERO: 'AeroCorp',
      OMN: 'Omnia Cybersystems',
      SLRS: 'Solaris Space Systems',
      GPH: 'Global Pharmaceuticals',
      NVMD: 'Nova Medical',
      WDS: 'Watchdog Security',
      LXO: 'LexoCorp',
      RHOC: 'Rho Construction',
      APHE: 'Alpha Enterprises',
      SYSC: 'SysCore Securities',
      CTK: 'CompuTek',
      NTLK: 'NetLink Technologies',
      OMGA: 'Omega Software',
      FNS: 'FoodNStuff',
      SGC: 'Sigma Cosmetics',
      JGN: 'Joes Guns',
      CTYS: 'Catalyst Ventures',
      MDYN: 'Microdyne Technologies',
      TITN: 'Titan Laboratories',
    },
    ticks: [],
  };
};

const addTick = (stocks) => {
  if (!simulationExists()) {
    return false;
  }

  const n = _simulation.ticks.length + 1;

  if (n % 100 === 0) {
    console.log(`Adding tick #${n} to the current simulation with data for ${stocks.length} stocks.`);
  }

  _simulation.ticks.push({ time: Date.now(), stocks });

  const oneHourWorthOfTicks = 900;
  if (_simulation.ticks.length >= oneHourWorthOfTicks) {
    // Finish up the current simulation and start a new one. This keeps
    // the memory requirements down.
    startSimulation(_simulation.symbols.slice());
  }

  return true;
};

const finishSimulation = () => {
  if (!simulationExists()) {
    return false;
  }

  const { symbols, names, ticks } = _simulation;

  // Don't save this simulation if there isn't any data to save.
  if (ticks.length === 0) {
    console.log(`Discarding empty simulation`);
    return false;
  }

  const n = ticks.length;
  console.log(`Completing simulation of ${n} ticks over ${symbols.length} stocks.`);

  const fileName = `${uuid.v4()}.json`;
  const filePath = path.join(__dirname, '../data/tix-simulations', fileName);
  const content = JSON.stringify({
    symbols,
    names,
    // This format is less readable but keeps the filesize down. If
    // this is still too big, just do CSV or a binary format.
    ticks: ticks.map(({ time, stocks }) => ({
      time,
      stocks: stocks.reduce((map, { symbol, price, volatility, forecast }) => {
        map[symbol] = [price, volatility, forecast];
        return map;
      }, {}),
    })),
  });

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
