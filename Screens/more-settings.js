import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Alert,
  Linking,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import themes from '../Styles/themes';

export default function MoreSettings({ navigation }) {
  //useStates
  const [distData, setDistData] = useState();
  const [data, setData] = useState('');
  //useEffects
  useEffect(() => {
    AsyncStorage.getItem('@apidistData').then((distdata) => {
      setDistData(JSON.parse(distdata));
    });
    retrieveData();
  }, []);

  //retrive data from async storage
  const retrieveData = async () => {
    try {
      AsyncStorage.getItem('@apilogdata').then((data) => {
        setData(JSON.parse(data));
        const token = JSON.parse(data).session;
      });
    } catch (error) {}
  };

  //eventhandler for logout
  //it remove only '@apilogdata' session
  const onLogout = () =>
    Alert.alert('Alert', 'Are you sure want to log out?', [
      {
        text: 'CANCEL',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'LOG OUT',
        onPress: () => {
          AsyncStorage.getItem('@loginTimeOutNormal').then(async (Pass) => {
            if (Pass) {
              clearTimeout(parseInt(Pass));
            }
          });
          AsyncStorage.getItem('@loginTimeOutBio').then(async (Pass) => {
            if (Pass) {
              clearTimeout(parseInt(Pass));
            }
          });
          navigation.navigate('Login');
          AsyncStorage.setItem('@logout', 'LOGOUT');
        },
      },
    ]);

  return (
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
      <Text style={[themes.txth2, themes.txtview]}>More</Text>
      <View style={themes.idCard}>
        <View style={themes.viewMore}>
          <TouchableOpacity
            onPress={() => navigation.navigate('LatestNotifications')}
          >
            <View style={themes.fieldMore}>
              <Feather name='bell' style={themes.moreIcons} />

              <Text style={themes.txtMore}>Latest Notifications</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('NotificationSettings')}
          >
            <View style={themes.fieldMore}>
              <Feather name='settings' style={themes.moreIcons} />

              <Text style={themes.txtMore}>Notification Settings</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(
                `https://www.fridaystudentportal.com/autologStudentJWT.cfm?districtid=${data.districtid}&sel=${data.ADDRESSID}&JWT=${data.session}`
              );
            }}
          >
            <View style={themes.fieldMore}>
              <MaterialCommunityIcons
                name='wallet-outline'
                style={themes.moreIcons}
              />

              <Text style={themes.txtMore}>Open Student Portal</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogout}>
            <View style={themes.fieldMore}>
              <Feather name='log-out' style={themes.moreIcons} />

              <Text style={themes.txtMore}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={themes.backgroudMenu}></View>
    </SafeAreaView>
  );
}
