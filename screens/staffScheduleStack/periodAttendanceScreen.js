import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import { MaterialIcons } from '@expo/vector-icons';
import AttendanceService from '../../services/attendanceService';
import { isLoadingChanged } from '../../redux/app-redux';
import PeriodAttendanceListItem from '../../components/periodAttendanceListItem';
import { invertColor } from '../../functions/functions';
import commonStyles from '../../styles/commonStyles';

const periodAttendanceScreen = ({ navigation, route }) => {
  const { districtData } = useSelector((state) => state);
  const { userData } = useSelector((state) => state);
  const [totalPresent, setTotalPresent] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [studentsStateArray, setStudentsStateArray] = useState([]);
  const { height: wHeight } = Dimensions.get('window');
  const { courseSectionObj, studentsArray, periodAttendanceCodes } =
    route.params;
  const [displ, setDisp] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    // Setting the studentArray with the already selected attendance code by mutating the student array
    // This is done because in the Picker of react-native-wood-picker it accepts as object and not as single value
    let newStudentArray = [...studentsArray];
    newStudentArray.forEach((student, index) => {
      periodAttendanceCodes.forEach((attendanceCodeObject) => {
        if (
          newStudentArray[index].currentPeriodAttendance.transactionCode ==
          attendanceCodeObject.value
        ) {
          let newAttedCode = {
            label: attendanceCodeObject.label,
            value: attendanceCodeObject.value,
          };
          newStudentArray[index].currentPeriodAttendance.transactionCode =
            newAttedCode;
          //for sending 24 hour format time to server
          newStudentArray[index].currentPeriodAttendance.tardyTime24 =
            newStudentArray[index].currentPeriodAttendance.tardyTime;
        }
      });
    });
    setStudentsStateArray(newStudentArray);

    //CALCULATE INITIAL ABSENCE TOTALS
    let totalPres = studentsArray.length;
    let totalAbs = 0;
    studentsArray.forEach((student, index) => {
      totalPres -= studentsArray[index].currentPeriodAttendance.absenceCount;
      totalAbs += studentsArray[index].currentPeriodAttendance.absenceCount;
    });
    setTotalPresent(totalPres);
    setTotalAbsent(totalAbs);
  }, []);

  // Callback function - Comment textfield change event
  const onChangeComment = (studentID, comment) => {
    const nextState = [...studentsStateArray];
    nextState.forEach((student, index) => {
      if (student.studentid === studentID) {
        nextState[index].currentPeriodAttendance.comment = comment;
      }
    });
    setStudentsStateArray(nextState);
  };

  // Callback function - Time picker change event
  const handleTimeChange = (studentID, time) => {
    const nextState = [...studentsStateArray];
    nextState.forEach((student, index) => {
      if (student.studentid === studentID) {
        nextState[index].currentPeriodAttendance.tardyTime =
          moment(time).format('hh:mm A');
        nextState[index].currentPeriodAttendance.tardyTime24 = time;
      }
    });
    setStudentsStateArray(nextState);
  };

  // Callback function - Time picker display time text
  const handleTimeText = () => (displ ? displ : 'Select Time');

  // Rendering the submit button
  const submitButton = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
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

  // Every time an attendance code is changed, we set new state for TRANSACTION CODE, COLOR, and TOTALS
  const onChangeAttendanceCode = (studentID, attendanceCode) => {
    const nextState = [...studentsStateArray];
    let nextTotalPresent = nextState.length;
    let nextTotalAbsent = 0;

    nextState.forEach((student, index) => {
      if (student.studentid === studentID) {
        // SET NEWLY SELECTED TRANSACTION CODE
        if (attendanceCode.value == '') {
          nextState[index].currentPeriodAttendance.transactionCode =
            periodAttendanceCodes[0];
        } else {
          nextState[index].currentPeriodAttendance.transactionCode =
            attendanceCode;
        }

        nextState[index].currentPeriodAttendance.tardyTime24 = '';

        nextState[index].currentPeriodAttendance.tardyTime = '';
        periodAttendanceCodes.forEach((attendanceCodeObject) => {
          if (attendanceCodeObject.value === attendanceCode.value) {
            if (attendanceCodeObject.transactionColor != '') {
              // SET COLOR FOR NEWLY SELECTED TRANSACTION CODE
              nextState[index].currentPeriodAttendance.transactionColor =
                attendanceCodeObject.transactionColor;
            } else {
              nextState[index].currentPeriodAttendance.transactionColor =
                '#FFFFFF';
            }
            nextState[index].currentPeriodAttendance.absenceCount =
              attendanceCodeObject.absenceCount;
          }
        });
      }
      // CALCULATE ABSENCE COUNT FOR TOTALS
      nextTotalPresent -= nextState[index].currentPeriodAttendance.absenceCount;
      nextTotalAbsent += nextState[index].currentPeriodAttendance.absenceCount;
    });

    setTotalPresent(nextTotalPresent);
    setTotalAbsent(nextTotalAbsent);
    setStudentsStateArray(nextState);
  };

  // Submitting the attendance
  const onAttendanceSubmit = async () => {
    const attendanceService = new AttendanceService();
    const studentsPeriodAttendanceArray = {};

    studentsStateArray.forEach((student) => {
      let time = '';
      if (student.currentPeriodAttendance.tardyTime24 != '') {
        if (
          student.currentPeriodAttendance.tardyTime24 ==
          student.currentPeriodAttendance.tardyTime
        ) {
          time = student.currentPeriodAttendance.tardyTime;
        } else {
          time = moment(student.currentPeriodAttendance.tardyTime24).format(
            'HH:mm'
          );
        }
      }

      const localStudentPA = {
        attendanceCode: student.currentPeriodAttendance.transactionCode.value,
        tardyTime: time,
        comment: student.currentPeriodAttendance.comment,
      };
      studentsPeriodAttendanceArray[student.studentid] = localStudentPA;
    });

    try {
      dispatch(isLoadingChanged(true));
      const response =
        await attendanceService.performSubmitMassPeriodAttendanceTransactions(
          userData.sessionToken,
          courseSectionObj.meetingTimeID,
          courseSectionObj.locationID,
          studentsPeriodAttendanceArray
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
          'Problem submitting period attendance records.',
          response.message,[
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
      Alert.alert('Unable to submit period attendance records.', responseError);
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
              Period Attendance Entry
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
              padding: 10,
              marginBottom: 20,
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
                <Text style={{ fontSize: 13 }}>
                  {courseSectionObj.courseSection}
                </Text>
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
              flex: 5,
              backgroundColor: 'white',
              width: '86%',
              alignSelf: "center",
              borderRadius: 10,
              padding: 15,
              marginBottom: Platform.OS === "ios" ? 0 : 20,
            }}
          >
            <FlatList
              ListFooterComponent={submitButton}
              data={studentsStateArray}
              renderItem={({ item }) => (
                <PeriodAttendanceListItem
                  attendanceCodes={periodAttendanceCodes}
                  selectedAttendanceCode={
                    item.currentPeriodAttendance.transactionCode
                  }
                  onChangeAttendanceCode={(attendanceCode) =>
                    onChangeAttendanceCode(item.studentid, attendanceCode)
                  }
                  transactionTime={item.currentPeriodAttendance.tardyTime}
                  onDateChange={(timeSelected) =>
                    handleTimeChange(item.studentid, timeSelected)
                  }
                  handleTimeText={handleTimeText()}
                  comment={item.currentPeriodAttendance.comment}
                  onChangeComment={(comment) =>
                    onChangeComment(item.studentid, comment)
                  }
                  studentName={`${item.firstname} ${item.lastname}`}
                  studentID={item.studentid.toString()}
                  grade={item.grade}
                  homeroom={item.homeroom}
                  dayType={item.dayType}
                  transactionColor={
                    item.currentPeriodAttendance.transactionColor
                  }
                  canEdit={item.canEdit}
                />
              )}
              keyExtractor={(item) => item.studentid.toString()}
            />
          </View>
        </View>
        <View style={commonStyles.static_white_background}></View>
      </View>
    </SafeAreaView>
  );
};

export default periodAttendanceScreen;
