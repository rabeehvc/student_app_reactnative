import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { isLoadingChanged } from '../../redux/app-redux';
import moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker, DatePicker } from 'react-native-woodpicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  MaterialIcons,
  EvilIcons,
  Feather,
  FontAwesome,
} from '@expo/vector-icons';
import MarqueeText from 'react-native-marquee';
import { StatusBar } from 'expo-status-bar';
import AddDisciplineEntryService from '../../services/addDisciplineEntryService';
import RetrieveStudentDataService from '../../services/retrieveStudentDataService';
import commonStyles from '../../styles/commonStyles';
import { invertColor } from '../../functions/functions';

const StudentDisciplineScreen = ({ navigation, route }) => {
  const [selectedIncident, setSelectedIncident] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [selReportedBy, setSelReportedBy] = useState('');
  const [notes, setNotes] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const { height: wHeight } = Dimensions.get('window');
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
  const dispatch = useDispatch()


  const { districtData, isTab, userData } = useSelector((state) => state);
  const {
    studentData,
    incidents,
    locations,
    reportedBy,
    selectedReportedBy,
    navigationOrigin,
  } = route.params;

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

  // Saving discipline violation records
  const addDisciplineEntry = async () => {
   
    try {
      const addDisciplineEntryService = new AddDisciplineEntryService();
      const studentID = studentData.studentID;

      if (!selectedIncident) {
        Alert.alert('Required', 'Please select the type of incident.');
       
        return;
      }

      if (!selectedDate) {
        Alert.alert('Required', 'Please select date of the incident.');
        
        return;
      }

      if (typeof selectedTime == 'undefined') {
        Alert.alert('Required', 'Please select time of the incident.');
       
        return;
      }

      if (!selectedLocation) {
        Alert.alert('Required', 'Please select the incident location.');
       
        return;
      }

      if (!selReportedBy) {
        Alert.alert(
          'Required',
          'Please select who the incident was reported by.'
        );
        
        return;
      }
      setDisableSubmit(true);
      let selDate = moment(new Date(selectedDate)).format('YYYY-MM-DD');
      let time = moment(selectedTime).format('HH:mm');

      dispatch(isLoadingChanged(true))
      const response =
        await addDisciplineEntryService.performAddDisciplineEntryRequest(
          userData.sessionToken,
          studentID,
          selectedIncident.value,
          selDate,
          time,
          selectedLocation.value,
          selReportedBy.value,
          notes
        );

      
      if (!response.JWTIsValid || !response.hasPermission) {
        dispatch(isLoadingChanged(false))
        return;
      }
      if (response.status === 'success') {
        if (
          navigationOrigin === 'dailyAttendance' ||
          navigationOrigin === 'discQuickEntry'
        ) {
          if (route.params?.singleStudent == true) {
            navigation.navigate({
              name: 'StudentSearchScreen',
              params: { message: response.message },
              merge: true,
            });
          } else {
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
      } else if (response.message) {
        Alert.alert('Failed to save discipline entry.', response.message);
      } else {
        Alert.alert('Failed to save discipline entry.');
      }
      setDisableSubmit(false);
      dispatch(isLoadingChanged(false))
    } catch (responseError) {
      dispatch(isLoadingChanged(false))      
      Alert.alert('Unable to retrieve discipline form data.', responseError);
      setDisableSubmit(false);      
    }
  };

  // Callback function - Incident dropdown change event
  const changeIncident = (item) => {
    if (item.value == '') {
      setSelectedIncident(incidents[0].value);
    } else {
      setSelectedIncident(item);
    }
  };

  // Callback function - location dropdown change event
  const changeLocation = (item) => {
    if (item.value == '') {
      setSelectedLocation(locations[0].value);
    } else {
      setSelectedLocation(item);
    }
  };

  // Callback function - datepicker change event
  const handleDateChange = (date) => setSelectedDate(date);

  // Callback function - timepicker change event
  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  // Callback function - datepicker display
  const handleDateText = () =>
    selectedDate == undefined
      ? 'Date'
      : moment(selectedDate).format('MM/DD/yyyy');

  // Callback function - timepicker display
  const handleTimeText = () =>
    selectedTime == undefined ? 'Time' : moment(selectedTime).format('hh:mm A');

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
          bounces={false}
          enableOnAndroid={true}
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
                Discipline Entry
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
                      alignItems: "center",
                      borderRadius: 3,
                      backgroundColor: 'silver',
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
                      style={{ marginTop: Platform.OS === "ios" ? 0 : 2 }}
                      name="circle"
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
                    <View style={{ flex: 1, flexDirection: "row" }}></View>
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
                  textInputStyle={{ fontSize: 14 }}
                  item={selectedIncident}
                  items={incidents}
                  onItemChange={(item) => {
                    changeIncident(item);
                  }}
                  placeholder='Incident'
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
                  flexDirection: "row",
                }}
              >
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <DatePicker
                    style={{
                      borderBottomColor: '#D3D3D3',
                      borderBottomWidth: 1,
                      height: 30,
                    }}
                    textInputStyle={{ fontSize: 13 }}
                    onDateChange={handleDateChange}
                    text={handleDateText()}
                    iosDisplay='inline'
                    backdropAnimation={{ opacity: 0 }}
                    minDate={new Date(Date.now())}
                    iosMode='date'
                    androidMode='countdown'
                    iosDisplay='spinner'
                    androidDisplay='spinner'
                  />

                  <MaterialIcons name='date-range' style={commonStyles.icon} />
                </View>
                <View
                  style={{ flex: 1, marginLeft: 20, justifyContent: "center" }}
                >
                  <DatePicker
                    style={{
                      borderBottomColor: '#D3D3D3',
                      borderBottomWidth: 1,
                      height: 30,
                    }}
                    mode='time'
                    textInputStyle={{ fontSize: 13 }}
                    value={selectedTime}
                    onDateChange={handleTimeChange}
                    text={handleTimeText()}
                    iosDisplay='inline'
                    backdropAnimation={{ opacity: 0 }}
                    androidMode='countdown'
                    iosDisplay='spinner'
                    androidDisplay='spinner'
                  />

                  <Feather name='clock' style={commonStyles.icon} />
                </View>
              </View>

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
                  item={selectedLocation}
                  items={locations}
                  onItemChange={(item) => {
                    changeLocation(item);
                  }}
                  placeholder='Location'
                  isNullable={true}
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
                <Picker
                  style={{
                    borderBottomColor: '#D3D3D3',
                    borderBottomWidth: 1,
                    height: 30,
                  }}
                  textInputStyle={{ fontSize: 13 }}
                  item={selReportedBy}
                  items={reportedBy}
                  onItemChange={setSelReportedBy}
                  placeholder='Reported By'
                  isNullable
                />

               
                  <MaterialIcons
                    name='keyboard-arrow-down'
                    style={commonStyles.icon}
                  />
                
              </View>
              <View style={{ flex: 1, justifyContent: "center" }}>
                <TextInput
                  style={{
                    borderBottomColor: '#D3D3D3',
                    borderBottomWidth: 1,
                    height: 30,
                  }}
                  value={notes}
                  maxLength={25}
                  onChangeText={(note) => setNotes(note)}
                  placeholder='Notes'
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
                <TouchableOpacity
                  disabled={disableSubmit}
                  activeOpacity={0.6}
                  style={[commonStyles.btn]}
                  onPress={() => addDisciplineEntry()}
                >
                  <Text
                    style={{
                      color: 'white',
                    }}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              </View>           
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View style={commonStyles.static_white_background}></View>
      </View>
    </SafeAreaView>
  );
};

export default StudentDisciplineScreen;

