import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigation from "./MainTabNavigation";

const RelogStackNavigator = createNativeStackNavigator();

function RelogStackNavigation() {
  return (
    <RelogStackNavigator.Navigator
      initialRouteName="MainTabs"
      screenOptions={{ headerShown: false }}
    >
      <RelogStackNavigator.Screen
        name="MainTabs"
        component={MainTabNavigation}
      />    
    </RelogStackNavigator.Navigator>
  );
}

export default RelogStackNavigation;
