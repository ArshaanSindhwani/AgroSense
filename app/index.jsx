import { Redirect } from 'expo-router';
import { useAuthContext } from '../context/AuthContext';

export default function Index() {
  const { user, loading } = useAuthContext();

  if (loading) return null;

  if (user) return <Redirect href="/(tabs)/dashboard" />;

  return <Redirect href="/(auth)/login" />;
}