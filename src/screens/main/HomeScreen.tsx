import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";
import { StatusBar } from "expo-status-bar";
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
      {/* <SafeAreaView style={styles.safeArea}> */}
        <View style={styles.main}>
          <View style={styles.headerContainer}>
            <CustomHeader
              onPress={() => navigation.navigate("AddUser")}
              headerName="Chats"
              leftIcon={true}
            />
          </View>
          <View style={styles.content}>
            <OuterChatList />
          </View>
          <TouchableOpacity
            onPress={handleSignout}
            activeOpacity={0.7}
            style={styles.button}
          >
            <Text style={styles.logoutTxt}>Logout</Text>
          </TouchableOpacity>
        </View>
      {/* </SafeAreaView> */}
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  main: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
    backgroundColor: "#FFFFFF",
    zIndex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: dynamicSize(15),
    marginBottom: dynamicSize(20),
  },
  button: {
    marginBottom: dynamicSize(25),
    backgroundColor: "red",
    paddingVertical: dynamicSize(12),
    paddingHorizontal: dynamicSize(25),
    borderRadius: 10,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  logoutTxt: {
    color: "white",
    fontWeight: "600",
    fontSize: dynamicSize(16),
  },
});
