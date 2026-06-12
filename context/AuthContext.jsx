
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { loginUser, registerUser, logoutUser } from '../services/firebase/auth';

const auth = getAuth();
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
        console.log('Auth state changed:', currentUser)
        setUser(currentUser);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  async function login(email, password) {
    try {
      setError(null);
      await loginUser(email, password);
    } catch (err) {
      setError(err.message);
    }
  }

  async function register(email, password) {
    try {
      setError(null);
      await registerUser(email, password);
    } catch (err) {
      setError(err.message);
    }
  }

  async function logout() {
    try {
      setError(null);
      await logoutUser();
    } catch (err) {
      setError(err.message);
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used within AuthProvider"
    );
  }

  return context;
}