import React from "react";
import { ContactsList, CustomHeader } from "@components";
import { StatusBar } from "expo-status-bar";
import {  StyleSheet, View } from "react-native";

export const AddUser = ({ navigation }) => {
  return (
    <>
      <StatusBar backgroundColor={"#FFFFFF"} style="dark" />
      {/* <SafeAreaView style={styles.main}> */}
        <View style={styles.main}>
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
      {/* </SafeAreaView> */}
    </>
  );
};

export const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
