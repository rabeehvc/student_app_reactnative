import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DistrictCodeScreen from "../screens/loginStack/districtCodeScreen";
import DistrictSearchScreen from "../screens/loginStack/districtSearchScreen";

const DistrictStackNavigator = createNativeStackNavigator();

function DistrictSelectStackNavigation() {
  return (
    <DistrictStackNavigator.Navigator      
      screenOptions={{ headerShown: false }}
    >
      <DistrictStackNavigator.Screen
        name="DistrictCodeScreen"
        component={DistrictCodeScreen}
      />
      <DistrictStackNavigator.Screen
        name="DistrictSearchScreen"
        component={DistrictSearchScreen}
      />
    </DistrictStackNavigator.Navigator>
  );
}

export default DistrictSelectStackNavigation;
