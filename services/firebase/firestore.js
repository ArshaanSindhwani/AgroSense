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

async function deleteField(field) {
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

//Recommendations
