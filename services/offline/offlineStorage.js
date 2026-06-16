import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getStorageItem(key) {
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export async function setStorageItem(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeStorageItem(key) {
  await AsyncStorage.removeItem(key);
}