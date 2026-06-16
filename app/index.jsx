import { Redirect } from "expo-router";

import { useAuthContext } from "../context/AuthContext";
import { FullScreenSpinner } from "../components/shared/LoadingSpinner";

export default function Index() {
  const { user, loading } = useAuthContext();

  if (loading) return <FullScreenSpinner />;

  if (user) return <Redirect href="/(tabs)/dashboard" />;

  return <Redirect href="/(auth)/login" />;
}