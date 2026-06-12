// mock functions to view the app on iPhone Expo Go

// export async function registerUser(email, password) {
//   if (!email || !password) {
//     throw new Error('Please enter an email and password.');
//   }

//   return {
//     uid: 'mock-user-id',
//     email,
//   };
// }

// export async function loginUser(email, password) {
//   if (!email || !password) {
//     throw new Error('Please enter your email and password.');
//   }

//   return {
//     uid: 'mock-user-id',
//     email,
//   };
// }

// export async function logoutUser() {
//   return true;
// }

// firebase connection

import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from '@react-native-firebase/auth'

const auth =getAuth()

export async function registerUser(email, password) {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    return 'User successfully created!'
  } catch (error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new Error('That email address is already in use.');
      case 'auth/invalid-email':
        throw new Error('That email address is invalid.');
      default:
        throw new Error('Something went wrong. Please try again.');
    }
  }
}

export async function loginUser(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    switch (error.code) {
      case 'auth/user-not-found':
        throw new Error('No account found with that email.');
      case 'auth/wrong-password':
        throw new Error('Incorrect password.');
      case 'auth/invalid-email':
        throw new Error('That email address is invalid.');
      case 'auth/too-many-requests':
        throw new Error('Too many attempts. Please try again later.');
      default:
        throw new Error('Something went wrong. Please try again.');
    }
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error('Failed to log out. Please try again.');
  }
}