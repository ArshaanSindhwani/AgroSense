
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore"

const auth =getAuth()
// import auth from "@react-native-firebase/auth";
// import firestore from "@react-native-firebase/firestore";

export async function registerUser(email, password) {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email.trim(),
      password
    );

    const user = userCredential.user;

    await firestore().collection("users").doc(user.uid).set({
      userId: user.uid,
      email: email.trim().toLowerCase(),
      role: "farmer",
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

    return "User successfully created!";
  } catch (error) {
    switch (error.code) {
      case "auth/email-already-in-use":
        throw new Error("That email address is already in use.");
      case "auth/invalid-email":
        throw new Error("That email address is invalid.");
      case "auth/weak-password":
        throw new Error("Password must be at least 6 characters.");
      default:
        throw new Error("Something went wrong. Please try again.");
    }
  }
}

export async function loginUser(email, password) {
  try {
    await auth().signInWithEmailAndPassword(email.trim(), password);
  } catch (error) {
    switch (error.code) {
      case "auth/user-not-found":
        throw new Error("No account found with that email.");
      case "auth/wrong-password":
        throw new Error("Incorrect password.");
      case "auth/invalid-email":
        throw new Error("That email address is invalid.");
      case "auth/too-many-requests":
        throw new Error("Too many attempts. Please try again later.");
      default:
        throw new Error("Something went wrong. Please try again.");
    }
  }
}

export async function logoutUser() {
  try {
    await auth().signOut();
  } catch (error) {
    throw new Error("Failed to log out. Please try again.");
  }
}