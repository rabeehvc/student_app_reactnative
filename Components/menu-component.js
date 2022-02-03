import React from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Announcements from '../Screens/announcements';
import StudentProfile from '../Screens/student-profile';
import MoreSettings from '../Screens/more-settings';
import { useRef } from 'react';
import themes from '../Styles/themes';

const Tab = createBottomTabNavigator();

const MyTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: '#ffffff',
        height: Platform.OS === "ios" ? 70 : 70,
        borderTopWidth: 1,
        borderTopColor: '#eaeaea',
        borderLeftWidth: 1,
        borderLeftColor: '#eaeaea',
        borderRightWidth: 1,
        borderRightColor: '#eaeaea',
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
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole='button'
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: "center", flexDirection: "column" }}
          >
            <Feather
              name={
                label === 'Announcements'
                  ? 'volume-1'
                  : label === 'Student ID'
                  ? 'user'
                  : 'more-horizontal'
              }
              size={28}
              color={isFocused ? '#619B26' : '#000000'}
            />
            <Text
              style={{ color: isFocused ? '#619B26' : '#000000', fontSize: 11 }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

//used for tab navigation
const MenuComponent = () => {
  // Animated Tab Indicator...
  const tabOffsetValue = useRef(new Animated.Value(0)).current;
  return (
    <>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <MyTabBar {...props} />}
      >
        <Tab.Screen
          name={'Announcements'}
          component={Announcements}
          icon={'volume-1'}
          listeners={({ navigation, route }) => ({
            // Onpress Update....
            tabPress: (e) => {
              Animated.spring(tabOffsetValue, {
                toValue: 0,
                useNativeDriver: true,
              }).start();
            },
          })}
        ></Tab.Screen>

        <Tab.Screen
          name={'Student ID'}
          component={StudentProfile}
          icon={'user'}
          listeners={({ navigation, route }) => ({
            // Onpress Update....
            tabPress: (e) => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 1,
                useNativeDriver: true,
              }).start();
            },
          })}
        ></Tab.Screen>

        <Tab.Screen
          name={'More'}
          component={MoreSettings}
          icon={'more-horizontal'}
          listeners={({ navigation, route }) => ({
            // Onpress Update....
            tabPress: (e) => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 1.98,
                useNativeDriver: true,
              }).start();
            },
          })}
        ></Tab.Screen>
      </Tab.Navigator>
      <Animated.View
        style={[
          themes.animatedView,
          { transform: [{ translateX: tabOffsetValue }] },
        ]}
      ></Animated.View>
    </>
  );
};

function getWidth() {
  let width = Dimensions.get('window').width;
  // Horizontal Padding = 20...
  width = width * 0.7 - 15;
  // Total five Tabs...
  return width / 2;
}

export default MenuComponent;
