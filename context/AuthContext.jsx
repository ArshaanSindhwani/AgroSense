<<<<<<< HEAD

=======
>>>>>>> e140c5fcb2eb0bc5f393e6b5a185b7dee9c6f497
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import auth from "@react-native-firebase/auth";
import {
  loginUser,
  registerUser,
  logoutUser,
} from "../services/firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((currentUser) => {
      console.log("Auth state changed:", currentUser);
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function login(email, password) {
    try {
      setError(null);
      await loginUser(email, password);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function register(email, password) {
    try {
      setError(null);
      await registerUser(email, password);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function logout() {
    try {
      setError(null);
      await logoutUser();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  const value = {
    user,
    loading,
    error,
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
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return context;
}