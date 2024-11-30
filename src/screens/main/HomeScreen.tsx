import React from "react";
import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, View } from "react-native";
import CustomHeader from "src/components/CustomHeader";

const HomeScreen = () => {
  return (
    <>
      <StatusBar backgroundColor={"white"} style="dark" />

      <View style={{ flex: 1, marginTop: 50 }}>
        <View style={{ paddingHorizontal: 15 }}>
          <CustomHeader />
        </View>
      </View>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
