import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { CustomHeader } from "@components";
import { dynamicSize } from "@utils";
import { StyleSheet, Text, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { auth, db } from "App";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useRoute } from "@react-navigation/native";

export const ChatScreen = () => {
  const route = useRoute();
  const username: string = route?.params?.username;
  console.log("🚀 ~ ChatScreen ~ username:", username);
  const [userInfo, setUserInfo] = useState<any>({});
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    const q = query(collection(db, "chats"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapShot) => {
      console.log("🚀 ~ useLayoutEffect ~ snapShot:", snapShot)
      return setMessages(
        	snapShot.docs.map((doc) => ({
          	_id: doc.data()._id,
          	createdAt: doc.data().createdAt.toDate(),
          	text: doc.data().text,
          	user: doc.data().user,
        	}))
    	);
    })

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = [];
        querySnapshot.forEach((doc) => {
          usersData.push({ id: doc.id, ...doc.data() });
        });
        const loggedInUser = usersData.find(
          (user) => user.email == auth?.currentUser?.email
        );

        if (loggedInUser) {
          setUserInfo(loggedInUser);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, []);

  const onSend = useCallback((messages = []) => {

    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(db, "chats"), { _id, createdAt, text, user });
  }, []);

  return (
    <View style={{ flex: 1, marginTop: dynamicSize(50), paddingBottom: 30 }}>
      <CustomHeader headerName={username} />
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={true}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: auth?.currentUser?.email,
          name: userInfo.username,
          avatar: auth.currentUser?.photoURL,
        }}
      />
    </View>
  );
};
