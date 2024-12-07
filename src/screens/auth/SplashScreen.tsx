import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useStore } from "src/zustand/useStore";
import { useAppState } from "@react-native-community/hooks";

const SplashScreen = ({ navigation }) => {
  const { userEmail, setUserStatus } = useStore();

  const currentAppState = useAppState();

  useEffect(() => {
    const checkUserStatus = async () => {
      if (currentAppState === "active") {
        setUserStatus("online");
      }
      if (currentAppState === "background") {
        setUserStatus("offline");
      }
    };

    checkUserStatus();
  }, [currentAppState]);

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
