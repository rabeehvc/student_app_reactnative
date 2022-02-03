import React from 'react';
import { View, Text, Image, Alert } from 'react-native';
import { connect, useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { ListItem } from 'react-native-elements';
import { authStateChanged } from '../../redux/app-redux';
import realtimeStyles from '../../constants/realtimeStyles';
import { realtimeBlue } from '../../constants/realtimeStyleConstants';
import {
  checkLocalUserFeatureFlag,
  checkLocalUserPermission,
} from '../../utilities/permissionsUtilities';
import commonStyles from '../../styles/commonStyles';

const list = [
  {
    title: 'Student Discipline Quick Entry',
    id: 0,
    icon: 'report',
    permission: 'Discipline Quick Entry',
    requiresSearchPermission: true,
    featureFlag: '',
  },
  {
    title: 'Student Daily Attendance',
    id: 1,
    icon: 'perm-contact-calendar',
    permission: 'Attendance Entry',
    requiresSearchPermission: true,
    featureFlag: '',
  },
  {
    title: 'Event Attendance',
    id: 3,
    icon: 'calendar-view-day',
    permission: 'All Users Allowed',
    featureFlag: 'event_attendance',
  },
  {
    title: 'My Schedule',
    id: 2,
    icon: 'schedule',
    permission: 'All Users Allowed',
    featureFlag: '',
  },
  {
    title: 'Logout',
    id: 4,
    icon: 'logout',
    permission: 'All Users Allowed',
    featureFlag: '',
  },
];

const mainMenuScreen = ({ navigation }) => {
  const { districtData, isTab, userData } = useSelector((state) => state);
  const dispatch = useDispatch();

  // check whether the menu should render to the user
  const checkShouldItemDisplay = (item) => {
    var districtID = districtData['districtID'].toLowerCase();
    if (typeof item.realtimeOnly != 'undefined' && item.realtimeOnly == true) {
      if (districtID == 'realitdemo') {
        return checkLocalUserPermission(item.permission);
      } else {
        return false;
      }
    }
    if (checkLocalUserFeatureFlag(item.featureFlag) == false) {
      return false;
    }
    return checkLocalUserPermission(item.permission);
  };

  const generateListItem = (item) => {
    return (
      <ListItem
        key={item.id}
        containerStyle={realtimeStyles.studentProfileListStyle}
        onPress={() => {
          switch (item.id) {
            case 0:
              navigation.navigate('Search', {
                screen: 'StudentSearchScreen',
                params: {
                  navigationOrigin: 'discQuickEntry',
                },
              });
              break;
            case 1:
              navigation.navigate('Search', {
                screen: 'StudentSearchScreen',
                params: {
                  navigationOrigin: 'dailyAttendance',
                },
              });
              break;
            case 2:
              navigation.navigate('Attendance', {
                screen: 'ScheduleScreen',
                params: {
                  navigationOrigin: 'staffSchedule',
                },
              });
              break;
            case 3:
              navigation.navigate('EventAttendanceScreen', {
                navigationOrigin: 'eventAttendance',
              });
              break;
            case 4:
              onLogoutPress();
              break;

            default:
              Alert.alert(
                'Error',
                'An error occurred when handling navigation. Please try again'
              );
              break;
          }
        }}
      >
        <ListItem.Content style={{ flexDirection: "row", flex: 1 }}>
          <View style={{ flex: 2 }}>
            <MaterialIcons name={item.icon} size={26} color={realtimeBlue} />
          </View>
          <View style={{ flex: 9 }}>
            <Text style={{ fontSize: 15, color: realtimeBlue }}>
              {item.title}
            </Text>
          </View>
        </ListItem.Content>
      </ListItem>
    );
  };

  const onLogoutPress = () => {
    Alert.alert(
      'Warning',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => dispatch(authStateChanged(false)),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView
      style={[
        commonStyles.menuContainer,
        {
          backgroundColor: districtData?.primaryColor
            ? districtData?.primaryColor
            : '#ffffff',
        },
      ]}
    >
      <StatusBar style="inverted" />

      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            zIndex: 999,
          }}
        >
          <View
            style={{
              flex: 1,
              marginBottom: 10,
            }}
          ></View>

          <View
            style={{
              flex: 2,
              backgroundColor: 'white',
              width: '86%',
              alignSelf: "center",
              paddingLeft: 20,
              paddingRight: 20,
              borderRadius: 10,
              marginBottom: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={{
                width: isTab ? 170 : 130,
                height: isTab ? 170 : 130,
                borderRadius: 8,
                marginTop: 10,
                position: "absolute",
                top: isTab ? -90 : -70,
                left: isTab ? '39.5%' : '35%',
              }}
              source={require('../../assets/images/noimage.png')}
            ></Image>
            <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 70 }}>
              {userData?.firstName} {userData?.lastName}
            </Text>
            <Text style={{ opacity: 0.5, marginTop: 5, fontSize: 15 }}>
              {userData?.description}
            </Text>
            <Text style={{ opacity: 0.5, marginTop: 5, fontSize: 15 }}>
              {userData?.employeeID}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: 'white',
              width: '86%',
              paddingLeft: 20,
              paddingRight: 20,
              borderRadius: 10,
              paddingTop: 10,
              paddingBottom: 10,
              flex: 5,
              alignSelf: "center",
              marginBottom: Platform.OS === "ios" ? 0 : 20,
            }}
          >
            {list.map((item) =>
              checkShouldItemDisplay(item) ? generateListItem(item) : null
            )}
          </View>
        </View>

        <View style={commonStyles.static_white_background}></View>
      </View>
    </SafeAreaView>
  );
};

export default mainMenuScreen;
