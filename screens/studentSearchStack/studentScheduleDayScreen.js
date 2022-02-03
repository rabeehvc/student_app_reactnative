import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListItem, Badge } from 'react-native-elements';
import MarqueeText from 'react-native-marquee';
import { useSelector } from 'react-redux';
import RetrieveStudentDataService from '../../services/retrieveStudentDataService';
import ListItemSeparator from '../../components/graphical/listItemSeparator';
import { invertColor } from '../../functions/functions';
import commonStyles from '../../styles/commonStyles';

const studentScheduleDayScreen = ({ navigation, route }) => {
  const { districtData, isTab } = useSelector((state) => state);
  const { userData } = useSelector((state) => state);
  const [dayDescription, setDayDescription] = useState();
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
  const { studentData, scheduleData, selectedDay, periodOrder, periodData } =
    route.params;

  useEffect(() => {
    setDayDescription(scheduleData[selectedDay]['mask']['displayas']);
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

  // render the student schedules
  const renderScheduleDayPeriodItem = (period) => {
    var periodKey = period;
    for (periodCheckKey in periodData) {
      if (periodData[periodCheckKey]['display'] == period) {
        var periodKey = periodCheckKey;
      }
    }

    var periodDetail = scheduleData[selectedDay]['periods'][periodKey];
    var periodTitle = '';
    var periodBadgeDetailText = `Period ${period.toString()}`;
    var periodBadgeDetail = { value: periodBadgeDetailText, status: 'success' };

    if (
      typeof periodDetail == 'undefined' ||
      periodDetail['courses'].length == 0
    ) {
      return null;
    }
    var courseCount = 0;
    for (courseIndex in periodDetail['courses']) {
      if (courseCount > 0) {
        periodTitle += '\n';
      }
      var course = periodDetail['courses'][courseIndex];
      var status = course['studentcoursedetails']['coursestatusid'];
      if (status == 'I' || status == 'W') {
      } else {
        courseCount++;
        periodTitle += course['course'].title;
        periodTitle +=
          ' (' +
          course['meetingtime'].courseid +
          '/' +
          course['meetingtime']['sectionid'] +
          ')';
        if (course['meetingtime']['teachers'].length > 0) {
          periodTitle += ' - ';
          periodTitle += course['meetingtime']['teachers'][0][
            'firstname'
          ].substring(0, 1);
          periodTitle += '. ';
          periodTitle += course['meetingtime']['teachers'][0]['lastname'];
        }
        periodTitle += ' - Rm: ';
        periodTitle += course['meetingtime']['roomid'].toString();
      }
    }
    if (courseCount == 0) {
      return null;
    }
    return (
      <View>
        <TouchableOpacity>
          <ListItem>
            <Badge
              value={periodBadgeDetail.value}
              status={periodBadgeDetail.status}
            />
            <ListItem.Content>
              <ListItem.Title style={{ fontSize: 12 }}>
                {periodTitle}
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>

          <ListItemSeparator />
        </TouchableOpacity>
      </View>
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
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              style={{
                flex: 2,
                alignItems: "center",
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
              Student Schedule
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
              marginTop: 10,
              marginBottom: 20,
              flexDirection: "column",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
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
                    backgroundColor: 'silver',
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
              marginBottom: Platform.OS === "ios" ? 0 : 20,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: '#D3D3D3',
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                justifyContent: "center",
                alignItems: "flex-start",
                marginBottom: 5,
                paddingLeft: 15,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                {dayDescription}
              </Text>
            </View>
            <View style={{ flex: 7 }}>
              <FlatList
                data={periodOrder}
                renderItem={({ item }) => {
                  return renderScheduleDayPeriodItem(item);
                }}
                keyExtractor={(item) => item}
              />
            </View>
          </View>
        </View>

        <View style={commonStyles.static_white_background}></View>
      </View>
    </SafeAreaView>
  );
};

export default studentScheduleDayScreen;
