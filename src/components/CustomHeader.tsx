import React from "react";
import { Add, BackButton } from "@Icons";
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
import { useStore } from "@zustand";

type headerProps = {
  onPress?: () => void;
  style?: ViewStyle;
  headerName?: string;
  leftIcon?: boolean;
  back?: boolean;
  activeStatus?: string;
};

export const CustomHeader = (props: headerProps) => {
  const { currentUsername, userEmail, randomColor } = useStore();

  return (
    <>
      <View style={[styles.container, props.style]}>
        <View style={styles.iconContainer}>
          {props.leftIcon && (
            <TouchableOpacity onPress={props.onPress}>
              {props.back ? <BackButton /> : <Add />}
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>{props.headerName}</Text>
          {props.activeStatus && (
            <Text
              style={[
                styles.headerText,
                {
                  fontSize: getFontSize(14),
                  color: "green",
                  fontWeight: "600",
                },
              ]}
            >
              {props.activeStatus}
            </Text>
          )}
        </View>

        <View style={styles.iconContainer}>
          <Image
            source={{
              uri: `https://ui-avatars.com/api/?background=${randomColor?.[userEmail]}&color=FFF&name=${currentUsername}`,
            }}
            style={styles.image}
          />
        </View>
      </View>

      <Divider style={styles.divider} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: dynamicSize(15),
    backgroundColor: "#FFFFFF",
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: dynamicSize(36),
    width: dynamicSize(36),
    borderRadius: dynamicSize(36),
  },
  headerText: {
    fontWeight: "bold",
    fontSize: getFontSize(18),
    textAlign: "center",
  },
  divider: {
    marginTop: dynamicSize(15),
  },
});
