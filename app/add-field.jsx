import { useState } from "react";
import { useRouter } from "expo-router";

import { AddFieldForm } from "../components/forms/AddFieldForm";
import { useFarmContext } from "../context/FarmContext";
import { addField } from "../services/firebase/firestore";

export default function AddFieldScreen() {
  const router = useRouter();
  const { farms, refresh } = useFarmContext();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await addField(data);
      await refresh();
      router.back();
    } catch (err) {
      console.error("Failed to add field:", err);
    } finally {
      setLoading(false);
    }
  };

  return <AddFieldForm farms={farms} onSubmit={handleSubmit} loading={loading} />;
}
