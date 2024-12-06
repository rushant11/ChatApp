import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useStore } from "src/zustand/useStore";

const SplashScreen = ({ navigation }) => {
  const { userEmail } = useStore();
  console.log("🚀 ~ HomeScreen ~ userEmail:", userEmail);

  useEffect(() => {
    setTimeout(() => {
      const checkUser = async () => {
        if (userEmail !== null) {
          navigation.replace("Home");
        } else {
          navigation.replace("Login");
        }
      };
      checkUser();
    }, 1500);
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
