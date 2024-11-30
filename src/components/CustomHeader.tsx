import { getFontSize } from "@utils";
import React from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";

const CustomHeader = () => {
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text>+</Text>
        <Text style={{ fontSize: getFontSize(18), fontWeight: "bold" }}>
          Chats
        </Text>
        <Text>+</Text>
      </View>
    </>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({});
