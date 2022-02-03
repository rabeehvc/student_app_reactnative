import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DistrictCodeScreen from "../screens/loginStack/districtCodeScreen";
import LoginScreen from "../screens/loginStack/loginScreen";
import { useSelector } from "react-redux";

const LoginStackNavigator = createNativeStackNavigator();

function LoginStackNavigation() {
  const { districtData } = useSelector((state) => state);

  return (
    <LoginStackNavigator.Navigator
      initialRouteName={"LoginScreen"}
      screenOptions={{ headerShown: false }}
    >
      {typeof districtData == "undefined" ? (
        <LoginStackNavigator.Screen
          name="DistrictCodeScreen"
          component={DistrictCodeScreen}
        />
      ) : (             
          <LoginStackNavigator.Screen
            name="LoginScreen"
            component={LoginScreen}
          />        
      )}
    </LoginStackNavigator.Navigator>
  );
}

export default LoginStackNavigation;
