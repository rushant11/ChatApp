import React from "react";
import { StyleSheet, View } from "react-native";

export const Divider = (props: any) => {
  return <View style={[styles.container, props.style]}></View>;
};

const styles = StyleSheet.create({
  container: {
    height: 0.5,
    backgroundColor: "lightgrey",
    width: "100%",
  },
});
