import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Images } from "@Images";
import { dynamicSize, getFontSize } from "@utils";
import { colors } from "@theme";
import { Divider } from "./Divider";
import { auth, db } from "App";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { useStore } from "src/zustand/useStore";

export const OuterChatList = () => {
  const navigation = useNavigation();
  const [chattedUsers, setChattedUsers] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const {
    randomColor,
    messages,
    setMessages,
    setIsChatSelected,
    isChatSelected,
  } = useStore();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user?.email) {
        setCurrentUserEmail(user.email);
      } else {
        setCurrentUserEmail(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useLayoutEffect(() => {
    if (!currentUserEmail) return;

    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUserEmail),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const usersData = new Map();

      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        const participants = data.participants;

        const recipientEmail = participants.find(
          (email: string) => email !== currentUserEmail
        );

        if (recipientEmail) {
          const userQuery = query(
            collection(db, "users"),
            where("email", "==", recipientEmail)
          );
          const userSnapshot = await getDocs(userQuery);
          userSnapshot.forEach((userDoc) => {
            const userData = userDoc.data();
            const existingData = usersData.get(recipientEmail);

            if (!existingData || data.createdAt > existingData.createdAt) {
              usersData.set(recipientEmail, {
                username: userData.username,
                email: userData.email,
                lastMessage: data.lastMessage,
                createdAt: data.createdAt,
              });
            }
          });
        }
      }
      setChattedUsers(Array.from(usersData.values()));
    });

    return () => unsubscribe();
  }, [currentUserEmail]);

  return (
    <FlatList
      data={chattedUsers}
      renderItem={({ item, index }) => {
        console.log(
          "🚀 ~ OuterChatList ~ item.lastmessage:",
          item?.lastMessage
        );
        return (
          <TouchableOpacity
            onPress={() => {
              setIsChatSelected(false);
              navigation.navigate("Chat", {
                username: item.username,
                recipient_email: item.email,
              });
            }}
          >
            <View key={index} style={styles.container}>
              <View style={styles.innerContainer}>
                <Image
                  source={{
                    uri: `https://ui-avatars.com/api/?background=${
                      randomColor?.[item?.email]
                    }&color=FFF&name=${item?.username}`,
                  }}
                  style={styles.image}
                />
                <View style={styles.space}>
                  <Text style={{ fontSize: 16, fontWeight: "600" }}>
                    {item?.username}
                  </Text>
                  <Text style={{ color: colors.PrimaryText }}>
                    {item?.lastMessage}
                  </Text>
                </View>
              </View>
              <View style={styles.space}>
                <Text>{"2 min ago"}</Text>
                {isChatSelected && (
                  <View style={styles.secondaryContainer}>
                    <Text
                      style={{ fontSize: getFontSize(13), color: colors.white }}
                    >
                      {'0'}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <Divider />
          </TouchableOpacity>
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
    gap: dynamicSize(5),
  },
  innerContainer: {
    flexDirection: "row",
    gap: dynamicSize(10),
  },
  secondaryContainer: {
    height: dynamicSize(18),
    width: dynamicSize(18),
    borderRadius: dynamicSize(18),
    backgroundColor: colors.Primary,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
});
