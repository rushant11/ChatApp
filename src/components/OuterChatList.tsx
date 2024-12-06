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
import { dynamicSize } from "@utils";
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

export const OuterChatList = () => {
  const navigation = useNavigation();

  const [chattedUsers, setChattedUsers] = useState([]);
  console.log("🚀 ~ OuterChatList ~ chattedUsers:", chattedUsers);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [chattedUserName, setChattedUserName] = useState("");
  console.log("🚀 ~ OuterChatList ~ chattedUserName:", chattedUserName);
  const [lastMessage, setLastMessage] = useState("");

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
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUserEmail),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const participantsSet = new Set();

      querySnapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        console.log("🚀 ~ querySnapshot.docs.forEach ~ data:", data);

        if (index == 0) {
          const last_message = data.lastMessage;
          setLastMessage(last_message);
        }
        if (index == 0) {
          const participants = doc.data().participants;
          const currentUserIndex = participants.indexOf(currentUserEmail);
          const recipientEmail = participants[currentUserIndex === 0 ? 1 : 0];
          const recipientQuery = query(
            collection(db, "users"),
            where("email", "==", recipientEmail)
          );
          onSnapshot(recipientQuery, (recipientSnapshot) => {
            recipientSnapshot.docs.forEach((recipientDoc) => {
              const recipientData = recipientDoc.data();
              setChattedUserName(recipientData.username);
            });
          });
        }

        const participants = doc.data().participants;
        participants.forEach((participant: any) => {
          if (participant !== currentUserEmail) {
            participantsSet.add(participant);
          }
        });
      });
      setChattedUsers([...participantsSet]);
    });

    return () => unsubscribe();
  }, [currentUserEmail, lastMessage]);

  return (
    <FlatList
      data={chattedUsers}
      renderItem={({ item, index }) => {
        return (
          <>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Chat", {
                  username: chattedUserName,
                  recipient_email: item,
                })
              }
            >
              <View key={index} style={styles.container}>
                <View style={styles.innerContainer}>
                  <Image source={Images.NullProfile} style={styles.image} />
                  <View style={styles.space}>
                    <Text style={{ fontSize: 16, fontWeight: "600" }}>
                      {chattedUserName}
                    </Text>
                    <Text style={{ color: colors.PrimaryText }}>
                      {lastMessage}
                    </Text>
                  </View>
                </View>
                <View style={styles.space}>
                  <Text>{"2 min ago"}</Text>
                  <View style={styles.secondaryContainer}>
                    <Text style={{ fontSize: 12, color: colors.white }}>
                      {"0"}
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
