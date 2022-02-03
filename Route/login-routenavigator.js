//it is used to navigate to the login screen as initial screen when district data is there

import React from "react";
// import { createStackNavigator } from "@react-navigation/stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DistrictCode from "../Screens/district-code";
import SearchDistrict from "../Screens/search-district";
import Login from "../Screens/login";
import MenuComponent from "../Components/menu-component";
import StudentProfile from "../Screens/student-profile";
import NotificationSettings from "../Screens/notification-settings";
import LatestNotifications from "../Screens/latest-notifications";

const Stack = createNativeStackNavigator();

const LoginNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SearchDistrict" component={SearchDistrict} />
      <Stack.Screen name="MenuComponent" component={MenuComponent} />
      <Stack.Screen name="StudentProfile" component={StudentProfile} />
      <Stack.Screen name="DistrictCode" component={DistrictCode} />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettings}
      />
      <Stack.Screen
        name="LatestNotifications"
        component={LatestNotifications}
      />
    </Stack.Navigator>
  );
};
export default LoginNavigator;
