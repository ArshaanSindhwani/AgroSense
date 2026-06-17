import firestore from "@react-native-firebase/firestore";

async function addFarm(userId, data) {
  const ref = await firestore()
    .collection("farms")
    .add({
      ...data,
      userId,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

  return ref.id;
}

async function deleteFarm(farmId) {
  return firestore().collection("farms").doc(farmId).delete();
}

async function getFarmsByUser(userId) {
  const snap = await firestore()
    .collection("farms")
    .where("userId", "==", userId)
    .get();

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

async function addField(field) {
  const ref = await firestore()
    .collection("fields")
    .add({
      ...field,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

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

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

async function getField(fieldId) {
  const doc = await firestore().collection("fields").doc(fieldId).get();

  return {
    id: doc.id,
    ...doc.data(),
  };
}

async function updateField(fieldId, updates) {
  return firestore().collection("fields").doc(fieldId).update(updates);
}

async function addObs(obs) {
  const ref = await firestore()
    .collection("observations")
    .add({
      ...obs,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

  return ref.id;
}

async function deleteObs(obsId) {
  return firestore().collection("observations").doc(obsId).delete();
}

async function getObs(fieldId) {
  const snapshot = await firestore()
    .collection("observations")
    .where("fieldId", "==", fieldId)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

async function updateObs(obsId, updates) {
  return firestore().collection("observations").doc(obsId).update(updates);
}

async function addRecommendation(recommendation) {
  const ref = await firestore()
    .collection("recommendations")
    .add({
      ...recommendation,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

  return ref.id;
}

async function getRecommendations(userId) {
  const snapshot = await firestore()
    .collection("recommendations")
    .where("userId", "==", userId)
    .get();

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .sort((a, b) => getItemTime(b) - getItemTime(a));
}

async function getFieldRecommendations(fieldId) {
  const snapshot = await firestore()
    .collection("recommendations")
    .where("fieldId", "==", fieldId)
    .get();

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .sort((a, b) => getItemTime(b) - getItemTime(a));
}

function getItemTime(item) {
  if (item.createdAt?.seconds) {
    return item.createdAt.seconds * 1000;
  }

  if (item.createdAt) {
    return new Date(item.createdAt).getTime();
  }

  if (item.recordedAt) {
    return new Date(item.recordedAt).getTime();
  }

  return 0;
}

export {
  addFarm,
  deleteFarm,
  getFarmsByUser,
  addField,
  deleteField,
  getFieldsByFarmIds,
  getField,
  updateField,
  addObs,
  deleteObs,
  getObs,
  updateObs,
  addRecommendation,
  getRecommendations,
  getFieldRecommendations,
  getItemTime
};