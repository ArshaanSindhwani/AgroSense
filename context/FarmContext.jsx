import { createContext, useContext, useState } from "react";

const FarmContext = createContext();

export function FarmProvider({ children }) {
  const [selectedField, setSelectedField] = useState(null);

  return (
    <FarmContext.Provider
      value={{
        selectedField,
        setSelectedField,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
}

export function useFarmContext() {
  return useContext(FarmContext);
}