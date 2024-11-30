import React from "react";
import {
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

const LoginScreen = ({ navigation }) => {
  const handleNavigation = () => {
    navigation.navigate("Register");
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
              <TextInput style={styles.input} placeholder="Email" />
              <TextInput style={styles.input} placeholder="Password" />
            </View>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <View style={styles.secondaryText}>
              <Text>Didn't have an account?</Text>
              <Text
                onPress={handleNavigation}
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

export default LoginScreen;

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
