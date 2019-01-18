const fs = require('fs');
const path = require('path');

const getSimulations = () => {
  const simulationsDirectory = path.join(__dirname, '../data/tix-simulations');
  const files = fs.readdirSync(simulationsDirectory);
  const simulations = files.map((fileName) => {
    const fullPath = path.join(simulationsDirectory, fileName);
    const content = fs.readFileSync(path.join(__dirname, '../data/tix-simulations', fileName));
    const json = JSON.parse(content);

    return {
      fileName,
      symbols: json.symbols,
      names: json.names,
      ticks: {
        count: json.ticks.length,
        first: json.ticks[0],
        last: json.ticks[json.ticks.length - 1],
      },
    };
  });

  // Sort by time, descending. This assumes there are no overlapping
  // simulations, which shouldn't be possible as long as only one
  // tix-api-server is running at a time.
  simulations.sort((a, b) => a.ticks.first.time - b.ticks.first.time);

  return simulations;
};

const groupContiguousSimulations = (simulations) => {
  let lastSimulation = simulations[0];
  const groups = [
    {
      start: lastSimulation.ticks.first.time,
      end: lastSimulation.ticks.last.time,
      simulations: [lastSimulation],
    },
  ];
  let lastGroup = groups[0];

  for (let i = 1; i < simulations.length; i++) {
    const simulation = simulations[i];
    const diff = simulation.ticks.first.time - lastSimulation.ticks.last.time;

    // Slightly arbitrary, but start a new group if the difference in time
    // between this simulations first tick and the last simulation's last
    // tick is greater than 10 seconds. 10 seconds is 2.5x the time between
    // stock market ticks in Bitrunner, so it should be plenty of time to
    // account for lag or whatever, but not enough time to falsly connect
    // two unrelated simulations.
    if (diff > 10000) {
      lastGroup = {
        start: simulation.ticks.first.time,
        end: simulation.ticks.last.time,
        simulations: [simulation],
      };
      groups.push(lastGroup);
    } else {
      // This simulation is part of the current group of simulations.
      lastGroup.simulations.push(simulation);
      lastGroup.end = simulation.ticks.last.time;
    }

    lastSimulation = simulation;
  }

  return groups;
};

const t = (time) =>
  new Date(time)
    .toISOString()
    .replace(/\.\d{3}Z$/, '')
    .split('T')
    .join(' ');

const main = () => {
  const simulationList = getSimulations();

  if (simulationList.length === 0) {
    console.log('There are no TIX simulations');
    return;
  }

  const simulationGroups = groupContiguousSimulations(simulationList);

  for (const group of simulationGroups) {
    console.log(`Group of contiguous simulations:`);
    console.log(`  Start Time: ${t(group.start)} simulations`);
    console.log(`    End Time: ${t(group.end)} simulations`);
    console.log(`  Simulations: ${group.simulations.length} simulations`);

    for (const simulation of group.simulations) {
      console.log(`    Simulation: ${simulation.fileName}`);
      console.log(`      Symbols: ${simulation.symbols.length} symbols`);
      console.log(`      Ticks: ${simulation.ticks.count} ticks`);
      console.log(`      Start Time: ${t(simulation.ticks.first.time)}`);
      console.log(`        End Time: ${t(simulation.ticks.last.time)}`);
    }

    console.log('');
  }
};

main();
