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
import { Images } from "@Images";
import { useNavigation } from "@react-navigation/native";

type headerProps = {
  back?: boolean;
  style?: ViewStyle;
  leftIcon?: boolean;
  headerName?: string;
  onPress?: () => void;
  activeStatus?: string;
  friendRequest?: boolean;
};

export const CustomHeader = (props: headerProps) => {
  const navigation = useNavigation();
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

        <View
          style={[
            styles.iconContainer,
            {
              // paddingHorizontal: dynamicSize(20),
              right: dynamicSize(20),
            },
          ]}
        >
          {props.friendRequest && (
            <TouchableOpacity
              onPress={() => navigation.navigate("ManageRequests")}
            >
              <Image
                source={Images.add_users}
                style={{ height: dynamicSize(22), width: dynamicSize(22) }}
              />
            </TouchableOpacity>
          )}
          <Image
            source={{
              uri: `https://ui-avatars.com/api/?background=${randomColor?.[userEmail]}&color=FFF&name=${currentUsername}`,
            }}
            style={[
              styles.image,
              { left: !props.friendRequest && dynamicSize(20) },
            ]}
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
    backgroundColor: "#FFFFFF",
    paddingTop: dynamicSize(10),
    paddingHorizontal: dynamicSize(20),
  },
  iconContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: dynamicSize(15),
    justifyContent: "center",
  },
  headerTextContainer: {
    flex: 8,
    alignItems: "center",
    justifyContent: "center",
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
