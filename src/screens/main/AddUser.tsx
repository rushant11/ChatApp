import React from "react";
import { ContactsList, CustomHeader } from "@components";
import { dynamicSize } from "@utils";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export const AddUser = ({ navigation }) => {
  return (
    <>
      <StatusBar backgroundColor={"#FFFFFF"} style="dark" />
      <View
        style={{
          flex: 1,
          paddingTop: dynamicSize(45),
          backgroundColor: "#FFFFFF",
        }}
      >
        <CustomHeader
          headerName="Contacts"
          leftIcon={true}
          back={true}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <ContactsList />
      </View>
    </>
  );
};
