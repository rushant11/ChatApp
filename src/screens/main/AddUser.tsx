import React from "react";
import { ContactsList, CustomHeader } from "@components";
import { dynamicSize } from "@utils";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export const AddUser = () => {
  return (
    <>
      <StatusBar backgroundColor={"white"} style="dark" />
      <View style={{ flex: 1, marginTop: dynamicSize(50) }}>
        <CustomHeader headerName="Contacts" leftIcon={false} />
        <ContactsList />
      </View>
    </>
  );
};
