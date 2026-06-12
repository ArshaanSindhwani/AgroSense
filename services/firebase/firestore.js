import firestore from "@react-native-firebase/firestore";

//Users
async function createUser(userId, profile) {
  return firestore()
    .collection("users")
    .doc(userId)
    .set({
      ...profile,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
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

//Farms

//Fields
async function addField(field) {
  return firestore()
    .collection("fields")
    .add({
      ...field,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
}

async function deleteField(fieldId) {
  return firestore().collection("fields").doc(fieldId).delete();
}

async function getAllFields(userId) {
  const snapshot = await firestore()
    .collection("fields")
    .where("owner", "==", userId)
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function getField(fieldId) {
  const doc = await firestore().collection("fields").doc(fieldId).get();
  return { id: doc.id, ...doc.data };
}

async function updateField(fieldId, updates) {
  return firestore().collection("fields").doc(fieldId).update(updates);
}

//Observations
async function addObs(obs) {
  return firestore()
    .collection("observations")
    .add({
      ...obs,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
}

async function deleteObs(obsId) {
  return firestore().collection("observations").doc(obsId).delete();
}

async function getObs(fieldId) {
  const snapshot = await firestore()
    .collection("observations")
    // first fieldId refers to the column (field) within the observations table (collection)
    // second fieldId refers to the documentId of the field we're asking about (it's the parameter of the function)
    // so it's basically saying, where the documentId from fields matches the value stored in the column fieldId in observations.
    .where("fieldId", "==", fieldId)
    .orderBy("createdAt", "desc")
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function updateObs(obsId, updates) {
  return firestore().collection("observations").doc(obsId).update(updates);
}

//Recommendations
async function addRecommendation(recommendation) {
  return firestore()
    .collection("recommendations")
    .add({
      ...recommendation,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
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
  addField, addObs, addRecommendation, createUser, deleteField, deleteObs, deleteUser, getAllFields,
  getField, getFieldRecommendations, getObs, getUser, updateField, updateObs, updateUser
};

