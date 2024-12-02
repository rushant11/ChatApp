import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Images } from "@Images";
import { dynamicSize } from "@utils";
import { colors } from "@theme";
import { Divider } from "./Divider";
import { auth, db } from "App";
import { collection, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export const OuterChatList = () => {
  const navigation = useNavigation();
  const [otherUserInfo, setOtherUserInfo] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = [];
        querySnapshot.forEach((doc) => {
          usersData.push({ id: doc.id, ...doc.data() });
        });
        console.log("🚀 ~ fetchData ~ usersData:", usersData);

        const otherUsers = usersData.filter(
          (user) => user.email !== auth?.currentUser?.email
        );
        if (otherUsers) {
          setOtherUserInfo(otherUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <FlatList
      data={otherUserInfo}
      renderItem={({ item, index }) => {
        return (
          <>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Chat", { username: item.username })
              }
            >
              <View key={index} style={styles.container}>
                <View style={styles.innerContainer}>
                  <Image source={Images.NullProfile} style={styles.image} />
                  <View style={styles.space}>
                    <Text>{item.username}</Text>
                    <Text style={{ color: colors.PrimaryText }}>
                      {"Hello, How are you?"}
                    </Text>
                  </View>
                </View>
                <View style={styles.space}>
                  <Text>{"2 min ago"}</Text>
                  <View style={styles.secondaryContainer}>
                    <Text style={{ fontSize: 12, color: colors.white }}>
                      {"1"}
                    </Text>
                  </View>
                </View>
              </View>
              <Divider />
            </TouchableOpacity>
          </>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: dynamicSize(15),
    paddingVertical: dynamicSize(20),
  },
  image: {
    height: dynamicSize(38),
    width: dynamicSize(38),
  },
  space: {
    gap: 5,
  },
  innerContainer: {
    flexDirection: "row",
    gap: dynamicSize(10),
  },
  secondaryContainer: {
    height: dynamicSize(15),
    width: dynamicSize(15),
    backgroundColor: colors.Primary,
    borderRadius: dynamicSize(10),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
});
