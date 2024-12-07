import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CustomHeader } from "@components";
import { useNavigation } from "@react-navigation/native";
import { OuterChatList } from "src/components/OuterChatList";
import { auth } from "App";
import { useStore } from "src/zustand/useStore";
import { dynamicSize } from "@utils";

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { setUserEmail } = useStore();

  const handleSignout = () => {
    auth.signOut().then(async () => {
      setUserEmail(null);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    });
  };

  return (
    <>
      <StatusBar backgroundColor={"#FFFFFF"} style="dark" />
      <View style={styles.main}>
        <CustomHeader
          onPress={() => navigation.navigate("AddUser")}
          headerName="Chats"
          leftIcon={true}
        />
        <OuterChatList />
        <TouchableOpacity
          onPress={handleSignout}
          activeOpacity={0.5}
          style={styles.button}
        >
          <Text style={styles.logoutTxt}>Logout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingTop: dynamicSize(45),
    backgroundColor: "#FFFFFF",
  },
  button: {
    bottom: dynamicSize(25),
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutTxt: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
