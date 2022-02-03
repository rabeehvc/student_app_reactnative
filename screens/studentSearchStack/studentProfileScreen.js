import React, { useEffect, useState} from 'react';
import {
  Text,
  View,
  Alert,
  Image,
  FlatList,
  TouchableOpacity,
  Platform,
  BackHandler
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { isLoadingChanged } from '../../redux/app-redux';
import RetrieveStudentDataService from '../../services/retrieveStudentDataService';
import RetrieveStudentContactsService from '../../services/retrieveStudentContactsService';
import AttendanceService from '../../services/attendanceService';
import Loader from '../../components/Loader';
import RetrieveDisciplineFormDataService from '../../services/retrieveDisciplineFormDataService';
import RetrieveStudentScheduleService from '../../services/retrieveStudentScheduleService';
import StudentProfileMenuItem from '../../components/studentProfileMenuItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../../styles/commonStyles';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';
import MarqueeText from 'react-native-marquee';
import { invertColor } from '../../functions/functions';
import {
  checkLocalUserPermission,
  checkLocalUserFeatureFlag,
} from '../../utilities/permissionsUtilities';

const studentProfileScreen = ({ navigation, route }) => {
  const { districtData } = useSelector((state) => state);
  const { userData, isTab } = useSelector((state) => state);
  const stateData = useSelector((state) => state);
  const { hasFullAccess } = useSelector((state) => state);
  const [studentData, setStudentData] = useState([]);
  const [studentDataLoaded, setStudentDataLoaded] = useState(false);
  const [localMenuOptions, setLocalMenuOptions] = useState([]);
  const [snackBarIsVisible, setSnackBarIsVisible] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState(null);
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
  const isFocused = useIsFocused();
  const { navigationOrigin } = route.params;
  const dispatch = useDispatch();

  const menuOptions = [
    {
      name: 'Attendance',
      id: 0,
      permission: 'Attendance Entry',
      iconName: 'calendar-check-o',
    },
    {
      name: 'Discipline',
      id: 1,
      permission: 'Discipline Quick Entry',
      iconName: 'balance-scale',
    },
    {
      name: 'Contact',
      id: 2,
      permission: 'Display Contacts',
      iconName: 'address-book',
    },
    {
      name: 'Schedule',
      id: 3,
      permission: 'Discipline Quick Entry',
      iconName: 'balance-scale',
      featureFlag: 'student_schedule',
    },
  ];

  useEffect(()=>{

    const backAction = () => {
      if (route.params?.fromBarcodeScreen){             
        navigation.navigate('StudentSearchScreen')
      }else{             
        navigation.goBack()
      }
      return true
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  })

  useEffect(() => {
    if (route.params?.message) {
      if (isFocused) {
        setSnackBarIsVisible(true);
        setSnackBarMessage(route.params?.message);
        route.params.message = null;
        if (studentData != null) {
          getCurrentAttendanceAndScheduledInData();
        }
      }
    }
  }, [route.params?.message, isFocused]);

  useEffect(() => {
    getStudentData();
    configureMenuOptions();
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
      setScheduledInHasLoaded(false);
      Alert.alert('Unable to retrieve student schedule data.', responseError);
    }
  };

  useEffect(() => {
    if (studentData != null) {
      getCurrentAttendanceAndScheduledInData();
      directNavigation();      
    }
  }, [studentData]);

  // From the more screen, if user clicks on the studentsQuickDisciplineEntry or
  // studentQuickAttendance then it will redirect to the specific screens without
  // touching the student profile screen
  const directNavigation = () => {
    if (navigationOrigin !== undefined) {
      // check some info out and determine our route of origin
      switch (navigationOrigin) {
        case 'discQuickEntry':
          pullDisciplineFormData();
          break;
        case 'dailyAttendance':
          pullAttendanceCodes();
          break;
        case 'studentSchedule':
          // this.pullAttendanceCodes();
          break;
        case 'default':
          break;
        default:
          console.log(
            'Something weird is going on with the navigationOrigin param.'
          );
          break;
      }
    }
  };

  // returning the local menu's available to the students
  const configureMenuOptions = () => {
    const localMenuOptions = menuOptions.filter((item) => {
      if (item.featureFlags) {
        if (checkLocalUserFeatureFlag(item.featureFlags) == false) {
          return false;
        }
      }
      if (item.permissions) {
        if (checkLocalUserPermission(item.permissions)) {
          return true;
        }
        return false;
      }
      return true;
    });
    setLocalMenuOptions(localMenuOptions);
  };

  // Fetch the students details based on the studentId
  const getStudentData = async () => {
    try {
      dispatch(isLoadingChanged(true));
      const retrieveStudentDataService = new RetrieveStudentDataService();
      const studentID = route.params.studentID;
      const response =
        await retrieveStudentDataService.performStudentDataRequest(
          userData.sessionToken,
          studentID
        );

      if (!response.JWTIsValid) {
        dispatch(isLoadingChanged(false));
        return;
      }
      if (
        response.studentData === undefined ||
        response.studentData === null ||
        response.studentData === ''
      ) {
        navigation.navigate('StudentSearchScreen', {
          message: 'Invalid student ID. Please try again.',
        });
      } else {
        if (response.status === 'success') {
          setStudentData(response.studentData);
          setStudentDataLoaded(true);
        } else {
          Alert.alert(
            'Request failed',
            'An error occurred while trying to retrieve data. Please try again.'
          );
        }
      }
      dispatch(isLoadingChanged(false));
    } catch (responseError) {
      dispatch(isLoadingChanged(false));
      Alert.alert('Unable to retrieve student data.', '', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('StudentSearchScreen'),
        },
      ]);
    }
  };

  const configureLocalMenuItemAccess = (id) => {
    switch (id) {
      case 0:
      case 1:
      case 2:
      case 3:
        return !userHasFullAccess();
      default:
        break;
    }
    return false;
  };

  const userHasFullAccess = () => {
    return hasFullAccess;
  };

  // Discipline Button Action - Retrieve data for discipline form
  const pullDisciplineFormData = async () => {
    if (typeof studentData?.studentID != 'undefined') {
      try {
        dispatch(isLoadingChanged(true));
        const disciplineFormDataService =
          new RetrieveDisciplineFormDataService();

        const response =
          await disciplineFormDataService.performDisciplineFormDataRequest(
            userData.sessionToken,
            studentData.studentID
          );
        dispatch(isLoadingChanged(false));
        if (!response.JWTIsValid) {
          return;
        }
        if (response.status === 'success') {
          let selectedReportedBy = '';

          // if the user is in the list of possible reportedby users then assign
          // the current value of the reportedby dropdown to the current users employeeid.
          response.reportedBy.map((item)=>{           
            if(item.value === userData.employeeID){             
              selectedReportedBy = userData.employeeID;
            }
          })
          // for (let i = 0; i < response.reportedBy.length; i += 1) {
          //   if (response.reportedBy[i].value === userData.employeeID) {              
          //     selectedReportedBy = userData.employeeID;
          //   }
          // }
                  
          navigation.navigate('StudentDisciplineScreen', {
            studentData,
            incidents: response.incidents,
            locations: response.locations,
            reportedBy: response.reportedBy,
            selectedReportedBy,
            // showSnackBar: this.showSnackBar,
            navigationOrigin: navigationOrigin,
            singleStudent: route.params?.singleStudent,
          });
        } else {
          Alert.alert(
            'Request failed',
            'An error occurred when retrieving discipline form data.'
          );
        }
      } catch (responseError) {
        dispatch(isLoadingChanged(false));
        Alert.alert('Unable to retrieve discipline form data.', responseError);
      }
    }
  };

  // Attendance Button Action - Retrieve attendance codes and current data for daily attendance form
  const pullAttendanceCodes = async () => {
    if (typeof studentData?.studentID != 'undefined') {
      try {
        dispatch(isLoadingChanged(true));
        const attendanceService = new AttendanceService();
        const { studentID } = studentData;
        const response =
          await attendanceService.performRetrieveDailyAttendanceDataForStudentRequest(
            userData.sessionToken,
            studentID
          );

        dispatch(isLoadingChanged(false));
        if (!response.JWTIsValid) {
          return;
        }
        if (response.status === 'success') {          
          navigation.navigate('StudentIndividualDailyAttendanceEntryScreen', {
            studentData,
            currentDailyAttendance: response.currentDailyAttendance,
            attendanceCodes: response.attendanceCodes,
            // showSnackBar: this.showSnackBar,
            navigationOrigin: navigationOrigin,
            singleStudent: route.params?.singleStudent,
          });
        } else {
          Alert.alert('Problem retrieving attendance codes.');
        }
      } catch (responseError) {
        dispatch(isLoadingChanged(false));
        Alert.alert('Unable to retrieve attendance codes.', responseError);
      }
    }
  };

  // Contact Button Action - Retrieve list of contacts
  const pullStudentContacts = async () => {
    try {
      dispatch(isLoadingChanged(true));
      const retrieveStudentContactsService =
        new RetrieveStudentContactsService();
      const { studentID } = studentData;
      const response =
        await retrieveStudentContactsService.performStudentContactsRequest(
          userData.sessionToken,
          studentID
        );
      dispatch(isLoadingChanged(false));
      if (!response.JWTIsValid) {
        return;
      }
      if (response.status === 'success') {
        navigation.navigate('StudentContactsScreen', {
          studentData: studentData,
          contacts: response.contacts,
        });
      } else {
        Alert.alert('Problem retrieving attendance codes.');
      }
    } catch (responseError) {
      dispatch(isLoadingChanged(false));
      Alert.alert('Unable to retrieve student contact data.', responseError);
    }
  };

  // Scheudle Button Action - Retrieve list of contacts
  const pullStudentSchedule = async () => {
    try {
      dispatch(isLoadingChanged(true));
      const retrieveStudentScheduleService =
        new RetrieveStudentScheduleService();
      const { studentID } = studentData;
      const response =
        await retrieveStudentScheduleService.performStudentScheduleRequest(
          userData.sessionToken,
          studentID
        );
      dispatch(isLoadingChanged(false));
      if (!response.JWTIsValid) {
        return;
      }

      if (response.status == 'success') {
        if (typeof response.scheduleData[response.currentDay] == 'undefined') {
          navigation.navigate('StudentSchedulePrimaryScreen', {
            studentData: studentData,
            scheduleData: response.scheduleData,
            periodData: response.periodData,
            periodOrder: response.periodOrder,
            currentDay: response.currentDay,
          });
        } else {
          navigation.navigate('StudentScheduleDayScreen', {
            studentData: studentData,
            scheduleData: response.scheduleData,
            periodData: response.periodData,
            periodOrder: response.periodOrder,
            currentDay: response.currentDay,
            selectedDay: response.currentDay,
          });
        }
      } else {
        Alert.alert(
          `This student's schedule is not available on a mobile device.`
        );
      }
    } catch (responseError) {
      dispatch(isLoadingChanged(false));
      Alert.alert('Unable to retrieve student schedule data.', responseError);
    }
  };

  const backNavigation = () => {  
    if (route.params?.fromBarcodeScreen){      
      navigation.navigate('StudentSearchScreen')
    }else{      
      navigation.goBack()
    }
  }

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
              onPress={() => backNavigation()}
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
              Student Profile
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
            {studentData?.length == 0 ? (
              <Loader column={1} />
            ) : (
              <>
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
                        numberOfLines={1}
                      >
                        Daily Attendance:{' '}
                      </Text>
                      <FontAwesome
                        style={{ marginTop: Platform.OS === "ios" ? 0 : 2 }}
                        name="circle"
                        size={13}
                        color={attendanceTransactionColor}
                      />
                      <Text style={{ fontSize: 12 }}>
                        {' '}
                        {attendanceTransactionCodeDescription}
                      </Text>
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
              </>
            )}
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
              marginBottom: Platform.OS === "ios" ? 0 : 20,
            }}
          >
            <FlatList
              data={localMenuOptions}
              extraData={[stateData, userHasFullAccess()]}
              renderItem={({ item }) => (
                <StudentProfileMenuItem
                  id={item.id}
                  title={item.name}
                  leftIconName={item.iconName}
                  onPress={() => {
                    switch (item.id) {
                      case 0:
                        pullAttendanceCodes();
                        break;
                      case 1:
                        pullDisciplineFormData();
                        break;
                      case 2:
                        pullStudentContacts();
                        break;
                      case 3:
                        pullStudentSchedule();
                        break;
                      default:
                        console.log('Error. Unknown selection made.');
                        break;
                    }
                  }}
                  // disabled={configureLocalMenuItemAccess(item.id)}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
            />
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Snackbar
                duration={1500}
                visible={snackBarIsVisible}
                onDismiss={() => setSnackBarIsVisible(false)}
              >
                {snackBarMessage}
              </Snackbar>
            </View>
          </View>
        </View>
        <View style={commonStyles.static_white_background}></View>
      </View>
    </SafeAreaView>
  );
};

export default studentProfileScreen;
