import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CustomHeader } from "@components";
import { useNavigation } from "@react-navigation/native";
import { OuterChatList } from "src/components/OuterChatList";
import { auth } from "App";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const HomeScreen = () => {
  const navigation = useNavigation();

  const handleSignout = () => {
    auth.signOut().then(async () => {
      await AsyncStorage.removeItem("user");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    });
  };

  return (
    <>
      <StatusBar backgroundColor={"white"} style="dark" />
      <View style={styles.main}>
        <CustomHeader
          onPress={() => navigation.navigate("AddUser")}
          headerName="Chats"
          leftIcon={true}
        />
        <OuterChatList />
      </View>
      <TouchableOpacity
        onPress={handleSignout}
        activeOpacity={0.5}
        style={styles.button}
      >
        <Text style={styles.logoutTxt}>Logout</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginTop: 50,
  },
  button: {
    alignSelf: "center",
    bottom: 35,
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutTxt: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
