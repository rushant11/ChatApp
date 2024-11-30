import React from "react";
import { Images } from "@Images";
import { Image, StyleSheet } from "react-native";

export const ImageBackground = () => {
  return <Image source={Images.BG}  style={styles.image} />;
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    overflow: "hidden",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
