import React from "react";
import { ContactsList, CustomHeader } from "@components";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { dynamicSize } from "@utils";

export const AddUser = ({ navigation }) => {
  return (
    <>
      <StatusBar backgroundColor={"#FFFFFF"} style="dark" />
      <SafeAreaView style={styles.main}>
      <View style={styles.main}>
        <CustomHeader
          headerName="Add Contacts"
          leftIcon={true}
          back={true}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <ContactsList />
      </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: dynamicSize(5)
  },
});
