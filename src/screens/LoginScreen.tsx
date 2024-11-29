import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../utils/colors";
import ImageBackground from "../components/ImageBackground";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const LoginScreen = ({ navigation }) => {
  const handleNavigation = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <ImageBackground />
      <View style={styles.main}>
        <KeyboardAwareScrollView
          style={{ marginVertical: 10 }}
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
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
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: "100%",
    width: "100%",
    overflow: "hidden",
    position: "absolute",
  },
  login: {
    fontSize: 28,
    color: colors.PrimaryText,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 55,
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
    marginTop: 120,
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
