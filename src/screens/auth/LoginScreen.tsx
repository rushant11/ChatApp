import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ImageBackground } from "@components";
import { dynamicSize, getFontSize } from "@utils";
import { colors } from "@theme";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "App";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginUser = async () => {
    if (email && password) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        if (user) {
          await AsyncStorage.setItem("user", user.uid);
          navigation.replace("Home");
        }
      } catch (error) {
        console.error("Login error:", error);
        Alert.alert("Login failed. Please try again.");
      }
    } else {
      Alert.alert("Please fill all the details.");
    }
  };

  return (
    <>
      <View style={styles.container}>
        <ImageBackground />
        <View style={styles.main}>
          <KeyboardAwareScrollView
            style={{ marginVertical: dynamicSize(10) }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={"handled"}
          >
            <Text style={styles.login}>Log In</Text>
            <View style={styles.credContainer}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholder="Email"
              />
              <TextInput
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                placeholder="Password"
              />
            </View>
            <TouchableOpacity onPress={handleLoginUser} style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <View style={styles.secondaryText}>
              <Text>Didn't have an account?</Text>
              <Text
                onPress={() => navigation.navigate("Register")}
                style={{ color: colors.PrimaryText }}
              >
                Sign up here
              </Text>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  login: {
    fontSize: getFontSize(28),
    color: colors.PrimaryText,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: dynamicSize(35),
  },
  main: {
    height: "65%",
    width: "100%",
    backgroundColor: colors.white,
    borderTopLeftRadius: dynamicSize(50),
    paddingHorizontal: dynamicSize(30),
    position: "absolute",
    bottom: 0,
  },
  input: {
    backgroundColor: colors.PrimaryInput,
    width: "100%",
    borderRadius: dynamicSize(10),
    marginTop: dynamicSize(20),
    height: dynamicSize(55),
    padding: dynamicSize(15),
  },
  button: {
    backgroundColor: colors.Primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: dynamicSize(10),
    marginTop: dynamicSize(70),
    height: dynamicSize(55),
  },
  buttonText: {
    fontSize: getFontSize(18),
    color: colors.white,
    alignSelf: "center",
  },
  credContainer: {
    alignItems: "center",
    marginTop: dynamicSize(30),
  },
  secondaryText: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 20,
    gap: 5,
  },
});
