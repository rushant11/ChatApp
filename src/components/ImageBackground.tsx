import React from "react";
import { Image, StyleSheet } from "react-native";
import { Images } from "../../utils/ImagePath";

const ImageBackground = () => {
  return <Image source={Images.BG} resizeMode="contain" style={styles.image} />;
};

export default ImageBackground;

const styles = StyleSheet.create({
  image: {
    height: "100%",
    width: "100%",
    overflow: "hidden",
    position: "absolute",
  },
});
