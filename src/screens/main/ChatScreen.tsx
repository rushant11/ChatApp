import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { CustomHeader } from "@components";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { auth, db } from "App";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useStore } from "src/zustand/useStore";
import { StatusBar } from "expo-status-bar";
import { colors } from "@theme";

type ChatScreenRouteParams = {
  username: string;
  recipient_email: string;
};

export const ChatScreen = ({ navigation }) => {
  const route = useRoute<RouteProp<Record<string, ChatScreenRouteParams>>>();
  const { username, recipient_email } = route?.params;
  const { messages, setMessages, setIsChatSelected, userStatus } = useStore();
  const [userInfo, setUserInfo] = useState<any>({});
  console.log("🚀 ~ ChatScreen ~ messages:", messages);

  useEffect(() => {
    const markMessagesAsRead = async () => {
      const q = query(
        collection(db, "chats"),
        where("recipient", "==", auth?.currentUser?.email),
        where("sender", "==", recipient_email),
        where("isRead", "==", false)
      );

      const unreadMessages = await getDocs(q);
      for (const docSnapShot of unreadMessages.docs) {
        const docRef = doc(db, "chats", docSnapShot.id);
        await updateDoc(docRef, { isRead: true });
      }
    };

    markMessagesAsRead();
  }, [recipient_email]);

  useEffect(() => {
    // set email/userwise online offline status
    const checkUserStatus = async () => {
      if (userStatus === "online") {
        await updateDoc(doc(db, "users", auth?.currentUser?.email), {
          online: true,
        });
      } else {
        await updateDoc(doc(db, "users", auth?.currentUser?.email), {
          online: false,
        });
      }
    };
    checkUserStatus();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = [];
        querySnapshot.forEach((doc) => {
          usersData.push({ id: doc.id, ...doc.data() });
        });

        const loggedInUser = usersData.find(
          (user) => user.email === auth?.currentUser?.email
        );
        console.log("🚀 ~ fetchUserInfo ~ loggedInUser:", loggedInUser);

        if (loggedInUser) {
          setUserInfo(loggedInUser);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  useLayoutEffect(() => {
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", auth?.currentUser?.email),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      }));

      const filteredMessages = fetchedMessages.filter(
        (message) =>
          (message.sender === auth?.currentUser?.email &&
            message.recipient === recipient_email) ||
          (message.sender === recipient_email &&
            message.recipient === auth?.currentUser?.email)
      );

      const formattedMessages = filteredMessages.map((message) => ({
        _id: message._id,
        text: message.text,
        createdAt: message.createdAt,
        user: {
          _id: message.sender,
          name: message.user?.name || "Unknown",
        },
      }));

      setMessages(formattedMessages);
    });

    return () => unsubscribe();
  }, [recipient_email]);

  const onSend = useCallback(
    (messages = []) => {
      const { _id, text, user, createdAt } = messages[0];

      addDoc(collection(db, "chats"), {
        _id,
        text,
        createdAt,
        user,
        sender: auth?.currentUser?.email,
        recipient: recipient_email,
        participants: [auth?.currentUser?.email, recipient_email],
        lastMessage: text,
        isRead: false,
        online: false,
      })
        .then(() => {
          console.log("Message sent successfully");
          setIsChatSelected(true);
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    },
    [recipient_email]
  );

  return (
    <>
      <StatusBar
        animated={true}
        style="dark"
        translucent
        backgroundColor="#FFFFFF"
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        <View style={styles.main}>
          <CustomHeader
            headerName={username}
            activeStatus={userStatus}
            leftIcon
            back
            onPress={() => {
              navigation.goBack();
            }}
          />
          <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={true}
            showUserAvatar={true}
            listViewProps={{ showsVerticalScrollIndicator: false }}
            placeholder="Send a message"
            onSend={(messages) => onSend(messages)}
            user={{
              _id: auth?.currentUser?.email,
              name: userInfo.username,
            }}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
