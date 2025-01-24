import { MMKV } from "react-native-mmkv";

export const configureMMKVforZustand = (
  id = new Date().getTime().toString()
) => {
  const mmkv = new MMKV({ id });
  return {
    getItem: (str) => mmkv.getString(str) ?? "",
    setItem: (key, val) => mmkv.set(key, val?.toString()),
    removeItem: (key) => mmkv.delete(key),
  };
};
