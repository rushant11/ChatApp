import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  AddUser,
  ChatScreen,
  HomeScreen,
  LoginScreen,
  RegisterScreen,
} from "@screens";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import SplashScreen from "src/screens/auth/SplashScreen";
import Managerequests from "src/screens/main/Managerequests";

const firebaseConfig = {
  apiKey: "AIzaSyBEcW07iVen1D78xpyc3pP54m0A1bYOjwo",
  authDomain: "chatapp-4055f.firebaseapp.com",
  databaseURL: "https://chatapp-4055f.firebaseio.com",
  projectId: "chatapp-4055f",
  storageBucket: "chatapp-4055f.appspot.com",
  appId: "1:285046376547:ios:145a14b1b256addf905056",
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Splash"
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="AddUser" component={AddUser} />
        <Stack.Screen name="ManageRequests" component={Managerequests} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
