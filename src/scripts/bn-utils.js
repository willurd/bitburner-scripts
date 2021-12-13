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

export const loadDb = async (ns) => {
  try {
    const content = await ns.read(dbFile);
    const json = JSON.parse(content);
    return Object.assign({}, dbDefaults, json);
  } catch (e) {
    return Object.assign({}, dbDefaults);
  }
};

export const saveDb = async (ns, db) => {
  await ns.write(dbFile, JSON.stringify(db, null, 2), 'w');
};

export const updateDb = async (ns, fn) => {
  const db = await loadDb(ns);
  const updatedDb = await fn(db);
  await saveDb(ns, updatedDb);
};

export const setDbKey = async (ns, key, value) => {
  await updateDb(ns, (db) => {
    const newDb = Object.assign({}, db);
    newDb[key] = value;
    return newDb;
  });
};

export const setDbKeys = async (ns, data) => {
  await updateDb(ns, (db) => {
    return Object.assign({}, db, data);
  });
};
