import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StudentSearchScreen from "../screens/studentSearchStack/studentSearchScreen";
import StudentListScreen from "../screens/studentSearchStack/studentListScreen";
import StudentBarCodeScanner from "../screens/studentSearchStack/studentBarCodeScanner";
import StudentProfileScreen from "../screens/studentSearchStack/studentProfileScreen";
import StudentIndividualDailyAttendanceEntryScreen from "../screens/studentSearchStack/studentIndividualDailyAttendanceEntryScreen";
import StudentContactsScreen from "../screens/studentSearchStack/studentContactsScreen";
import StudentScheduleDayScreen from "../screens/studentSearchStack/studentScheduleDayScreen";
import StudentDisciplineScreen from "../screens/studentSearchStack/studentDisciplineScreen";
import React from "react";

const StudentStackNavigator = createNativeStackNavigator();

function StudentSearchStackNavigator() {
  return (
    <StudentStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <StudentStackNavigator.Screen
        name="StudentSearchScreen"       
        component={StudentSearchScreen}               
      >
        {/* {(props) => (
          <StudentSearchScreen {...props} navigationOrigins={"default"} />
        )} */}
      </StudentStackNavigator.Screen>
      <StudentStackNavigator.Screen
        name="StudentListScreen"
        component={StudentListScreen}
      />
      <StudentStackNavigator.Screen
        name="StudentProfileScreen"
        component={StudentProfileScreen}
      />
      <StudentStackNavigator.Screen
        name="StudentIndividualDailyAttendanceEntryScreen"
        component={StudentIndividualDailyAttendanceEntryScreen}
      />
      <StudentStackNavigator.Screen
        name="StudentDisciplineScreen"
        component={StudentDisciplineScreen}
      />

      <StudentStackNavigator.Screen
        name="StudentContactsScreen"
        component={StudentContactsScreen}
      />

      <StudentStackNavigator.Screen
        name="StudentScheduleDayScreen"
        component={StudentScheduleDayScreen}
      />

      <StudentStackNavigator.Screen        
        name="StudentBarCodeScanner"
        component={StudentBarCodeScanner}
        options={{
          headerShown:true,
          headerBackTitle:'',
          headerTitle:'Student ID Scan'         
        }}
      />
    </StudentStackNavigator.Navigator>
  );
}

export default StudentSearchStackNavigator;
