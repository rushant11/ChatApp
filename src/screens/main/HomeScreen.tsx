import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { CustomHeader } from "@components";
import { useNavigation } from "@react-navigation/native";
import { OuterChatList } from "src/components/OuterChatList";

export const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <>
      <StatusBar backgroundColor={"white"} style="dark" />
      <View style={{ flex: 1, marginTop: 50 }}>
        <CustomHeader
          onPress={() => navigation.navigate("AddUser")}
          headerName="Chats"
          leftIcon={true}
        />
        {/* <OuterChatList /> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({});
