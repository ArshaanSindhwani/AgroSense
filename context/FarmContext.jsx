import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { useAuthContext } from "./AuthContext";
import { getFarmsByUser, getFieldsByFarmIds } from "../services/firebase/firestore";

const FarmContext = createContext();

export function FarmProvider({ children }) {
  const { user, isAuthenticated } = useAuthContext();
  const [farms, setFarms] = useState([]);
  const [fields, setFields] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFarmsAndFields = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const userFarms = await getFarmsByUser(user.uid);
      setFarms(userFarms);
      if (userFarms.length > 0) {
        const farmIds = userFarms.map((f) => f.id);
        const userFields = await getFieldsByFarmIds(farmIds);
        setFields(userFields);
      } else {
        setFields([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      loadFarmsAndFields();
    } else {
      setFarms([]);
      setFields([]);
    }
  }, [isAuthenticated, loadFarmsAndFields]);

  return (
    <FarmContext.Provider
      value={{
        farms,
        fields,
        selectedFarm,
        setSelectedFarm,
        selectedField,
        setSelectedField,
        loading,
        error,
        refresh: loadFarmsAndFields,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
}

export function useFarmContext() {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error("useFarmContext must be used within FarmProvider");
  }
  return context;
}
