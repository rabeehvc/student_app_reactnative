import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { fromBottom, fromRight } from 'react-navigation-transitions';
import HomeScreen from "../screens/main/homeScreen";

const HomeNavigator = createNativeStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeNavigator.Navigator screenOptions={{ headerShown: false }}>
      <HomeNavigator.Screen name="HomeScreen" component={HomeScreen} />
    </HomeNavigator.Navigator>
  );
}

export default HomeStackNavigator;
