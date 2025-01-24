import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { dynamicSize, getFontSize } from "@utils";
import { colors } from "@theme";
import { Divider } from "./Divider";
import { auth, db } from "App";
import { collection, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { useStore } from "src/zustand/useStore";
import { Images } from "@Images";

export const ContactsList = () => {
  const navigation = useNavigation();
  const [otherUserInfo, setOtherUserInfo] = useState<any>({});
  console.log(
    "'🚀'🚀'🚀 ~ file: ContactsList.tsx:22 ~ ContactsList ~ otherUserInfo:👉 ",
    otherUserInfo
  );

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

  const [requestedUser, setRequestedUsers] = useState([]);
  console.log(
    "'🚀'🚀'🚀 ~ file: ContactsList.tsx:67 ~ ContactsList ~ requestedUser:👉 ",
    requestedUser
  );

  const handleSendRequest = async (item: any) => {
    if (requestedUser.includes(item.email)) {
      setRequestedUsers((prev) =>
        prev.filter((user) => user.email === item?.email)
      );
    } else {
      setRequestedUsers((prev) => [...prev, item?.email]);
    }
  };

  return (
    <FlatList
      data={otherUserInfo}
      renderItem={({ item, index }) => {
        const sortedContacts = [...otherUserInfo].sort((a, b) => {
          return a.username.localeCompare(b.username);
        });

        const isRequestSent = requestedUser.includes(item.email);

        return (
          <>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Chat", {
                  username: sortedContacts[index].username,
                  recipient_email: sortedContacts[index].email,
                });
              }}
              key={index}
              style={styles.container}
            >
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
                    {isRequestSent
                      ? "You have sent a request"
                      : "Send request to message"}
                  </Text>
                </View>
              </View>

              {isRequestSent ? (
                <Text
                  style={{
                    fontSize: getFontSize(14),
                    color: colors.PrimaryText,
                  }}
                >
                  Request Sent
                </Text>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={styles.sendButtonStyle}
                  onPress={() => handleSendRequest(item)}
                >
                  <Text style={{ fontSize: getFontSize(14), color: "black" }}>
                    {"Send Request"}
                  </Text>
                  <Image source={Images.Request} style={styles.friendImage} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
            <Divider />
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
  sendButtonStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: dynamicSize(5),
    backgroundColor: colors.Primary,
    borderRadius: dynamicSize(5),
    padding: dynamicSize(5),
  },
  friendImage: { height: dynamicSize(20), width: dynamicSize(20) },
});
