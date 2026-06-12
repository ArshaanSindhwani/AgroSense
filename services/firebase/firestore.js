import firestore from "@react-native-firebase/firestore";

// Users
async function createUser(userId, profile) {
  return firestore()
    .collection("users")
    .doc(userId)
    .set({ ...profile, createdAt: firestore.FieldValue.serverTimestamp() });
}

async function deleteUser(userId) {
  return firestore().collection("users").doc(userId).delete();
}

async function getUser(userId) {
  const doc = await firestore().collection("users").doc(userId).get();
  return { id: doc.id, ...doc.data() };
}

async function updateUser(userId, updates) {
  return firestore().collection("users").doc(userId).update(updates);
}

// Farms
async function addFarm(userId, data) {
  const ref = await firestore()
    .collection("farms")
    .add({ ...data, userId, createdAt: firestore.FieldValue.serverTimestamp() });
  return ref.id;
}

async function getFarmsByUser(userId) {
  const snap = await firestore()
    .collection("farms")
    .where("userId", "==", userId)
    .get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Fields
async function addField(field) {
  const ref = await firestore()
    .collection("fields")
    .add({ ...field, createdAt: firestore.FieldValue.serverTimestamp() });
  return ref.id;
}

async function deleteField(fieldId) {
  return firestore().collection("fields").doc(fieldId).delete();
}

async function getFieldsByFarmIds(farmIds) {
  if (!farmIds.length) return [];
  const snap = await firestore()
    .collection("fields")
    .where("farmId", "in", farmIds)
    .get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function getField(fieldId) {
  const doc = await firestore().collection("fields").doc(fieldId).get();
  return { id: doc.id, ...doc.data() };
}

async function updateField(fieldId, updates) {
  return firestore().collection("fields").doc(fieldId).update(updates);
}

// Observations
async function addObs(obs) {
  return firestore()
    .collection("observations")
    .add({ ...obs, createdAt: firestore.FieldValue.serverTimestamp() });
}

async function deleteObs(obsId) {
  return firestore().collection("observations").doc(obsId).delete();
}

async function getObs(fieldId) {
  const snapshot = await firestore()
    .collection("observations")
    .where("fieldId", "==", fieldId)
    .orderBy("createdAt", "desc")
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function updateObs(obsId, updates) {
  return firestore().collection("observations").doc(obsId).update(updates);
}

// Recommendations
async function addRecommendation(recommendation) {
  return firestore()
    .collection("recommendations")
    .add({ ...recommendation, createdAt: firestore.FieldValue.serverTimestamp() });
}

async function getFieldRecommendations(fieldId) {
  const snapshot = await firestore()
    .collection("recommendations")
    .where("fieldId", "==", fieldId)
    .orderBy("createdAt", "desc")
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export {
  addFarm, getFarmsByUser,
  addField, deleteField, getFieldsByFarmIds, getField, updateField,
  addObs, deleteObs, getObs, updateObs,
  addRecommendation, getFieldRecommendations,
  createUser, deleteUser, getUser, updateUser,
};
