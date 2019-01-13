/**
 * TODO: Test me!
 */

export const dbFile = 'bn-db.txt';

export const dbDefaults = {
  phase: 'unknown',
  step: '',
  stepData: {},
  propagatedTo: [],
  owned: [],
  log: [],
};

export const loadDb = (ns) => {
  try {
    const content = ns.read(dbFile);
    const json = JSON.parse(content);
    return Object.assign({}, dbDefaults, json);
  } catch (e) {
    return Object.assign({}, dbDefaults);
  }
};

export const saveDb = (ns, db) => {
  ns.write(dbFile, JSON.stringify(db, null, 2), 'w');
};

export const updateDb = (ns, fn) => {
  const db = loadDb(ns);
  const updatedDb = fn(db);
  saveDb(ns, updatedDb);
};

export const setDbKey = (ns, key, value) => {
  updateDb(ns, (db) => {
    const newDb = Object.assign({}, db);
    newDb[key] = value;
    return newDb;
  });
};

export const setDbKeys = (ns, data) => {
  updateDb(ns, (db) => {
    return Object.assign({}, db, data);
  });
};
