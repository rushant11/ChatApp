import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { CustomHeader } from "@components";
import { dynamicSize } from "@utils";
import { View } from "react-native";
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
} from "firebase/firestore";
import { RouteProp, useRoute } from "@react-navigation/native";

type ChatScreenRouteParams = {
  username: string;
  recipient_email: string;
};

export const ChatScreen = () => {
  const route = useRoute<RouteProp<Record<string, ChatScreenRouteParams>>>();
  const { username, recipient_email } = route?.params;

  const [userInfo, setUserInfo] = useState<any>({});
  const [messages, setMessages] = useState([]);
  console.log("🚀 ~ ChatScreen ~ messages:", JSON.stringify(messages));

  const [senderName, setSenderName] = useState("");
  console.log("🚀 ~ ChatScreen ~ senderName:", senderName);

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

        const sender_name = loggedInUser.username;
        console.log("🚀 ~ fetchUserInfo ~ sender_name:", sender_name);
        setSenderName(sender_name);

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
        createdAt: doc.data().createdAt?.toDate(), // Ensure Firestore's timestamp is converted
      }));

      const filteredMessages = fetchedMessages.filter(
        (message) =>
          (message.sender === auth?.currentUser?.email &&
            message.recipient === recipient_email) ||
          (message.sender === recipient_email &&
            message.recipient === auth?.currentUser?.email)
      );

      // Format messages for GiftedChat
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
        createdAt, // Use GiftedChat's createdAt to keep consistent
        user, // This contains the sender's user info
        sender: auth?.currentUser?.email, // Sender's email
        recipient: recipient_email, // Recipient's email
        participants: [auth?.currentUser?.email, recipient_email], // Both participants
        lastMessage: text, // Update last message
      })
        .then(() => {
          console.log("Message sent successfully");
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    },
    [recipient_email]
  );

  return (
    <View style={{ flex: 1, marginTop: dynamicSize(50), paddingBottom: 30 }}>
      <CustomHeader headerName={username} />
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={true}
        showUserAvatar={true}
        loadEarlier
        placeholder="Send a message"
        onSend={(messages) => onSend(messages)}
        user={{
          _id: auth?.currentUser?.email,
          name: userInfo.username,
        }}
      />
    </View>
  );
};
