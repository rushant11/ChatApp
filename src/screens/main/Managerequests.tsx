import React, { useEffect, useState, useCallback } from "react";

import { auth, db } from "App";
import { CustomHeader } from "@components";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { dynamicSize, getFontSize } from "@utils";
import { Images } from "@Images";
import { useStore } from "@zustand";

const Managerequests = ({ navigation }: any) => {
  const { requests, setRequests } = useStore();

  const fetchRequests = useCallback(async () => {
    try {
      const q = query(
        collection(db, "requests"),
        where("receiver", "==", auth.currentUser.email),
        where("status", "==", "pending")
      );
      const querySnapshot = await getDocs(q);
      const fetchedRequests = [];
      querySnapshot.forEach((doc) => {
        fetchedRequests.push({ id: doc.id, ...doc.data() });
      });
      setRequests(fetchedRequests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleRequestAction = async (id: string, status: string) => {
    try {
      const requestRef = doc(db, "requests", id);
      await updateDoc(requestRef, { status });

      if (status === "accepted") {
        const requestDoc = await getDoc(requestRef);
        const { sender, receiver } = requestDoc.data();

        console.log(`Request accepted between ${sender} and ${receiver}`);
      }

      setRequests((prev) => prev.filter((request) => request.id !== id));
      fetchRequests();
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <CustomHeader
        back={true}
        leftIcon={true}
        headerName="Friend Requests"
        onPress={() => navigation.goBack()}
      />
      <FlatList
        data={requests}
        renderItem={({ item }) => {
          return (
            <View style={styles.requestContainer}>
              <Text style={{ fontSize: getFontSize(15), fontWeight: "500" }}>
                {`${item?.currentUsername} `}
                <Text
                  style={{
                    fontWeight: "400",
                    fontSize: getFontSize(14),
                  }}
                >
                  has sent you a request
                </Text>
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: dynamicSize(15),
                }}
              >
                <TouchableOpacity
                  onPress={() => handleRequestAction(item.id, "accepted")}
                >
                  <Image
                    source={Images.check}
                    style={{
                      ...styles.img,
                      width: dynamicSize(32),
                      height: dynamicSize(32),
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleRequestAction(item.id, "rejected")}
                >
                  <Image source={Images.cancel} style={styles.img} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.text}>No friend requests.</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  requestContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    alignItems: "center",
    justifyContent: "space-between",
    padding: dynamicSize(15),
    borderBottomColor: "#ccc",
  },
  img: {
    width: dynamicSize(34),
    height: dynamicSize(34),
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
    fontSize: getFontSize(15),
    marginTop: dynamicSize(30),
  },
});

export default Managerequests;
