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
import { colors } from "@theme";

const RegisterScreen = ({ navigation }) => {
  const handleNavigation = () => {
    navigation.reset({
      index: 1,
      routes: [
        {
          name: "Login",
        },
      ],
    });
  };

  return (
    <View style={styles.container}>
      <ImageBackground />
      <View style={styles.main}>
        <KeyboardAwareScrollView
          style={{ marginVertical: 10 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.login}>Sign Up</Text>
          <View style={styles.credContainer}>
            <TextInput style={styles.input} placeholder="Full Name" />
            <TextInput style={styles.input} placeholder="Email" />
            <TextInput style={styles.input} placeholder="Password" />
          </View>
          <TouchableOpacity style={styles.button}>
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
