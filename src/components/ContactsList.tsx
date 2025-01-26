import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { auth, db } from "App";
import { colors } from "@theme";
import { Divider } from "./Divider";
import { dynamicSize, getFontSize } from "@utils";
import { addDoc, collection, getDocs, onSnapshot } from "firebase/firestore";
import { Images } from "@Images";
import { useStore } from "src/zustand/useStore";
import { useNavigation } from "@react-navigation/native";

export const ContactsList = () => {
  const navigation = useNavigation();
  const [otherUserInfo, setOtherUserInfo] = useState<any>([]);
  const { requests, setRequests, requestedUser, setRequestedUser } = useStore();
  const { randomColor, setRandomColor, currentUsername, removeRequestedUser } =
    useStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = [];
        const newEmailToColorMap = { ...randomColor };

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
        setOtherUserInfo(
          otherUsers.sort((a, b) => b.username.localeCompare(a.username))
        );
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "requests"), (snapshot) => {
      const allRequests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const pendingRequests = allRequests.filter(
        (req) =>
          req.status === "pending" && req.sender === auth.currentUser.email
      );
      const acceptedRequests = allRequests.filter(
        (req) =>
          req.status === "accepted" &&
          (req.sender === auth.currentUser.email ||
            req.receiver === auth.currentUser.email)
      );
      const rejectedRequests = allRequests.filter(
        (req) =>
          req.status === "rejected" && req.receiver === auth.currentUser.email
      );

      // Update states
      setRequests([...pendingRequests, ...acceptedRequests]);

      // Remove rejected users from the `requestedUser` state
      rejectedRequests.forEach((req) => {
        removeRequestedUser(req.sender);
        setRequestedUser((prevRequested) =>
          prevRequested.filter((email) => email !== req.sender)
        );
      });
    });

    return () => unsubscribe();
  }, []);

  const isRequestAccepted = (item) => {
    return requests?.some(
      (req) =>
        ((req?.sender === auth?.currentUser?.email &&
          req?.receiver === item?.email) ||
          (req?.receiver === auth?.currentUser?.email &&
            req?.sender === item?.email)) &&
        req?.status === "accepted"
    );
  };

  const isRequestPending = (item) => {
    return requests.some(
      (req) =>
        req.sender === auth.currentUser.email &&
        req.receiver === item.email &&
        req.status === "pending"
    );
  };

  const handleSendRequest = useCallback(
    async (item) => {
      try {
        if (!requestedUser.includes(item.email)) {
          await addDoc(collection(db, "requests"), {
            currentUsername,
            sender: auth.currentUser.email,
            receiver: item.email,
            status: "pending",
          });

          setRequestedUser((prevRequested) => [...prevRequested, item.email]);
        } else {
          console.log("Request already sent");
        }
      } catch (error) {
        console.error("Error sending request:", error);
      }
    },
    [requestedUser, currentUsername]
  );

  return (
    <FlatList
      data={otherUserInfo}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const isAccepted = isRequestAccepted(item);
        const isPending = isRequestPending(item);

        return (
          <>
            <TouchableOpacity activeOpacity={1} style={styles.container}>
              <View style={styles.innerContainer}>
                <Image
                  source={{
                    uri: `https://ui-avatars.com/api/?background=${item.randomColor}&color=FFF&name=${item?.username}`,
                  }}
                  style={styles.image}
                />
                <View style={styles.space}>
                  <Text>{item.username}</Text>
                  <Text style={{ color: colors.PrimaryGrey }}>
                    {isAccepted
                      ? "You can now message this user"
                      : isPending
                        ? "You have sent a request"
                        : "Send request to message"}
                  </Text>
                </View>
              </View>

              {isAccepted ? (
                <Text
                  onPress={() => {
                    navigation.navigate("Chat", {
                      username: item.username,
                      recipient_email: item.email,
                    });
                  }}
                  style={styles.messageButton}
                >
                  Message
                </Text>
              ) : isPending ? (
                <Text style={styles.requestSentText}>Request Sent</Text>
              ) : (
                <TouchableOpacity
                  style={styles.sendButtonStyle}
                  onPress={() => handleSendRequest(item)}
                >
                  <Text style={styles.sendButtonText}>Send Request</Text>
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
  sendButtonStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: dynamicSize(5),
    backgroundColor: colors.Primary,
    borderRadius: dynamicSize(5),
    padding: dynamicSize(5),
  },
  sendButtonText: {
    fontSize: getFontSize(14),
    color: "black",
  },
  friendImage: { height: dynamicSize(20), width: dynamicSize(20) },
  messageButton: {
    alignSelf: "center",
    fontSize: getFontSize(15),
    color: colors.Primary,
    fontWeight: "600",
  },
  requestSentText: {
    fontSize: getFontSize(14),
    color: colors.PrimaryText,
  },
});
