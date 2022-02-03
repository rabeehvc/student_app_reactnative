import React, { Component } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ScheduleScreen from "../screens/staffScheduleStack/scheduleScreen";
import StudentListForCourseSectionScreen from "../screens/staffScheduleStack/studentListForCourseSectionScreen";
import StudentProfileScreen from "../screens/studentSearchStack/studentProfileScreen";
import StudentMassDailyAttendanceEntryScreen from "../screens/staffScheduleStack/studentMassDailyAttendanceEntryScreen";
import PeriodAttendanceScreen from "../screens/staffScheduleStack/periodAttendanceScreen";
import StudentIndividualDailyAttendanceEntryScreen from "../screens/studentSearchStack/studentIndividualDailyAttendanceEntryScreen";
import StudentDisciplineScreen from "../screens/studentSearchStack/studentDisciplineScreen";
import StudentContactsScreen from "../screens/studentSearchStack/studentContactsScreen";
import StudentScheduleDayScreen from "../screens/studentSearchStack/studentScheduleDayScreen";

const StaffStackNavigator = createNativeStackNavigator();

function StaffScheduleStackNavigator() {
  return (
    <StaffStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <StaffStackNavigator.Screen
        name="ScheduleScreen"
        component={ScheduleScreen}
      />

      <StaffStackNavigator.Screen
        name="StudentListForCourseSectionScreen"
        component={StudentListForCourseSectionScreen}
      />

      <StaffStackNavigator.Screen
        name="PeriodAttendanceScreen"
        component={PeriodAttendanceScreen}
      />

      <StaffStackNavigator.Screen
        name="StudentMassDailyAttendanceEntryScreen"
        component={StudentMassDailyAttendanceEntryScreen}
      />

      <StaffStackNavigator.Screen
        name="StudentProfileScreen"
        component={StudentProfileScreen}
      />

<StaffStackNavigator.Screen
        name="StudentDisciplineScreen"
        component={StudentDisciplineScreen}
      />

<StaffStackNavigator.Screen
        name="StudentContactsScreen"
        component={StudentContactsScreen}
      />

      <StaffStackNavigator.Screen
        name="StudentScheduleDayScreen"
        component={StudentScheduleDayScreen}
      />

<StaffStackNavigator.Screen
        name="StudentIndividualDailyAttendanceEntryScreen"
        component={StudentIndividualDailyAttendanceEntryScreen}
      />

    </StaffStackNavigator.Navigator>
  );
}

export default StaffScheduleStackNavigator;
