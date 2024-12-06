import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { dynamicSize } from "@utils";
import { colors } from "@theme";
import { Divider } from "./Divider";
import { auth, db } from "App";
import { collection, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { useStore } from "src/zustand/useStore";

export const ContactsList = () => {
  const navigation = useNavigation();
  const [otherUserInfo, setOtherUserInfo] = useState<any>({});
  const { randomColor, setRandomColor } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = [];
        const newEmailToColorMap = { ...randomColor };
        console.log("🚀 ~ fetchData ~ newEmailToColorMap:", newEmailToColorMap);

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          const userEmail = userData.email;

          if (!newEmailToColorMap[userEmail]) {
            newEmailToColorMap[userEmail] = Math.floor(
              Math.random() * 16777215
            ).toString(16);
          }

          usersData.push({
            id: doc.id,
            ...doc.data(),
            randomColor: newEmailToColorMap[userEmail],
          });
        });

        const otherUsers = usersData.filter(
          (user) => user.email !== auth?.currentUser?.email
        );
        setRandomColor(newEmailToColorMap);
        setOtherUserInfo(otherUsers);
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
        const sortedContacts = [...otherUserInfo].sort((a, b) => {
          return a.username.localeCompare(b.username);
        });

        return (
          <>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Chat", {
                  username: sortedContacts[index].username,
                  recipient_email: sortedContacts[index].email,
                });
              }}
            >
              <View key={index} style={styles.container}>
                <View style={styles.innerContainer}>
                  <Image
                    source={{
                      uri: `https://ui-avatars.com/api/?background=${item.randomColor}&color=FFF&name=${item?.username}`,
                    }}
                    style={styles.image}
                  />
                  <View style={styles.space}>
                    <Text>{sortedContacts[index].username}</Text>
                    <Text style={{ color: colors.PrimaryGrey }}>
                      {"Last seen recently"}
                    </Text>
                  </View>
                </View>
                <Text style={{ color: colors.PrimaryText }}>{"Message"}</Text>
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
    borderRadius: dynamicSize(38),
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
