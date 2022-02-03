import React, { Component } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EventAttendanceScreen from "../screens/eventAttendanceStack/eventAttendanceScreen";

const EventStackNavigator = createNativeStackNavigator();

function EventAttendanceStackNavigator() {
  return (
    <EventStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <EventStackNavigator.Screen
        name="EventAttendanceScreen"
        component={EventAttendanceScreen}
      />
    </EventStackNavigator.Navigator>
  );
}

export default EventAttendanceStackNavigator;

