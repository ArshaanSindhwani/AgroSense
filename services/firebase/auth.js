import auth from '@react-native-firebase/auth';

export async function registerUser(email, password) {
  try {
    await auth().createUserWithEmailAndPassword(email, password);
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
    await auth().signInWithEmailAndPassword(email, password);
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
    await auth().signOut();
  } catch (error) {
    throw new Error('Failed to log out. Please try again.');
  }
}