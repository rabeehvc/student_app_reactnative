import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Image,
  FlatList,
  StatusBar,
  LogBox,
} from 'react-native';
import jwt_decode from 'jwt-decode';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import themes from '../Styles/themes';
import { StudentServices } from '../Services/student-services';
import { checkURL } from '../Functions/functions';

LogBox.ignoreLogs(['Setting a timer']);

const Announcements = () => {
  //useStates
  const [value, setValues] = useState('');
  const [AnnouncementValues, setAnnouncements] = useState([]);
  const [distData, setDistData] = useState();

  //retrive data from the async storage and display when the page loads
  useEffect(() => {
    retrieveData();
    AsyncStorage.getItem('@apidistData').then((distdata) => {
      setDistData(JSON.parse(distdata));
    });
  }, []);

  //retriving data which is save on phone db (async storage)
  const retrieveData = async () => {
    try {
      AsyncStorage.getItem('@apilogdata').then((data) => {
        const token = JSON.parse(data).session;
        const decoded = jwt_decode(token);
        setValues(decoded.students[decoded.ADDRESSID]);
        let districtid = decoded.districtid;
        getAnnouncements(
          token,
          districtid,
          decoded.students[decoded.ADDRESSID].studentid
        );
      });
    } catch (error) {}
  };

  //appending session and fetch announcements data from api
  const getAnnouncements = async (token, distID, studentid) => {
    let response = await StudentServices(token, distID, studentid);
    if (response.ok) {
      let announcementDatas = await response.json();
      setAnnouncements(announcementDatas);
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
      <Text style={[themes.txth2, themes.txtview]}>Announcements</Text>
      <View style={themes.listViewTab}>
        <View style={themes.announcementViewtop}>
          <Text style={themes.headtxt}>{distData?.districtdisplayname}</Text>
          <View style={themes.studDetails}>
            <Image
              style={themes.announcementImg}
              source={
                checkURL(value.studentimageurl)
                  ? { uri: value.studentimageurl }
                  : require('../assets/noimage.png')
              }
            ></Image>
            <View>
              <Text style={themes.studName}>
                {`${value.firstname} ${
                  value.middlename ? value.middlename : ''
                }  ${value.lastname}`}
              </Text>
              <Text style={themes.studId}>Student Id : {value.studentid}</Text>
            </View>
          </View>
        </View>
        {AnnouncementValues.length > 0 ? (
          <FlatList
            data={AnnouncementValues}
            style={{
              flexGrow: 1,
              marginBottom: Platform.OS === "ios" ? "8%" : "10%",
            }}
            renderItem={({ item }) => (
              <View style={themes.announcementView}>
                <Text style={themes.headtxt}>{item.title}</Text>
                <Text style={themes.txtdetails}>{item.details}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          ></FlatList>
        ) : (
          <View style={themes.animationPlaceholder}>
            <PlaceholderLine width={80} />
            <PlaceholderLine />
            <PlaceholderLine width={30} />
          </View>
        )}
      </View>
      <View style={themes.backgroudMenu}></View>
    </SafeAreaView>
  );
};
export default Announcements;
