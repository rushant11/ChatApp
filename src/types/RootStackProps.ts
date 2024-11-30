import { RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
  SplashScreen: undefined;
  HomeScreen: undefined;
  LoginScreen: { appleAuth?: boolean };
  WalkthroughScreen: undefined;
  ForgotPasswordScreen: { emailSent?: boolean };
  SelectRollScreen?: {};
  VisitorLoginScreen: undefined;
  VisitorHomeScreen: undefined;
  SettingScreen: undefined;
};

export type RootRouteProps<RouteName extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, RouteName>;
