import firestore from "@react-native-firebase/firestore";

export const getFarmsByUser = async (userId) => {
  const snap = await firestore()
    .collection("farms")
    .where("userId", "==", userId)
    .get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addFarm = async (userId, data) => {
  const ref = await firestore()
    .collection("farms")
    .add({ ...data, userId, createdAt: firestore.FieldValue.serverTimestamp() });
  return ref.id;
};

export const getFieldsByFarmIds = async (farmIds) => {
  if (!farmIds.length) return [];
  const snap = await firestore()
    .collection("fields")
    .where("farmId", "in", farmIds)
    .get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addField = async (data) => {
  const ref = await firestore()
    .collection("fields")
    .add({ ...data, createdAt: firestore.FieldValue.serverTimestamp() });
  return ref.id;
};

export const updateField = async (fieldId, data) => {
  await firestore().collection("fields").doc(fieldId).update(data);
};

export const deleteField = async (fieldId) => {
  await firestore().collection("fields").doc(fieldId).delete();
};
