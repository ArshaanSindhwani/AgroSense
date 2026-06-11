import firestore from "@react-native-firebase/firestore";

//Users
async function addUser(user) {
  return firestore()
    .collection("users")
    .add({
      ...user,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
}

async function deleteUser(userId) {
  return firestore().collection("users").doc(userId).delete();
}

//Farms

//Fields

//Observations

//Recommendations
