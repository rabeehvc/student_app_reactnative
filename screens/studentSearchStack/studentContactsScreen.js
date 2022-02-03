import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  FlatList,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';
import MarqueeText from 'react-native-marquee';
import call from 'react-native-phone-call';
import { ListItem } from 'react-native-elements';
import {
  MaterialIcons,
  Ionicons,
  Feather,
  MaterialCommunityIcons,
  FontAwesome,
} from '@expo/vector-icons';
import RetrieveStudentDataService from '../../services/retrieveStudentDataService';
import { invertColor } from '../../functions/functions';
import NoStudentsFoundMessage from '../../components/noStudentsFoundMessage';
import commonStyles from '../../styles/commonStyles';

const studentContactsScreen = ({ navigation, route }) => {
  const { districtData } = useSelector((state) => state);
  const { userData, isTab } = useSelector((state) => state);
  const { studentData, contacts } = route.params;
  const [scheduledInHasLoaded, setScheduledInHasLoaded] = useState(false);
  const [scheduledIn, setScheduledIn] = useState('');
  const [courseInfoString, setCourseInfoString] = useState('');
  const [roomID, setRoomID] = useState('');
  const [roomExt, setRoomExt] = useState('');
  const [attendanceTransactionColor, setAttendanceTransactionColor] =
    useState('');
  const [
    attendanceTransactionCodeDescription,
    setAttendanceTransactionCodeDescription,
  ] = useState('');

  useEffect(() => {
    getCurrentAttendanceAndScheduledInData();
  }, []);

  // COLLECT STUDENT CURRENT ATTENDANCE STATUS AND SCHEDULED IN INFORMATION HERE
  const getCurrentAttendanceAndScheduledInData = async () => {
    try {
      const retrieveStudentDataService = new RetrieveStudentDataService();
      const studentID = studentData.studentID;
      const response =
        await retrieveStudentDataService.performStudentCurrentlyScheduledInRequest(
          userData.sessionToken,
          studentID
        );

      setScheduledInHasLoaded(true);
      if (!response.JWTIsValid) {
        return;
      }
      if (response.status === 'success') {
        if (typeof response.scheduledIn != 'undefined') {
          setScheduledIn(response.scheduledIn);
          setRoomExt(response.scheduledIn.roomExt);
          setRoomID(response.scheduledIn.roomID);
          let courseInfoString = `${response.scheduledIn.title} (${response.scheduledIn.courseID}/${response.scheduledIn.sectionID})`;
          courseInfoString += ` • ${response.scheduledIn.teacherFirst} ${response.scheduledIn.teacherLast}`;
          setCourseInfoString(courseInfoString);
        }
        if (response.attendanceTransactionColor.trim().length == 7) {
          setAttendanceTransactionColor(response.attendanceTransactionColor);
        } else {
          setAttendanceTransactionColor('#ffffff');
        }
        setAttendanceTransactionCodeDescription(
          response.attendanceTransactionCodeDescription
        );
      } else {
        Alert.alert(
          'Request failed',
          'An error occurred while trying to retrieve student schedule data. Please try again.'
        );
      }
    } catch (responseError) {
      setScheduledInHasLoaded(true);
      Alert.alert('Unable to retrieve student schedule data.', responseError);
    }
  };

  // Opening the telephone number in the Dialpad of the student relatives contacts
  const openDialPad = (phoneNumber) => {
    const args = {
      number: phoneNumber, // String value with the number to call
      prompt: false, // Optional boolean property. Determines if the user should be prompt prior to the call
    };

    call(args).catch(console.error);
  };

  return (
    <SafeAreaView
      style={[
        commonStyles.container,
        {
          backgroundColor: districtData?.primaryColor
            ? districtData?.primaryColor
            : '#ffffff',
        },
      ]}
    >
      <StatusBar style='inverted' />

      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 999,
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <TouchableOpacity
              style={{
                flex: 2,
                alignItems: 'center',
                paddingBottom: 5,
                paddingTop: 5,
              }}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons
                name='arrow-back-ios'
                size={24}
                color={invertColor(
                  districtData?.primaryColor
                    ? districtData?.primaryColor
                    : '#ffffff',
                  true
                )}
              />
            </TouchableOpacity>
            <Text
              style={[
                commonStyles.txth2,
                {
                  flex: 6,
                  color: invertColor(
                    districtData?.primaryColor
                      ? districtData?.primaryColor
                      : '#ffffff',
                    true
                  ),
                },
              ]}
            >
              Student Contacts
            </Text>
            <View
              style={{
                flex: 2,
              }}
            ></View>
          </View>

          <View
            style={{
              flex: isTab ? 1.5 : 2,
              backgroundColor: 'white',
              width: '86%',
              alignSelf: "center",
              borderRadius: 10,
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 10,
              paddingBottom: 10,
              marginBottom: 20,
              flexDirection: "column",
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: isTab ? "center" : null,
              }}
            >
              <View>
                <Image
                  style={{
                    width: isTab ? 90 : 70,
                    height: isTab ? 90 : 70,
                    borderRadius: 8,
                  }}
                  source={require('../../assets/images/noimage.png')}
                ></Image>
              </View>

              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                  marginLeft: 20,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>
                  {studentData.firstName} {studentData.lastName}
                </Text>
                <Text style={{ opacity: 0.7 }}>
                  Student ID : {studentData.studentID}
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,

                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <View
                style={{
                  borderRightColor: '#D3D3D3',
                  borderRightWidth: 1,

                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>{studentData.locationID}</Text>
                <Text style={{ opacity: 0.4 }}>School</Text>
              </View>
              <View
                style={{
                  borderRightColor: '#D3D3D3',
                  borderRightWidth: 1,

                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>{studentData.grade}</Text>
                <Text style={{ opacity: 0.4 }}>Grade</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>{studentData.homeroom}</Text>
                <Text style={{ opacity: 0.4 }}>Homeroom</Text>
              </View>
            </View>

            <View style={{ flex: 1, flexDirection: "column" }}>
              {attendanceTransactionCodeDescription != '' ? (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    backgroundColor: "silver",
                    borderRadius: 3,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ fontWeight: "bold", fontSize: 12, marginLeft: 5 }}
                  >
                    Daily Attendance:{' '}
                  </Text>
                  <FontAwesome
                    style={{ marginTop: Platform.OS === "ios" ? 0 : 2 }}
                    name='circle'
                    size={13}
                    color={attendanceTransactionColor}
                  />
                  <Text style={{ fontSize: 12 }}> {attendanceTransactionCodeDescription}</Text>
                </View>
              ) : null}
              {scheduledIn != '' ? (
                <>
                  
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      numberOfLines={2}
                      style={{ fontWeight: "bold", fontSize: 12 }}
                    >
                      Room ID:
                      <Text style={{ fontWeight: "normal", fontSize: 12 }}>
                        {roomID}
                      </Text>{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={{ fontWeight: "bold", fontSize: 12 }}
                    >
                      Room Extension:
                      <Text style={{ fontWeight: "normal", fontSize: 12 }}>
                        {' '}
                        {roomExt}
                      </Text>{' '}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <MarqueeText
                      style={{ fontSize: 12 }}
                      duration={7000}
                      marqueeOnStart
                      loop
                      marqueeDelay={1000}
                      marqueeResetDelay={1000}
                    >
                      <Text style={{ fontWeight: "bold", fontSize: 12 }}>
                        Scheduled In:{' '}
                      </Text>
                      {courseInfoString}
                    </MarqueeText>
                  </View>
                </>
              ) : (
                <>
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    {/* <Text style={{fontSize:11}}>No Schedules Found for the student</Text> */}
                  </View>
                </>
              )}
            </View>
          </View>

          <View
            style={{
              flex: 3,
              backgroundColor: 'white',
              width: '86%',
              alignSelf: "center",
              borderRadius: 10,
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 10,
              paddingBottom: 10,
              marginBottom: Platform.OS === "ios" ? 0 : 20,
            }}
          >
            {contacts.length > 0 ? (
              <FlatList
                data={contacts}
                renderItem={({ item, index }) => {
                  return (
                    <ListItem key={index}>
                      <ListItem.Content
                        key={index}
                        style={{
                          borderColor: '#D3D3D3',
                          borderWidth: 1,
                          borderRadius: 10,
                          padding: 10,
                          opacity: 0.5,
                        }}
                      >
                        {item.contactname != '' ? (
                          <View style={{ flex: 1, flexDirection: "row" }}>
                            <Ionicons
                              style={{ flex: 1 }}
                              name='home-outline'
                              size={20}
                              color='#002952'
                            />
                            <ListItem.Title
                              style={[
                                commonStyles.parentName,
                                isTab ? { flex: 3 } : { flex: 5 },
                              ]}
                            >
                              {item.contactname}
                            </ListItem.Title>
                            <Text
                              style={
                                isTab
                                  ? { flex: 4, fontSize: 12 }
                                  : { flex: 2, fontSize: 12 }
                              }
                            >
                              {item.relationship}
                            </Text>
                          </View>
                        ) : null}

                        {item.homephone != '' ? (
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              marginTop: 12,
                            }}
                          >
                            <Feather
                              style={{ flex: 1 }}
                              name='phone'
                              size={20}
                              color='#002952'
                            />
                            <ListItem.Title
                              style={[
                                commonStyles.homephone,
                                isTab ? { flex: 3 } : { flex: 5 },
                              ]}
                            >
                              {item.homephone}
                            </ListItem.Title>
                            <View style={isTab ? { flex: 4 } : { flex: 2 }}>
                              <Feather
                                onPress={() => openDialPad(item.homephone)}
                                name='phone-call'
                                size={26}
                                color='green'
                              />
                            </View>
                          </View>
                        ) : null}

                        {item.email1 != '' ? (
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              marginTop: 10,
                            }}
                          >
                            <MaterialCommunityIcons
                              style={{ flex: 1 }}
                              name='email-outline'
                              size={20}
                              color='#002952'
                            />
                            <ListItem.Subtitle style={{ flex: 7 }}>
                              {item.email1}
                            </ListItem.Subtitle>
                          </View>
                        ) : null}
                      </ListItem.Content>
                    </ListItem>
                  );
                }}
                keyExtractor={(item) => item.addressid.toString()}
              />
            ) : (
              <NoStudentsFoundMessage message='No contacts related to the students found.' />
            )}
          </View>
        </View>
        <View style={commonStyles.static_white_background}></View>
      </View>
    </SafeAreaView>
  );
};

export default studentContactsScreen;
