import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { isLoadingChanged } from '../../redux/app-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import AttendanceService from '../../services/attendanceService';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import DailyAttendanceListItem from '../../components/dailyAttendanceListItem';
import { invertColor } from '../../functions/functions';
import commonStyles from '../../styles/commonStyles';

const studentMassDailyAttendanceEntryScreen = ({ navigation, route }) => {
  const { districtData } = useSelector((state) => state);
  const { userData } = useSelector((state) => state);
  const { height: wHeight } = Dimensions.get('window');
  const { courseSectionObj, studentsArray, dailyAttendanceCodes } =
    route.params;
  const [studentsStateArray, setStudentsStateArray] = useState([]);
  const [totalPresent, setTotalPresent] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    let newStudentArray = [...studentsArray];
    newStudentArray.forEach((student, index) => {
      dailyAttendanceCodes.forEach((attendanceCodeObject) => {
        if (
          newStudentArray[index].currentDailyAttendance.transactionCode ==
          attendanceCodeObject.value
        ) {
          let newAttedCode = {
            label: attendanceCodeObject.label,
            value: attendanceCodeObject.value,
          };
          newStudentArray[index].currentDailyAttendance.transactionCode =
            newAttedCode;
          //for sending 24 hour format time to server
          newStudentArray[index].currentDailyAttendance.tardyTime24 =
            newStudentArray[index].currentDailyAttendance.tardyTime;
        }
      });
    });

    setStudentsStateArray(newStudentArray);
    //CALCULATE INITIAL ABSENCE TOTALS
    let totalPres = studentsArray.length;
    let totalAbs = 0;
    studentsArray.forEach((student, index) => {
      totalPres -= studentsArray[index].currentDailyAttendance.absenceCount;
      totalAbs += studentsArray[index].currentDailyAttendance.absenceCount;
    });
    setTotalPresent(totalPres);
    setTotalAbsent(totalAbs);
  }, []);

  // Callback function - attendance code dropdown change event
  const onChangeAttendanceCode = (studentID, attendanceCode) => {
    const nextState = [...studentsStateArray];
    let nextTotalPresent = nextState.length;
    let nextTotalAbsent = 0;

    nextState.forEach((student, index) => {
      if (student.studentid === studentID) {
        // SET NEWLY SELECTED TRANSACTION CODE
        if (attendanceCode.value == '') {
          nextState[index].currentDailyAttendance.transactionCode =
            dailyAttendanceCodes[0];
        } else {
          nextState[index].currentDailyAttendance.transactionCode =
            attendanceCode;
        }

        // SET ALREADY SELECTED TIME TO NULL
        nextState[index].currentDailyAttendance.tardyTime24 = '';

        dailyAttendanceCodes.forEach((attendanceCodeObject) => {
          if (attendanceCodeObject.value === attendanceCode.value) {
            if (attendanceCodeObject.transactionColor != '') {
              // SET COLOR FOR NEWLY SELECTED TRANSACTION CODE
              nextState[index].currentDailyAttendance.transactionColor =
                attendanceCodeObject.transactionColor;
            } else {
              nextState[index].currentDailyAttendance.transactionColor =
                '#FFFFFF';
            }
            nextState[index].currentDailyAttendance.absenceCount =
              attendanceCodeObject.absenceCount;
          }
        });
      }
      // CALCULATE ABSENCE COUNT FOR TOTALS
      nextTotalPresent -= nextState[index].currentDailyAttendance.absenceCount;
      nextTotalAbsent += nextState[index].currentDailyAttendance.absenceCount;
    });
    setTotalPresent(nextTotalPresent);
    setTotalAbsent(nextTotalAbsent);
    setStudentsStateArray(nextState);
  };

  const handleTimeChange = (studentID, time) => {
    const nextState = [...studentsStateArray];
    nextState.forEach((student, index) => {
      if (student.studentid === studentID) {
        nextState[index].currentDailyAttendance.tardyTime =
          moment(time).format('hh:mm A');
        nextState[index].currentDailyAttendance.tardyTime24 = time;
      }
    });
    setStudentsStateArray(nextState);
  };

  // Callback function - comment textbox change event
  const onChangeComment = (studentID, comment) => {
    const nextState = [...studentsStateArray];
    nextState.forEach((student, index) => {
      if (student.studentid === studentID) {
        nextState[index].currentDailyAttendance.comment = comment;
      }
    });
    setStudentsStateArray(nextState);
  };

  // Submit attendance
  const submitButton = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          marginTop: 10,
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
    );
  };

  const onAttendanceSubmit = async () => {
    const attendanceService = new AttendanceService();
    const studentsDailyAttendanceArray = {};
    studentsStateArray.forEach((student) => {
      let time = '';
      if (student.currentDailyAttendance.tardyTime24 != '') {
        if (
          student.currentDailyAttendance.tardyTime24 ==
          student.currentDailyAttendance.tardyTime
        ) {
          time = student.currentDailyAttendance.tardyTime;
        } else {
          time = moment(student.currentDailyAttendance.tardyTime24).format(
            'HH:mm'
          );
        }
      }

      const localStudentDA = {
        attendanceCode: student.currentDailyAttendance.transactionCode.value,
        tardyTime: time,
        comment: student.currentDailyAttendance.comment,
      };
      studentsDailyAttendanceArray[student.studentid] = localStudentDA;
    });

    try {
      dispatch(isLoadingChanged(true));

      const response =
        await attendanceService.performSubmitMassDailyAttendanceTransaction(
          userData.sessionToken,
          courseSectionObj.roomID,
          courseSectionObj.locationID,
          studentsDailyAttendanceArray
        );

      if (!response.JWTIsValid || !response.hasPermission) {
        dispatch(isLoadingChanged(false));
        return;
      }
      if (response.status === 'success') {
        dispatch(isLoadingChanged(false));
        navigation.navigate({
          name: 'StudentListForCourseSectionScreen',
          params: { message: response.message },
          merge: true,
        });
      } else {        
        Alert.alert(
          'Problem submitting daily attendance records.',
          response.message,
          [
            {
              onPress: () => {
                dispatch(isLoadingChanged(false));
              },
            },
          ]
        );
      }
      
    } catch (responseError) {
      dispatch(isLoadingChanged(false));
      Alert.alert('Unable to submit daily attendance records.', responseError);
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
      <View style={{ flexGrow: 1 }}>
        <View
          style={{
            height: wHeight - 94,
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
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              width: '86%',
              alignSelf: "center",
              borderRadius: 10,
              padding: 10,
              marginBottom: 10,
              flexDirection: "column",
            }}
          >
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1.2,

                  justifyContent: "center",
                  alignItems: "center",
                  borderBottomColor: '#D3D3D3',
                  borderBottomWidth: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "bold",
                  }}
                >
                  {courseSectionObj.courseTitle}
                </Text>
                <Text style={{ fontSize: 13 }}>{courseSectionObj.roomID}</Text>
              </View>
              <View
                style={{
                  flex: 0.8,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignContent: "center",
                  alignItems: "center",
                  marginLeft: 5,
                  marginRight: 5,
                }}
              >
                <Text style={{ color: '#002952', fontSize: 13 }}>
                  Present:{' '}
                  <Text style={{ color: '#002952', fontSize: 13 }}>
                    {totalPresent}
                  </Text>
                </Text>
                <Text style={{ fontSize: 13 }}>
                  Absent:{' '}
                  <Text style={{ color: '#002952', fontSize: 13 }}>
                    {totalAbsent}
                  </Text>
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 4,
              backgroundColor: 'white',
              width: '86%',
              alignSelf: "center",
              borderRadius: 10,
              padding: 15,
              marginBottom: Platform.OS === "ios" ? 0 : 20,
            }}
          >
            <FlatList
              data={studentsStateArray}
              renderItem={({ item }) => (
                <DailyAttendanceListItem
                  attendanceCodes={dailyAttendanceCodes}
                  selectedAttendanceCode={
                    item.currentDailyAttendance.transactionCode
                  }
                  onChangeAttendanceCode={(attendanceCode) =>
                    onChangeAttendanceCode(item.studentid, attendanceCode)
                  }
                  onDateChange={(timeSelected) =>
                    handleTimeChange(item.studentid, timeSelected)
                  }
                  transactionTime={item.currentDailyAttendance.tardyTime}
                  onChangeTime={(timeText) =>
                    onChangeTime(item.studentid, timeText)
                  }
                  comment={item.currentDailyAttendance.comment}
                  onChangeComment={(comment) =>
                    onChangeComment(item.studentid, comment)
                  }
                  studentName={`${item.firstname} ${item.lastname}`}
                  studentID={item.studentid.toString()}
                  grade={item.grade}
                  homeroom={item.homeroom}
                  dayType={item.dayType}
                  transactionColor={
                    item.currentDailyAttendance.transactionColor
                  }
                />
              )}
              keyExtractor={(i) => i.studentid.toString()}
              ListFooterComponent={submitButton}
            />
          </View>
        </View>

        <View style={commonStyles.static_white_background}></View>
      </View>
    </SafeAreaView>
  );
};

export default studentMassDailyAttendanceEntryScreen;
