import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Image,
  FlatList,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import jwt_decode from 'jwt-decode';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import themes from '../Styles/themes';
import { latestNotification } from '../Services/notification-services';
import { invertColor } from '../Functions/functions';

const LatestNotifications = ({ navigation }) => {
  //useStates
  const [notifications, setNotifications] = useState([]);
  const [distData, setDistData] = useState();
  const [isModalVisible, setisModalVisible] = useState(false);
  const [deviceUniqueID, setDeviceid] = useState();

  useEffect(() => {
    if (notifications == 0) {
      setisModalVisible(true);
    } else {
      setisModalVisible(false);
    }
  }, [notifications]);

  

  useEffect(() => {
    // let deviceid = Constants.deviceId;
    setUniqueDeviceID();
    retrieveData();
    AsyncStorage.getItem('@apidistData').then((distdata) => {
      setDistData(JSON.parse(distdata));
    });
  }, []);

  const setUniqueDeviceID = async () => {
    let fetchUUID = await SecureStore.getItemAsync('secure_deviceid');
    let deviceid = fetchUUID.slice(1);
    deviceid = deviceid.slice(0, deviceid.length - 1);
    setDeviceid(deviceid);
    retrieveData(deviceid);
  };

 
  //retriving data which is save on phone db (async storage)
  const retrieveData = async () => {
    try {
      AsyncStorage.getItem('@apilogdata').then((data) => {
        const sessionvalue = JSON.parse(data).session;
        const decoded = jwt_decode(sessionvalue);
        let districtid = decoded.districtid;
        getNotifications(
          sessionvalue,
          districtid,
          decoded.students[decoded.ADDRESSID].studentid
        );
      });
    } catch (error) {}
  };

  //appending session and fetch announcements data from api
  const getNotifications = async (SessionValue, distID, studentID) => {
    let formdata = new FormData();
    formdata.append('studentid', studentID);
    formdata.append('deviceID', deviceUniqueID);
    let response = await latestNotification(SessionValue, distID, formdata);
    if (response.ok) {
      let notification = await response.json();
      setNotifications(notification.data);
    }
  };
  return (
    //   view starts here
    <SafeAreaView
      style={[
        themes.menuContainer,
        {
          backgroundColor: distData?.primarycolor
            ? distData?.primarycolor
            : '#ffffff',
        },
      ]}
    >
      <StatusBar
        animated={true}
        barStyle="light-content"
        backgroundColor={
          distData?.primarycolor ? distData?.primarycolor : '#ffffff'
        }
      />
      <View style={themes.txtview}>
        <TouchableOpacity
          activeOpacity={1}
          style={themes.backbtn}
          onPress={() => navigation.goBack(null)}
        >
          <Ionicons
            name='chevron-back'
            color={invertColor(
              distData?.primarycolor ? distData?.primarycolor : '#ffffff',
              true
            )}
            style={themes.backIcon}
          />
        </TouchableOpacity>
        <Text style={themes.txth2}>Latest Notifications</Text>
        <View style={themes.backgroudMenu}>
          <View style={themes.boxScroll}></View>
          {
            // Announcement notification start here
          }
          <FlatList
            data={notifications}
            style={{
              flexGrow: 1,
              //marginBottom: '68%',
            }}
            renderItem={({ item }) => (
              <View style={themes.announcementView}>
                <Text style={themes.headtxt}>{item.messagetitle}</Text>
                <Text style={themes.txtdetails}>{item.messagetext}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          ></FlatList>
        </View>
      </View>

      {isModalVisible && (
        <View style={themes.idCard}>
          <View style={themes.notificationMOdel}>
            <Image source={require('../assets/notificationscreen.png')}></Image>
            <Text>You do not have any notifications</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};
export default LatestNotifications;
