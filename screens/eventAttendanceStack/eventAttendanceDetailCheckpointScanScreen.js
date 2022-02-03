import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Picker } from 'react-native-woodpicker';
import { useIsFocused } from '@react-navigation/native';
import { Snackbar } from 'react-native-paper';
import EventAttendanceStudentStatisticsService from '../../services/eventAttendanceStudentStatisticsService';
import EventScheduleService from '../../services/eventScheduleService';
import { isLoadingChanged } from '../../redux/app-redux';
import { invertColor } from '../../functions/functions';
import commonStyles from '../../styles/commonStyles';

const eventAttendanceDetailCheckpointScanScreen = ({ navigation, route }) => {
  const { height: wHeight } = Dimensions.get('window');
  const { districtData } = useSelector((state) => state);
  const { userData } = useSelector((state) => state);
  const [statisticsTotalFinal, setStatisticsTotalFinal] = useState();
  const [statisticsTotalStudents, setStatisticsTotalStudents] = useState();
  const [studentKeyedData, setStudentKeyedData] = useState();
  const [checkPointTypes, setCheckPointTypes] = useState([]);
  const [quickCheckPointCheckpointTypeID, setQuickCheckPointCheckpointTypeID] =
    useState();
  const [showContactList, setShowContactList] = useState(false);
  const [quickCheckPointStudentID, setQuickCheckPointStudentID] = useState();
  const [quickCheckPointNotes, setQuickCheckPointNotes] = useState();
  const [quickCheckPointContactID, setQuickCheckPointContactID] = useState();
  const [disableSubmit, setDisableSubmit] = useState(false);
  const { eventDetail } = route.params;
  const isFocused = useIsFocused();
  const [eventID, setEventID] = useState();
  const [eventStatsService] = useState(
    new EventAttendanceStudentStatisticsService()
  );
  const [snackBarIsVisible, setSnackBarIsVisible] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    refreshEventDataStatistics(eventDetail);
    setEventID(eventDetail.eventDefinition.eventID);
  }, []);

  useEffect(() => {
    if (route.params?.studentID) {
      setQuickCheckPointStudentID(route.params.studentID);
    }
  }, [route.params?.studentID, isFocused]);

  // Callback function - checkpoint dropdown event change
  const onCheckpointChange = (checkpointID) => {
    if (checkpointID.value == '') {
      setQuickCheckPointCheckpointTypeID(checkPointTypes[0]);
      return;
    }
    var checkpoint = checkPointTypes.find(
      (checkpoint) => checkpoint.eventTypeCheckPointTypeID == checkpointID.value
    );
    setQuickCheckPointCheckpointTypeID(checkpointID);
    setShowContactList(false);
    if (checkpoint.showContactList == 1) {
      setShowContactList(true);
    } else {
      setShowContactList(false);
    }
  };

  // Refresh event attendance details by calling the eventStatsService
  const refreshEventDataStatistics = (newEventDetail) => {
    //const eventStatsService = new EventAttendanceStudentStatisticsService();
    var newState = {
      studentKeyedData:
        eventStatsService.fromEventDetail(newEventDetail).studentData,
      //   statistics: eventStatsService.statistics,
      //   eventDetail: newEventDetail,
      statisticsTotalStudents: eventStatsService.statistics.totalStudents,
      statisticsTotalFinal: eventStatsService.statistics.withFinalRelease,
    };
    setStatisticsTotalFinal(newState.statisticsTotalFinal);
    setStatisticsTotalStudents(newState.statisticsTotalStudents);
    setStudentKeyedData(newState.studentKeyedData);

    let studentCheckPointTypeArray = [
      { label: '-- Checkpoint Type --', value: '' },
    ];
    eventDetail['studentCheckPointTypeArray'].map((item) => {
      let label_value = {
        label: item.label,
        value: item.value,
        eventTypeCheckPointTypeID: item.eventTypeCheckPointTypeID,
      };
      studentCheckPointTypeArray.push(label_value);
    });
    setCheckPointTypes(studentCheckPointTypeArray);
    setQuickCheckPointCheckpointTypeID(studentCheckPointTypeArray[0]);

    //setCheckPointTypes(newEventDetail['studentCheckPointTypeArray']);
  };

  const clearQuickCheckPointState = () => {
    setShowContactList(false);
    setQuickCheckPointStudentID('');
    setQuickCheckPointNotes('');
    setQuickCheckPointContactID('');
    setQuickCheckPointCheckpointTypeID(checkPointTypes[0]);
  };

  const onStudentIDChange = (text) => {
    setQuickCheckPointStudentID(text);
  };

  const renderContactList = () => {
    if (showContactList == false) {
      return null;
    } else {
      return (
        <Text>
          Checkpoint Scans do not allow contact selection. Please use the main
          screen if contact selections is required.
        </Text>
        // <ContactDisplayElement
        //   studentID={quickCheckPointStudentID}
        //   onContactSelected={onContactSelected}
        //   loadContactFunction={loadContactsForStudent}
        //   contacts={contacts}
        // />
      );
    }
  };

  // Navigate to Barcode scan screen
  const onBarCodeScanPressed = () => {
    navigation.navigate('EventBarCodeScannerScreen',{
      navOrigin: 'EventAttendanceDetailCheckpointScanScreen'
    });
  };

  // Check whether the entered student is valid or not
  const isValidStudentID = (studentID) => {
    var studentIDNumeric = parseInt(quickCheckPointStudentID);
    if (studentID == '') {
      return false;
    }
    if (isNaN(studentIDNumeric)) {
      return false;
    }
    return true;
  };

  // Checkin the student
  const onStudentCheckin = async () => {
    // verify that we have a student (and some sort of checkpoint??)
    if (
      quickCheckPointCheckpointTypeID.value == undefined ||
      quickCheckPointCheckpointTypeID.value == ''
    ) {
      Alert.alert('Required', 'Invalid Checkpoint');
      return;
    }

    if (!isValidStudentID(quickCheckPointStudentID)) {
      Alert.alert('Required', 'Invalid Student ID - (N)');
      return;
    }

    dispatch(isLoadingChanged(true));
    //const eventStatsService = new EventAttendanceStudentStatisticsService()
    var essCheck = eventStatsService.canStudentHaveACheckpointAdded(
      quickCheckPointStudentID
    );
    if (essCheck['result'] == false) {
      dispatch(isLoadingChanged(false));
      Alert.alert('Checkpoint Exists', essCheck['userMessage']);
      return;
    }

    var dataToPost = {
      studentID: quickCheckPointStudentID,
      eventID: eventID,
      eventTypeCheckPointTypeID: quickCheckPointCheckpointTypeID.value,
      checkpointNotes: quickCheckPointNotes,
      contactID: quickCheckPointContactID,
    };

    const eventScheduleService = new EventScheduleService();
    const response =
      await eventScheduleService.performSubmitEventCheckpointForStudentRequest(
        userData.sessionToken,
        dataToPost
      );
    dispatch(isLoadingChanged(false));
    var success = true;
    if (success) {
      setSnackBarIsVisible(true);
      setSnackBarMessage('Saved Student Checkpoint');
      clearQuickCheckPointState();
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
          style={{
            height: wHeight - 94,
            flex: 1,
            flexDirection: "column",
            zIndex: 999,
          }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
          }}
          bounces={false}
        >
          <View
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                flexDirection: "row",
                marginBottom: 10,
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
                Checkpoint Scan
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
                marginBottom: 10,
                flexDirection: "column",
              }}
            >
              <View
                style={{
                  flex: 1.4,
                  justifyContent: "space-evenly",
                  flexDirection: "column",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: 16,
                  }}
                >
                  {eventDetail.eventDefinition.eventName}
                </Text>
                <Text style={{ opacity: 0.7, textAlign: "center" }}>
                  {eventDetail.eventDefinition.eventDateTime}
                </Text>
              </View>
              <View
                style={{
                  flex: 0.6,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginLeft: 10,
                  marginRight: 10,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Text>Students : </Text>
                  <Text style={{ opacity: 0.4 }}>
                    {statisticsTotalStudents}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>Released: </Text>
                  <Text style={{ opacity: 0.4 }}>{statisticsTotalFinal}</Text>
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
                marginTop: 5,
                marginBottom: Platform.OS === "ios" ? 0 : 20,
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 10,
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 4 }}>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Picker
                    style={{
                      borderBottomColor: '#D3D3D3',
                      borderBottomWidth: 1,
                      height: 30,
                    }}
                    item={quickCheckPointCheckpointTypeID}
                    items={checkPointTypes}
                    textInputStyle={{ fontSize: 13 }}
                    onItemChange={onCheckpointChange}
                    //placeholder='Checkpoint Type'
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
                    value={quickCheckPointNotes}
                    maxLength={25}
                    onChangeText={(notes) => setQuickCheckPointNotes(notes)}
                    placeholder='Notes'
                    placeholderTextColor={'#999999'}
                  ></TextInput>
                  <MaterialIcons name='notes' style={commonStyles.icon} />
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <View style={{ flex: 4, justifyContent: "center" }}>
                    <TextInput
                      style={{
                        borderBottomColor: '#D3D3D3',
                        borderBottomWidth: 1,
                        height: 30,
                      }}
                      value={quickCheckPointStudentID}
                      maxLength={25}
                      keyboardType='numeric'
                      onChangeText={(id) => onStudentIDChange(id)}
                      placeholder='StudentID'
                      placeholderTextColor={'#999999'}
                    ></TextInput>
                    <AntDesign name='idcard' style={commonStyles.icon} />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "flex-end",
                      marginRight: 5,
                    }}
                  >
                    <TouchableOpacity onPress={() => onBarCodeScanPressed()}>
                      <AntDesign name='scan1' size={40} color='black' />
                    </TouchableOpacity>
                  </View>
                </View>

                {renderContactList()}

                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    disabled={disableSubmit}
                    activeOpacity={0.6}
                    style={[commonStyles.btn]}
                    onPress={() => onStudentCheckin()}
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
              <View style={{ flex: 2 }}></View>
              <View style={{ flex: 1 }}>
                <Snackbar
                  duration={1500}
                  visible={snackBarIsVisible}
                  onDismiss={() => setSnackBarIsVisible(false)}
                >
                  <Text style={{ alignSelf: "center" }}>{snackBarMessage}</Text>
                </Snackbar>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View style={commonStyles.static_white_background}></View>
      </View>
    </SafeAreaView>
  );
};

export default eventAttendanceDetailCheckpointScanScreen;
