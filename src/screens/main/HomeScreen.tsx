import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  StatusBar as RNStatusBar,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { CustomHeader } from "@components";
import { useNavigation } from "@react-navigation/native";
import { OuterChatList } from "src/components/OuterChatList";
import { auth } from "App";
import { useStore } from "src/zustand/useStore";
import { dynamicSize } from "@utils";
import { SafeAreaView } from "react-native-safe-area-context";
import { Images } from "@Images";
import { colors } from "@theme";
import { LogoutConfirmationModal } from "src/components/ConfirmationPopup";

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { setUserEmail, currentUsername } = useStore();
  console.log(
    "'🚀'🚀'🚀 ~ file: HomeScreen.tsx:22 ~ HomeScreen ~ currentUsername:👉 ",
    currentUsername
  );

  const [isModalVisible, setModalVisible] = useState(false);
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
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.main}>
          <View style={styles.headerContainer}>
            <CustomHeader
              onPress={() => navigation.navigate("AddUser")}
              headerName="Chats"
              leftIcon={true}
              friendRequest
            />
          </View>
          <View style={styles.content}>
            <OuterChatList />
          </View>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setModalVisible(true)}
          >
            <Image
              source={Images.logout}
              tintColor={colors.Primary}
              style={styles.logoutButton}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <LogoutConfirmationModal
        onLogout={handleSignout}
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: dynamicSize(8),
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
  logoutButton: {
    position: "absolute",
    right: dynamicSize(25),
    width: dynamicSize(44),
    bottom: dynamicSize(40),
    height: dynamicSize(44),
  },
  logoutTxt: {
    color: "white",
    fontWeight: "600",
    fontSize: dynamicSize(16),
  },
});
