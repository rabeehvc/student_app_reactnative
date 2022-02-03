import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { fromBottom, fromRight } from "react-navigation-transitions";
import MainMenuScreen from "../screens/mainMenuStack/mainMenuScreen";
import EventAttendanceScreen from "../screens/eventAttendanceStack/eventAttendanceScreen";
import EventAttendanceDetailScreen from "../screens/eventAttendanceStack/eventAttendanceDetailScreen";
import EventAttendanceDetailEmployeeScreen from "../screens/eventAttendanceStack/eventAttendanceDetailEmployeeScreen";
import EventAttendanceDetailStudentScreen from "../screens/eventAttendanceStack/eventAttendanceDetailStudentScreen";
import EventAttendanceDetailStudentCheckpointsScreen from "../screens/eventAttendanceStack/eventAttendanceDetailStudentCheckpointsScreen";
import EventAttendanceDetailCheckpointScanScreen from "../screens/eventAttendanceStack/eventAttendanceDetailCheckpointScanScreen";
import EventBarCodeScannerScreen from "../screens/eventAttendanceStack/eventBarCodeScannerScreen";
import StudentPickerSearchScreen from "../screens/eventAttendanceStack/studentPickerSearchScreen";
import StudentPickerListScreen from "../screens/eventAttendanceStack/studentPickerListScreen";
import StudentBarCodeScanner from "../screens/studentSearchStack/studentBarCodeScanner";

const MainStackNavigator = createNativeStackNavigator();

function MainMenuStackNavigator() {
  return (
    <MainStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <MainStackNavigator.Screen
        name="MainMenuScreen"
        component={MainMenuScreen}
      />
      <MainStackNavigator.Screen
        name="EventAttendanceScreen"
        component={EventAttendanceScreen}
      />

      <MainStackNavigator.Screen
        name="EventAttendanceDetailScreen"
        component={EventAttendanceDetailScreen}
      />

      <MainStackNavigator.Screen
        name="EventAttendanceDetailEmployeeScreen"
        component={EventAttendanceDetailEmployeeScreen}
      />

      <MainStackNavigator.Screen
        name="EventAttendanceDetailStudentScreen"
        component={EventAttendanceDetailStudentScreen}
      />

      <MainStackNavigator.Screen
        name="EventAttendanceDetailStudentCheckpointsScreen"
        component={EventAttendanceDetailStudentCheckpointsScreen}
      />

      <MainStackNavigator.Screen
        name="EventAttendanceDetailCheckpointScanScreen"
        component={EventAttendanceDetailCheckpointScanScreen}
      />

      <MainStackNavigator.Screen
        name="EventBarCodeScannerScreen"
        component={EventBarCodeScannerScreen}
        options={{
          headerShown:true,
          headerBackTitle:'',
          headerTitle:'Student ID Scan'         
        }}
      />

      <MainStackNavigator.Screen
        name="StudentPickerSearchScreen"
        component={StudentPickerSearchScreen}
      />

      <MainStackNavigator.Screen
        name="StudentPickerListScreen"
        component={StudentPickerListScreen}
      />

<MainStackNavigator.Screen        
        name="StudentBarCodeScanner"
        component={StudentBarCodeScanner}
        options={{
          headerShown:true,
          headerBackTitle:'',
          headerTitle:'Student ID Scan'         
        }}
      />



    </MainStackNavigator.Navigator>
  );
}

export default MainMenuStackNavigator;
