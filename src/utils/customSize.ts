import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

const STANDARD_WIDTH = 375;
export const CURRENT_WIDTH = width;
export const CURRENT_HEIGHT = height;
export const SCREEN_HEIGHT = Dimensions.get("screen").height;
const K = CURRENT_WIDTH / (Platform.OS === "android" ? 400 : 390);

const USE_FOR_BIGGER_SIZE = true;

export function dynamicSize(size: number) {
  return K * size;
}

export function getFontSize(size: number) {
  if (USE_FOR_BIGGER_SIZE || CURRENT_WIDTH < STANDARD_WIDTH) {
    return dynamicSize(size);
  }
  return size;
}
