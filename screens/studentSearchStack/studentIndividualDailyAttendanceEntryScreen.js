import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  MaterialIcons,
  EvilIcons,
  Feather,
  FontAwesome,
} from '@expo/vector-icons';
import { Picker, DatePicker } from 'react-native-woodpicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MarqueeText from 'react-native-marquee';
import moment from 'moment';
import RetrieveStudentDataService from '../../services/retrieveStudentDataService';
import { isLoadingChanged } from '../../redux/app-redux';
import AttendanceService from '../../services/attendanceService';
import commonStyles from '../../styles/commonStyles';
import { invertColor } from '../../functions/functions';

const StudentIndividualDailyAttendanceEntryScreen = ({ navigation, route }) => {
  const [selectedAttendanceCode, setSelectedAttendanceCode] = useState('');
  const [attendanceCodes, setAttendanceCodes] = useState([]);
  const [comments, setComments] = useState();
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [transactionTime, setTransactionTime] = useState();
  const { height: wHeight } = Dimensions.get('window');
  const { districtData } = useSelector((state) => state);
  const { userData, isTab } = useSelector((state) => state);
  const [scheduledInHasLoaded, setScheduledInHasLoaded] = useState(false);
  const [scheduledIn, setScheduledIn] = useState('');
  const [courseInfoString, setCourseInfoString] = useState('');
  const [roomID, setRoomID] = useState('');
  const [roomExt, setRoomExt] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [attendanceTransactionColor, setAttendanceTransactionColor] =
    useState('');
  const [
    attendanceTransactionCodeDescription,
    setAttendanceTransactionCodeDescription,
  ] = useState('');
  const { studentData, currentDailyAttendance, navigationOrigin } =
    route.params;
    const dispatch = useDispatch();

  useEffect(() => {
    if (attendanceCodes.length > 0) {
      if (Object.keys(currentDailyAttendance).length == 0) {
        setSelectedAttendanceCode(route.params.attendanceCodes[0]);
        setSelectedTime('Time');
      } else {
        let transactionCode = currentDailyAttendance.transactionCode;
        let index = attendanceCodes.findIndex(
          (obj) => obj.value === transactionCode
        );
        setSelectedAttendanceCode(route.params.attendanceCodes[index]);
        if (currentDailyAttendance?.tardyTime) {
          setSelectedTime(currentDailyAttendance?.tardyTime);
        } else {
          setSelectedTime('Time');
        }
      }
    }
  }, [attendanceCodes]);

  useEffect(() => {
    setAttendanceCodes(route.params.attendanceCodes);
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

  // Every time an attendance code is changed, we set new state for TransactionTime (AKA TardyTime)
  // If we are selecting a transaction code that does not require time, then we set the selected TransactionTime to empty string.
  const onChangeAttendanceCode = (attendanceCode) => {
    if (!hasTimeField(attendanceCode.value)) {
      setTransactionTime();
    }
    if (attendanceCode.value == '') {
      setSelectedAttendanceCode(attendanceCodes[0]);
    } else {
      setSelectedAttendanceCode(attendanceCode);
    }
  };

  // check if the attendance code has time field and returns value
  const hasTimeField = (attendanceCode) => {
    let hasTimeField = 0;
    attendanceCodes.forEach((attendanceCodeObj) => {
      if (attendanceCodeObj.value === attendanceCode) {
        hasTimeField = attendanceCodeObj.requiresTime;
      }
    });
    return hasTimeField;
  };

  // Callback Datepicker time change event
  const handleTimeChange = (timeSelected) => {
    setTransactionTime(timeSelected);
  };

  // Callback datepicker time text display
  const handleTimeText = () =>
    transactionTime == undefined
      ? selectedTime
      : moment(transactionTime).format('hh:mm A') ?? 'Time';

  const RenderTimeField = () => {
    if (hasTimeField(selectedAttendanceCode.value)) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <DatePicker
            style={{              
              borderBottomColor: '#D3D3D3',
              borderBottomWidth: 1,
              height: 30,
            }}
            mode='time'
            textInputStyle={{ fontSize: 13 }}
            onDateChange={(timeSelected) => handleTimeChange(timeSelected)}
            text={handleTimeText()}
            iosDisplay='inline'
            backdropAnimation={{ opacity: 0 }}
            androidMode='countdown'
            iosDisplay='spinner'
            androidDisplay='spinner'
          />
          <Feather name='clock' style={commonStyles.icon} />
        </View>
      );
    }
    return null;
  };

  // Saving Attendance record
  const onAttendanceSubmit = async () => {
    if (typeof selectedAttendanceCode.value == 'undefined') {
      Alert.alert(
        'Field Empty',
        'You must choose an attendance code to continue'
      );
      return;
    }

    setDisableSubmit(true);
    try {
      const attendanceService = new AttendanceService();
      dispatch(isLoadingChanged(true))
      let time = '';

      if (typeof transactionTime == 'undefined') {
        time = '';
      } else {
        time = moment(transactionTime).format('HH:mm');
      }

      const response =
        await attendanceService.performSubmitIndividualDailyAttendanceTransaction(
          userData.sessionToken,
          studentData.studentID,
          selectedAttendanceCode.value,
          time,
          '', // transactionTimeAMPM,
          '', // hours
          comments // does nothing yet
        );
      if (response.error != null) {
        Alert.alert('Failed', response.error);
        dispatch(isLoadingChanged(false))
        setDisableSubmit(false);
        return;
      }

      dispatch(isLoadingChanged(false))
      if (!response.JWTIsValid || !response.hasPermission) {
        setDisableSubmit(false);        
        return;
      }
      if (response.status === 'success') {
        if (
          navigationOrigin === 'dailyAttendance' ||
          navigationOrigin === 'discQuickEntry'
        ) {
          if(route.params?.singleStudent == true){
            navigation.navigate({
              name: 'StudentSearchScreen',
              params: { message: response.message },
              merge: true,
            });               
          }else{
            navigation.navigate({
              name: 'StudentListScreen',
              params: { message: response.message },
              merge: true,
            });               
          }
        } else {
          navigation.navigate({
            name: 'StudentProfileScreen',
            params: { message: response.message },
            merge: true,
          });
        }
      } else {
        Alert.alert('Problem submitting attendance record.', response.message);
      }
      setDisableSubmit(false);
      dispatch(isLoadingChanged(false))
      
    } catch (responseError) {
      dispatch(isLoadingChanged(false))
      setDisableSubmit(false);
      Alert.alert('Unable to submit attendance record.', responseError);
    }
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
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          bounces={false}
          style={{ zIndex: 999, flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View
            style={{
              flex: 1,
              height: Platform.OS === "ios" ? wHeight - 150 : wHeight - 100,
              flexDirection: "column",
              justifyContent: "space-between",
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
                Daily Attendance Entry
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
                    Student Id : {studentData.studentID}
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
                      style={{
                        fontWeight: "bold",
                        fontSize: 12,
                        marginLeft: 5,
                      }}
                    >
                      Daily Attendance:{' '}
                    </Text>
                    <FontAwesome
                      style={{ marginTop: Platform.OS === "ios" ? 2 : 4 }}
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
                backgroundColor: "white",
                width: '86%',
                alignSelf: "center",
                borderRadius: 10,
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 10,
                paddingBottom: 10,              
                marginBottom: Platform.OS === "ios" ? 0 : 20,
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <Picker
                  style={{
                    borderBottomColor: '#D3D3D3',
                    borderBottomWidth: 1,
                    height: 30,
                  }}
                  textInputStyle={{ fontSize: 13 }}
                  item={selectedAttendanceCode}
                  items={attendanceCodes}
                  onItemChange={onChangeAttendanceCode}
                  isNullable
                />
              
                  <MaterialIcons
                    name='keyboard-arrow-down'
                    style={commonStyles.icon}
                  />
               
              </View>

              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <TextInput
                  style={{
                    borderBottomColor: '#D3D3D3',
                    borderBottomWidth: 1,
                    height: 30,
                  }}
                  value={comments}
                  maxLength={25}
                  onChangeText={(comments) => setComments(comments)}
                  placeholder='Comments'
                  placeholderTextColor={'#999999'}
                ></TextInput>
                <EvilIcons name='comment' style={commonStyles.icon} />
              </View>

              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <RenderTimeField />
              </View>

              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  disabled={disableSubmit}
                  activeOpacity={0.6}
                  style={[commonStyles.btn]}
                  onPress={() => onAttendanceSubmit()}
                >
                  <Text
                    style={{
                      color: 'white',
                    }}
                  >
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                }}
              >               
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View style={commonStyles.static_white_background}></View>
      </View>
    </SafeAreaView>
  );
};

export default StudentIndividualDailyAttendanceEntryScreen;

