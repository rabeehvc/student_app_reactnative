import React, { useRef} from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  View,
  Platform,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import HomeStackNavigator from "./HomeStackNavigator";
import StudentSearchStackNavigator from "./StudentSearchStackNavigator";
import StaffScheduleStackNavigator from "./StaffScheduleStackNavigator";
import MainMenuStackNavigator from "./MainMenuStackNavigator";
import commonStyles from "../styles/commonStyles";

const Tab = createBottomTabNavigator();

const MyTabBar = ({ state, descriptors, navigation }) => {
 
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#ffffff",
        height: Platform.OS === "ios" ? 70 : 70,
        borderTopWidth: 1,
        borderTopColor: "#eaeaea",
        borderLeftWidth: 1,
        borderLeftColor: "#eaeaea",
        borderRightWidth: 1,
        borderRightColor: "#eaeaea",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityStates={isFocused ? ["selected"] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: "center", flexDirection: "column" }}
          >
            <Ionicons
              name={
                label === "Home"
                  ? "ios-home"
                  : label === "Search"
                  ? "ios-search"
                  : label === "Attendance"
                  ? "ios-calendar"
                  : "ios-menu"
              }
              size={28}
              color={isFocused ? "#619B26" : "#000000"}
            />
            <Text
              style={{ color: isFocused ? "#619B26" : "#000000", fontSize: 11 }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const MainTabNavigator = () => {
  const { isTab } = useSelector((state) => state);
  let toMove = 0;
  // Animated Tab Indicator...
  const tabOffsetValue = useRef(new Animated.Value(0)).current;
  return (
    <>
      <Tab.Navigator
        tabBar={(props) => <MyTabBar {...props} />}
        screenOptions={{ headerShown: false }}
        screenListeners={({ navigation, route }) => ({
          state: (e) => {                       
            if (route.name == "Home") {
              toMove = isTab ? 6 : 0;
              //toMove =  0;
              Animated.spring(tabOffsetValue, {
                toValue: toMove,
                useNativeDriver: true,
              }).start();              
            }
            if (route.name == "Search") {
              toMove = getWidth() * 1;
              Animated.spring(tabOffsetValue, {
                toValue: toMove,
                useNativeDriver: true,
              }).start();
            }
            if (route.name == "Attendance") {
              toMove = getWidth() * 1.99;
              Animated.spring(tabOffsetValue, {
                toValue: toMove,
                useNativeDriver: true,
              }).start();
            }
            if (route.name == "More") {
              toMove = getWidth() * (isTab ? 2.97 : 3);
              Animated.spring(tabOffsetValue, {
                toValue: toMove,
                useNativeDriver: true,
              }).start();
            }
          },
        })}
      >
        <Tab.Screen
          name={"Home"}
          component={HomeStackNavigator}
          listeners={({ navigation, route }) => ({
            // Onpress Update....
            tabPress: (e) => {
              // Animated.spring(tabOffsetValue, {
              //   toValue: 0,
              //   useNativeDriver: true,
              // }).start();
            },
          })}
        ></Tab.Screen>

        <Tab.Screen
          name={"Search"}
          component={StudentSearchStackNavigator}
          listeners={({ navigation, route }) => ({
            // Onpress Update....
            tabPress: (e) => {
              // Animated.spring(tabOffsetValue, {
              //   toValue: getWidth() * 1,
              //   useNativeDriver: true,
              // }).start();
            },
          })}
        ></Tab.Screen>

        <Tab.Screen
          name={"Attendance"}
          component={StaffScheduleStackNavigator}
          listeners={({ navigation, route }) => ({
            // Onpress Update....
            tabPress: (e) => {
              // Animated.spring(tabOffsetValue, {
              //   toValue: getWidth() * 1.98,
              //   useNativeDriver: true,
              // }).start();
            },
          })}
        ></Tab.Screen>

        <Tab.Screen
          name={"More"}
          component={MainMenuStackNavigator}
          listeners={({ navigation, route }) => ({
            // Onpress Update....

            tabPress: (e) => {
              // Animated.spring(tabOffsetValue, {
              //   toValue: getWidth() * 3,
              //   useNativeDriver: true,
              // }).start();
            },
          })}
        ></Tab.Screen>
      </Tab.Navigator>

      <Animated.View
        style={[
          commonStyles.animatedView,
          { transform: [{ translateX: tabOffsetValue }] },
        ]}
      ></Animated.View>
    </>
  );
};

function getWidth() {
  let width = Dimensions.get("window").width;
  width = width * 0.78 - 15;
  // Total four Tabs...
  return width / 3;
}

export default MainTabNavigator;
