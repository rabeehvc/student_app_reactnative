import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  LogBox,
} from 'react-native';
import jwt_decode from 'jwt-decode';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Moment from 'react-moment';
import Barcode from 'react-native-barcode-expo';
import Toast from 'react-native-tiny-toast';
import themes from '../Styles/themes';
import { checkURL } from '../Functions/functions';
import { invertColor } from '../Functions/functions';

LogBox.ignoreLogs(['Deprecation warning:']);

const StudentProfile = () => {
  const [value, setValues] = useState('');
  const [year, setYear] = useState('');
  const [distData, setDistData] = useState();
  const [barcodeString, setBarcodeString] = useState('');

  //useEffect
  useEffect(() => {
    retrieveData();
    AsyncStorage.getItem('@apidistData').then((distdata) => {
      setDistData(JSON.parse(distdata));
    });
    AsyncStorage.getItem('@BarcodeString').then((barCode) => {
      setBarcodeString(barCode);
    });
  }, []);

  //retriving data from the phone db
  const retrieveData = async () => {
    try {
      AsyncStorage.getItem('@apilogdata').then((data) => {
        const token = JSON.parse(data).session;
        const decoded = jwt_decode(token);
        setValues(decoded.students[decoded.ADDRESSID]);
        setYear(decoded);
      });
    } catch (error) {
      alert(error);
    }
  };

  //download id card details and stores to phone db
  const idDownload = async () => {
    try {
      await AsyncStorage.setItem('@idDetails', JSON.stringify(value));
      await AsyncStorage.setItem('@idYear', JSON.stringify(year));
      Toast.show('Student ID saved to Login Screen', {
        mask: true,
        shadow: true,
        containerStyle: {
          backgroundColor: '#4F8A10',
          borderRadius: 999,
          width: "auto",
        },
        textStyle: { fontSize: 12 },
      });
    } catch (err) {
      alert(err);
    }
  };

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
      <View
        style={Platform.OS === "android" ? themes.txtview : themes.txtviewIOS}
      >
        <TouchableOpacity
          style={themes.downloadButton}
          onPress={() => idDownload()}
        >
          <Feather
            name='download'
            size={26}
            color={invertColor(
              distData?.primarycolor ? distData?.primarycolor : '#ffffff',
              true
            )}
          />
        </TouchableOpacity>
      </View>

      <Text style={themes.txth2}>Student ID</Text>
      <View style={themes.idCard}>
        <Text style={themes.idtxt1}>
          {value.locationdisplayname ? value.locationdisplayname : ' '}
        </Text>
        <View style={themes.idImgView}>
          <Image
            style={themes.profileImg}
            source={
              checkURL(value.studentimageurl)
                ? { uri: value.studentimageurl }
                : require('../assets/noimage.png')
            }
          ></Image>
          <Text style={themes.idtxtName}>
            {`${value.firstname} ${value.middlename} ${value.lastname}`}
          </Text>
        </View>

        <View style={themes.idField}>
          <View style={themes.idFieldStyle}>
            <Text style={themes.idSubtxt1}>DOB</Text>
            <Text style={themes.idSubtxt2}>Home Room</Text>
          </View>
          <View style={themes.idRow}>
            <Moment
              style={themes.idResult1}
              element={Text}
              format='MMM, D YYYY'
            >
              {value.dob}
            </Moment>
            <Text style={themes.idResult2}>
              {value.homeroom ? value.homeroom : ' '}
            </Text>
          </View>
        </View>

        <View style={themes.idField}>
          <View style={themes.idFieldStyle}>
            <Text style={themes.idSubtxt1}>Gender</Text>
            <Text style={themes.idSubtxt2}>Grade</Text>
          </View>
          <View style={themes.idRow}>
            <Text style={themes.idResult1}>
              {value.gender ? value.gender : ' '}
            </Text>
            <Text style={themes.idResult2}>
              {value.grade ? value.grade : ' '}
            </Text>
          </View>
        </View>

        <View style={themes.idFieldSchool}>
          <View style={themes.idFieldStyle}>
            <Text style={themes.idSubtxt1}>School Year</Text>
          </View>
          <View style={themes.idFieldStyle}>
            <Text style={themes.idResult1}>
              {`${JSON.stringify(year.actualschoolyear)} - ${JSON.stringify(
                year.actualschoolyear + 1
              )}`}
            </Text>
          </View>
        </View>

        <View style={themes.barcode}>
          {barcodeString != '' ? (
            <Barcode value={barcodeString} format="CODE128" />
          ) : null}
        </View>
      </View>

      <View style={themes.backgroudMenu}></View>
    </SafeAreaView>
  );
};
export default StudentProfile;
