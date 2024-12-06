import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkUser = async () => {
      const isUSerUid = await AsyncStorage.getItem("user");
      if (isUSerUid !== null) {
        setTimeout(() => {
          navigation.replace("Home");
        }, 1500);
      } else {
        setTimeout(() => {
          navigation.replace("Login");
        }, 1500);
      }
    };

    checkUser();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.splashText}>ChatApp</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  splashText: {
    color: "white",
    fontSize: 44,
    fontWeight: "bold",
    letterSpacing: 2,
  },
});
