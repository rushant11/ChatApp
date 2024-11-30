import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ImageBackground } from "@components";
import { colors } from "@theme";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "App";
import { collection, addDoc } from "firebase/firestore";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleNavigation = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const addToFireStore = async () => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        username: name,
        email: email,
        password: password,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleRegisterUser = () => {
    if (name && email && password) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          addToFireStore();
          handleNavigation();
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          if (errorCode === "auth/email-already-in-use") {
            console.log("That email address is already in use!");
          } else if (errorCode === "auth/invalid-email") {
            console.log("That email address is invalid!");
          } else {
            console.log(errorMessage);
          }
        });
    } else {
      console.log("Please fill all the fields!");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground />
      <View style={styles.main}>
        <KeyboardAwareScrollView
          style={{ marginVertical: 10 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={"handled"}
        >
          <Text style={styles.login}>Sign Up</Text>
          <View style={styles.credContainer}>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholder="Full Name"
            />
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholder="Password"
            />
          </View>
          <TouchableOpacity onPress={handleRegisterUser} style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <View style={styles.secondaryText}>
            <Text>Do you have an account?</Text>
            <Text
              onPress={handleNavigation}
              style={{ color: colors.PrimaryText }}
            >
              Login here
            </Text>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    height: "65%",
    width: "100%",
    backgroundColor: colors.white,
    borderTopLeftRadius: 50,
    paddingHorizontal: 30,
    position: "absolute",
    bottom: 0,
  },
  login: {
    fontSize: 28,
    color: colors.PrimaryText,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 55,
  },
  input: {
    backgroundColor: colors.PrimaryInput,
    width: "100%",
    borderRadius: 10,
    marginTop: 24,
    height: 55,
    padding: 15,
  },
  button: {
    backgroundColor: colors.Primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 60,
    height: 55,
  },
  buttonText: {
    fontSize: 18,
    color: colors.white,
    alignSelf: "center",
  },
  credContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  secondaryText: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 20,
    gap: 5,
  },
});
