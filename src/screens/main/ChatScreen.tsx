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
import { useRoute } from "@react-navigation/native";

export const ChatScreen = () => {
  const route = useRoute();
  const { username, recipient_email } = route?.params;
  console.log(
    "🚀 ~ ChatScreen ~ username & recipient_email:",
    username,
    recipient_email
  );

  const [userInfo, setUserInfo] = useState<any>({});
  const [messages, setMessages] = useState([]);
  console.log("🚀 ~ ChatScreen ~ messages:", messages);

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
        sender: doc.data().sender,
        recipient: doc.data().recipient,
      }));

      const filteredMessages = fetchedMessages.filter(
        (message) =>
          (message.sender === auth?.currentUser?.email &&
            message.recipient === recipient_email) ||
          (message.sender === recipient_email &&
            message.recipient === auth?.currentUser?.email)
      );

      console.log("🚀 ~ unsubscribe ~ filteredMessages:", filteredMessages);
      setMessages(filteredMessages);
    });

    return () => unsubscribe();
  }, [recipient_email]);

  const onSend = useCallback(
    (messages = []) => {
      const { _id, text, user } = messages[0];
      addDoc(collection(db, "chats"), {
        _id,
        createdAt: new Date(),
        text,
        user,
        sender: auth?.currentUser?.email,
        recipient: recipient_email,
        participants: [auth?.currentUser?.email, recipient_email],
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
