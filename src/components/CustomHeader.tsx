import React from "react";
import { Add } from "@Icons";
import { Images } from "@Images";
import { dynamicSize, getFontSize } from "@utils";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Divider } from "@components";

type headerProps = {
  onPress?: () => void;
  style?: ViewStyle;
  headerName?: string;
  leftIcon?: boolean;
};

export const CustomHeader = (props: headerProps) => {
  return (
    <>
      <View style={[styles.container, props.style]}>
        <TouchableOpacity onPress={props.onPress}>
          {props.leftIcon ? <Add /> : null}
        </TouchableOpacity>
        <Text style={styles.headerText}>{props.headerName}</Text>
        <Image source={Images.NullProfile} style={styles.image} />
      </View>
      <Divider
        style={{
          marginTop: dynamicSize(15),
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: dynamicSize(15),
  },
  image: {
    height: dynamicSize(34),
    width: dynamicSize(34),
  },
  headerText: {
    fontSize: getFontSize(18),
    fontWeight: "bold",
    alignSelf: "center",
    textAlign: "center",
  },
});
