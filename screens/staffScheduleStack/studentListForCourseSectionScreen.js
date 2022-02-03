import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  Alert,
  FlatList,
  Platform,
  TouchableOpacity
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Snackbar } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { isLoadingChanged } from '../../redux/app-redux';
import AttendanceService from '../../services/attendanceService';
import NoStudentsFoundMessage from '../../components/noStudentsFoundMessage';
import { invertColor } from '../../functions/functions';
import commonStyles from '../../styles/commonStyles';

const studentListForCourseSectionScreen = ({ navigation, route }) => {
  const { districtData } = useSelector((state) => state);
  const { userData } = useSelector((state) => state);
  const { height: wHeight } = Dimensions.get('window');
  const { courseSectionObj } = route.params;
  const [snackBarIsVisible, setSnackBarIsVisible] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState(null);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [studentsArray, setStudentsArray] = useState([]);
  const [labelText, setLabelText] = useState([]);
  const [valueText, setValueText] = useState([]);

  useEffect(() => {
    setStudentsArray(route.params?.studentsArray);
    setLabelText(route.params?.labelText);
    setValueText(route.params?.valueText);
  }, []);

  useEffect(() => {
    if (route.params?.message) {
      if (isFocused) {
        setSnackBarIsVisible(true);
        setSnackBarMessage(route.params?.message);
        route.params.message = null;
      }
    }
  }, [route.params?.message, isFocused]);

  // Navigate the screen to take daily attendance screen if the user has selected the homeroom button
  const navigateToMassDailyAttendanceScreen = async (courseSectionObj) => {
    try {
      isLoadingChanged(true);
      const attendanceService = new AttendanceService();
      const response =
        await attendanceService.performRetrieveDailyAttendanceDataForHomeroomRequest(
          userData.sessionToken,
          courseSectionObj.locationID,
          courseSectionObj.roomID
        );

      if (!response.JWTIsValid) {
        dispatch(isLoadingChanged(false));
        return;
      }
      if (response.status === 'success') {
        navigation.navigate('StudentMassDailyAttendanceEntryScreen', {
          courseSectionObj,
          studentsArray: response.students,
          dailyAttendanceCodes: response.dailyAttendanceCodes,
        });
      } else {
        Alert.alert(
          'Problem retrieving daily attendance data.',
          response.message
        );
      }
      dispatch(isLoadingChanged(false));
    } catch (responseError) {
      dispatch(isLoadingChanged(false));
      Alert.alert('Unable to retrieve daily attendance data.', responseError);
    }
  };

  // Navigate the screen to take period attendance screen if the user has selected any subject list item
  const navigateToPeriodAttendanceScreen = async (courseSectionObj) => {
    try {
      dispatch(isLoadingChanged(true));
      const attendanceService = new AttendanceService();
      const response =
        await attendanceService.performRetrievePeriodAttendanceDataRequest(
          userData.sessionToken,
          courseSectionObj.meetingTimeID,
          courseSectionObj.locationID
        );

      if (!response.JWTIsValid) {
        dispatch(isLoadingChanged(false));
        return;
      }

      if (response.status === 'success') {
        navigation.navigate('PeriodAttendanceScreen', {
          courseSectionObj,
          studentsArray: response.students,
          periodAttendanceCodes: response.periodAttendanceCodes,
          // showSnackBar: this.showSnackBar
        });
      } else {
        Alert.alert(
          'Problem retrieving period attendance data.',
          response.message
        );
      }
      dispatch(isLoadingChanged(false));
    } catch (responseError) {
      dispatch(isLoadingChanged(false));
      Alert.alert('Unable to retrieve period attendance data.', responseError);
    }
  };

  const navigateToStudentProfileScreen = (item) => {
    navigation.navigate({
      name: 'StudentProfileScreen',
      params: { studentID: item.studentid },
      merge: true,
    });
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
        <View style={{ flex: 1, height: wHeight - 94, zIndex: 9999 }}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 2, alignItems: "center" }}>
              <TouchableOpacity
                style={{
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
            </View>

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
              {labelText} {valueText}
            </Text>
            <View
              style={{
                flex: 2,
              }}
            ></View>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              width: '86%',
              alignSelf: "center",
              borderRadius: 10,
              marginBottom: 20,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flex: 1,
                  marginLeft: 10,
                }}
              >
                <Text
                  numberOfLines={3}
                  style={{
                    fontSize: 13,
                  }}
                >
                  {courseSectionObj.courseTitle}:
                  {courseSectionObj.isHomeroom == 1
                    ? ` ${courseSectionObj.roomID}`
                    : ` ${courseSectionObj.courseSection}`}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  marginRight: 10,
                }}
              >
                {courseSectionObj.isHomeroom == 1 ? (
                  <TouchableOpacity
                    onPress={() =>
                      navigateToMassDailyAttendanceScreen(courseSectionObj)
                    }
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      paddingVertical: 6,
                      paddingHorizontal: 5,
                      borderRadius: 8,
                      backgroundColor: '#84C441',
                      width: '95%',
                      height: 35,
                    }}
                  >
                    <Text
                      style={{
                        color: '#ffffff',
                        textAlign: "center",
                        fontSize: 12,
                      }}
                    >
                      Take Daily Attendance
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      navigateToPeriodAttendanceScreen(courseSectionObj)
                    }
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      paddingVertical: 6,
                      paddingHorizontal: 5,
                      borderRadius: 8,
                      backgroundColor: '#84C441',
                      width: '95%',
                      height: 35,
                    }}
                  >
                    <Text
                      style={{
                        color: '#ffffff',
                        textAlign: "center",
                        fontSize: 12,
                      }}
                    >
                      Take Period Attendance
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 5,
              backgroundColor: 'white',
              width: '86%',
              alignSelf: "center",
              borderRadius: 10,
              padding: 10,
              marginBottom: Platform.OS === "ios" ? 0 : 20,
            }}
          >
            {studentsArray?.length > 0 ? (
              <FlatList
                data={studentsArray}
                renderItem={({ item }) => (
                  <View
                    style={{
                      borderRadius: 10,
                      borderWidth: 0.5,
                      borderColor: '#D3D3D3',
                      padding: 10,
                      marginBottom: 5,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => navigateToStudentProfileScreen(item)}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={{ fontWeight: "bold" }}>
                            {item.firstname} {item.lastname}
                          </Text>
                          <Text>
                            Grade :{' '}
                            <Text style={{ fontWeight: "bold" }}>
                              {item.grade}
                            </Text>
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text>
                            ID:{' '}
                            <Text style={{ fontWeight: "bold" }}>
                              {item.studentid}
                            </Text>
                          </Text>
                          <Text>
                            Homeroom:{' '}
                            <Text style={{ fontWeight: "bold" }}>
                              {item.homeroom}
                            </Text>
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(i) => i.studentid.toString()}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <NoStudentsFoundMessage message='No Students Available.' />
              </View>
            )}
             <Snackbar
              duration={1500}
              visible={snackBarIsVisible}
              onDismiss={() => setSnackBarIsVisible(false)}
            >
              {snackBarMessage}
            </Snackbar>
          </View>
          <View>
           
          </View>
        </View>

        <View style={commonStyles.static_white_background}></View>
      </View>
    </SafeAreaView>
  );
};

export default studentListForCourseSectionScreen;
