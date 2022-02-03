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
import { isLoadingChanged} from '../../redux/app-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ListItem } from 'react-native-elements';
import { Picker } from 'react-native-woodpicker';
import { StatusBar } from 'expo-status-bar';
import { Snackbar } from 'react-native-paper';
import { MaterialIcons, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import ContactDisplayElement from '../../components/contactDisplayElement';
import EventScheduleService from '../../services/eventScheduleService';
import RetrieveStudentContactsService from '../../services/retrieveStudentContactsService';
import EventAttendanceStudentStatisticsService from '../../services/eventAttendanceStudentStatisticsService';
import { invertColor } from '../../functions/functions';
import { realtimeBlue } from '../../constants/realtimeStyleConstants';
import commonStyles from '../../styles/commonStyles';
import realtimeStyles from '../../constants/realtimeStyles';

const { height: wHeight } = Dimensions.get('window');

const eventAttendanceDetailScreen = ({ navigation, route }) => {
  const { districtData, isTab, userData } = useSelector((state) => state);
  const { eventDateTime } = route.params;
  const [screenRequiresRefresh, setScreenRequiresRefresh] = useState(false);
  const [statisticsTotalFinal, setStatisticsTotalFinal] = useState();
  const [statisticsTotalStudents, setStatisticsTotalStudents] = useState();
  const [statistics, setStatistics] = useState();
  const [studentKeyedData, setStudentKeyedData] = useState([]);
  const [studentID, setStudentID] = useState();
  const [selectedLocation, setSelectedLocation] = useState();
  const [checkPointTypes, setCheckPointTypes] = useState([]);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [quickCheckPointCheckpointTypeID, setQuickCheckPointCheckpointTypeID] =
    useState();
  const [quickCheckPointNotes, setQuickCheckPointNotes] = useState();
  const [quickCheckPointContactID, setQuickCheckPointContactID] = useState();
  const [quickCheckPointStudentFirstName, setQuickCheckPointStudentFirstName] =
    useState();
  const [quickCheckPointStudentLastName, setQuickCheckPointStudentLastName] =
    useState();
  const [showContactList, setShowContactList] = useState(false);
  const [eventID, setEventID] = useState();
  const [contacts, setContacts] = useState([]);
  const isFocused = useIsFocused();
  const [eventDetail, setEventDetail] = useState(route.params.eventDetail);
  const [snackBarIsVisible, setSnackBarIsVisible] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState(null);
  const dispatch = useDispatch();
  const [eventStatsService] = useState(
    new EventAttendanceStudentStatisticsService()
  );

  useEffect(() => {
    if (route.params?.studentID) {
      updateQuickCheckpointStudent(
        route.params.studentID,
        route.params.firstName,
        route.params.lastName
      );
    }
  }, [route.params?.studentID, isFocused]);

  useEffect(() => {
    refreshEventDataStatistics(eventDetail);
    //setCheckPointTypes(eventDetail['studentCheckPointTypeArray']);
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
    setSelectedLocation(studentCheckPointTypeArray[0]);
    setEventID(eventDetail.eventDefinition.eventID);
  }, []);

  // Pull the lates eventDetails after submitting the Checkin
  useEffect(() => {
    if (screenRequiresRefresh) {
      pullEventDetailData(eventDetail.eventDefinition.eventID);
    }
  }, [screenRequiresRefresh]);

  // PUll the event details by eventID
  const pullEventDetailData = async (eventID) => {
    try {
      dispatch(isLoadingChanged(true));
      const eventScheduleService = new EventScheduleService();
      const response =
        await eventScheduleService.performRetrieveEventDetailRequest(
          userData.sessionToken,
          eventID
        );
      if (!response.JWTIsValid) {
        return;
      }
      if (response.status === 'success') {
        refreshEventDataStatistics(response['eventDetail']);
        setScreenRequiresRefresh(false);
      } else {
        Alert.alert('Problem retrieving event detail data.');
      }
      dispatch(isLoadingChanged(false));
    } catch (responseError) {
      dispatch(isLoadingChanged(false));
      Alert.alert('Unable to retrieve event data.', responseError);
    }
  };

  // Refresh the eventDetails
  const refreshEventDataStatistics = (newEventDetail) => {
    //const eventStatsService = new EventAttendanceStudentStatisticsService();
    var newState = {
      studentKeyedData:
        eventStatsService.fromEventDetail(newEventDetail).studentData,
      statistics: eventStatsService.statistics,
      eventDetail: newEventDetail,
      statisticsTotalStudents: eventStatsService.statistics.totalStudents,
      statisticsTotalFinal: eventStatsService.statistics.withFinalRelease,
    };
    setEventDetail(newState.eventDetail);
    setStatisticsTotalFinal(newState.statisticsTotalFinal);
    setStatisticsTotalStudents(newState.statisticsTotalStudents);
    setStatistics(newState.statistics);
    setStudentKeyedData(newState.studentKeyedData);
  };

  // Check the student id valid or not
  const isValidStudentID = (studentID) => {
    var studentIDNumeric = parseInt(studentID);
    if (studentID == '') {
      return false;
    }
    if (isNaN(studentIDNumeric)) {
      return false;
    }
    return true;
  };

  const clearQuickCheckPointState = (
    call_from_saveButton_or_studentID_change
  ) => {
    setShowContactList(false);
    setStudentID('');
    if (call_from_saveButton_or_studentID_change == 'save_button') {
      setSelectedLocation(checkPointTypes[0]);
      setQuickCheckPointCheckpointTypeID('');
    }

    setQuickCheckPointContactID('');
    setQuickCheckPointNotes('');
    setQuickCheckPointStudentFirstName('');
    setQuickCheckPointStudentLastName('');
  };

  // Student Checking function
  const onStudentCheckin = async () => {
    // verify that we have a student (and some sort of checkpoint??)
    if (!isValidStudentID(studentID)) {
      Alert.alert('Required', 'Invalid Student ID - (N)');
      return;
    }

    if (
      quickCheckPointCheckpointTypeID == undefined ||
      quickCheckPointCheckpointTypeID == ''
    ) {
      Alert.alert('Required', 'Invalid Checkpoint');
      return;
    }

    var essCheck = eventStatsService.canStudentHaveACheckpointAdded(studentID);
    if (essCheck['result'] == false) {
      Alert.alert(essCheck['userMessage']);
      return;
    }

    dispatch(isLoadingChanged(true));
    // 	public struct function addStudentsCheckPointJSON(required string eventID, string authString='realtime', required string studentIDArrayList, required string eventTypeCheckPointTypeID='', string checkpointTime=this.dateTimeFormatRealtime(now()), string checkpointSlug='', string checkpointNotes='', string JSONOptions='', struct options={} ) {
    var dataToPost = {
      studentID: studentID,
      eventID: eventID,
      eventTypeCheckPointTypeID: quickCheckPointCheckpointTypeID,
      checkpointNotes: quickCheckPointNotes,
      contactID: quickCheckPointContactID,
    };

    const eventScheduleService = new EventScheduleService();
    const response =
      await eventScheduleService.performSubmitEventCheckpointForStudentRequest(
        userData.sessionToken,
        dataToPost
      );

    if (response.status == 'success') {
      setSnackBarIsVisible(true);
      setSnackBarMessage('Saved Student Checkpoint');
      setScreenRequiresRefresh(true);
      clearQuickCheckPointState('save_button');
    } else {
      Alert.alert(response.error);
    }
    dispatch(isLoadingChanged(false));
  };

  // Update the state by checking the student ID
  const updateQuickCheckpointStudent = (studentID, firstName, lastName) => {
    if (studentID == '') {
      return null;
    }  
    var student = studentKeyedData[studentID];
    if (typeof student == 'undefined') {
      setStudentID(studentID.toString());
      setQuickCheckPointStudentFirstName(firstName);
      setQuickCheckPointStudentLastName(lastName);
    } else {
      setStudentID(studentID.toString());
      setQuickCheckPointStudentFirstName(student.firstName);
      setQuickCheckPointStudentLastName(student.lastName);
    }
  };

  // Callback function - student ID textbox text change event
  const onStudentIDChange = (text) => {
    clearQuickCheckPointState('studentID_change');
    updateQuickCheckpointStudent(text);
  };

  // render the StudentName
  const renderStudentNameSection = () => {
    var textStyle = [];
    var nameString = '';
    if (typeof quickCheckPointStudentLastName == 'undefined') {
      return null;
    }
    if (
      quickCheckPointStudentLastName != '' &&
      quickCheckPointStudentFirstName != ''
    ) {
      nameString =
        `${quickCheckPointStudentLastName}, ${quickCheckPointStudentFirstName}`;
    }
    return <Text style={textStyle}>{nameString}</Text>;
  };

  // Callback function - checkpoint change event
  const onCheckpointChange = (text) => {
    if (text.value == '') {
      setSelectedLocation(checkPointTypes[0]);
      setQuickCheckPointCheckpointTypeID('');
      return;
    }
    var checkpoint = checkPointTypes.find(
      (checkpoint) => checkpoint.eventTypeCheckPointTypeID == text.value
    );
    setQuickCheckPointCheckpointTypeID(text.value);
    setShowContactList(false);
    if (checkpoint.showContactList == 1) {
      setShowContactList(true);
    } else {
      setShowContactList(false);
    }
    setSelectedLocation(text);
  };

  const onContactSelected = (contactID) => {
    setQuickCheckPointContactID(contactID.value);
  };

  // render contacts list of the student
  const loadContactsForStudent = async (studentID) => {
    if (!isValidStudentID(studentID)) {
      return;
    }

    var contacts = [];
    const retrieveStudentContactsService = new RetrieveStudentContactsService();
    const response =
      await retrieveStudentContactsService.performStudentContactsRequest(
        userData.sessionToken,
        studentID
      );

    if (!response.JWTIsValid) {
      return;
    }
    if (response.status === 'success') {
      response.contacts.forEach((element) => {
        var contactTemp = [];
        contactTemp['value'] = element.addressid;
        contactTemp['label'] = element.contactname;
        if (element.pickup == 1) {
          contacts.push(contactTemp);
        }
      });
    }
    contacts.push({ contactID: '', label: 'Other', value: '-1' });
    setContacts(contacts);
  };

  const renderContactList = () => {
    if (showContactList == false) {
      return null;
    } else {
      return (
        <ContactDisplayElement
          studentID={studentID}
          onContactSelected={onContactSelected}
          loadContactFunction={loadContactsForStudent}
          contacts={contacts}
        />
      );
    }
  };

  const onFindStudentsClick = () => {
    navigation.navigate('StudentPickerSearchScreen', {
      navigationOrigin: 'EventAttendanceDetailScreen',
    });
  };

  const onBarCodeScanPressed = () => {
    //navigation.navigate('StudentBarCodeScanner');
    navigation.navigate('EventBarCodeScannerScreen',{
      navOrigin: 'EventAttendanceDetailScreen'
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
                Event Details
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
                marginTop: 10,
                marginBottom: 20,
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
                  {eventDateTime}
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
                flex: 3,
                backgroundColor: 'white',
                width: '86%',
                alignSelf: "center",
                borderRadius: 10,
                marginBottom: 20,
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 10,
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                Quick Check-in : {renderStudentNameSection()}
              </Text>

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
                    value={studentID}
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

              <View style={{ flex: 1, justifyContent: "center" }}>
                <Picker
                  style={{
                    borderBottomColor: '#D3D3D3',
                    borderBottomWidth: 1,
                    height: 30,
                  }}
                  item={selectedLocation}
                  items={checkPointTypes}
                  textInputStyle={{ fontSize: 13 }}
                  onItemChange={onCheckpointChange}
                  // placeholder='Checkpoint Type'
                  isNullable
                />
               
                  <MaterialIcons
                    name='keyboard-arrow-down'
                    style={commonStyles.icon}
                  />
                
              </View>
              {renderContactList()}

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

              <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    disabled={disableSubmit}
                    activeOpacity={0.6}
                    style={[commonStyles.btn40]}
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

                <View style={{ flex: 1, marginLeft: 5 }}>
                  <TouchableOpacity
                    disabled={disableSubmit}
                    activeOpacity={0.6}
                    style={[commonStyles.btn40]}
                    onPress={() => onFindStudentsClick()}
                  >
                    <Text
                      style={{
                        color: 'white',
                      }}
                    >
                      Find Students
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View
              style={{
                flex: 2,
                backgroundColor: 'white',
                width: '86%',
                alignSelf: "center",
                borderRadius: 10,
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 10,
                marginBottom: Platform.OS === "ios" ? 0 : 20,
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 15,
                }}
              >
                Actions
              </Text>

              <ListItem
                containerStyle={realtimeStyles.studentProfileListStyle}
                onPress={() =>
                  navigation.navigate('EventAttendanceDetailEmployeeScreen', {
                    eventDetail: eventDetail,
                  })
                }
              >
                <ListItem.Content style={{ flexDirection: "row", flex: 1 }}>
                  <View style={{ flex: isTab ? 1 : 2 }}>
                    <AntDesign name='user' size={16} color={realtimeBlue} />
                  </View>
                  <View style={{ flex: 9 }}>
                    <Text style={{ fontSize: 15, color: realtimeBlue }}>
                      View Staff
                    </Text>
                  </View>
                </ListItem.Content>
              </ListItem>

              <ListItem
                containerStyle={realtimeStyles.studentProfileListStyle}
                onPress={() =>
                  navigation.navigate("EventAttendanceDetailStudentScreen", {
                    eventDetail: eventDetail,
                  })
                }
              >
                <ListItem.Content style={{ flexDirection: 'row', flex: 1 }}>
                  <View style={{ flex: isTab ? 1 : 2 }}>
                    <FontAwesome5
                      name='user-graduate'
                      size={16}
                      color='black'
                    />
                  </View>
                  <View style={{ flex: 9 }}>
                    <Text style={{ fontSize: 15, color: realtimeBlue }}>
                      View Students
                    </Text>
                  </View>
                </ListItem.Content>
              </ListItem>

              <ListItem
                onPress={() =>
                  navigation.navigate(
                    'EventAttendanceDetailCheckpointScanScreen',
                    {
                      eventDetail: eventDetail,
                    }
                  )
                }
              >
                <ListItem.Content style={{ flexDirection: "row", flex: 1 }}>
                  <View style={{ flex: isTab ? 1 : 2 }}>
                    <AntDesign name='scan1' size={17} color='black' />
                  </View>
                  <View style={{ flex: 9 }}>
                    <Text style={{ fontSize: 15, color: realtimeBlue }}>
                      Checkpoint Scan
                    </Text>
                  </View>
                </ListItem.Content>
              </ListItem>

              <Snackbar
                duration={1500}
                visible={snackBarIsVisible}
                onDismiss={() => setSnackBarIsVisible(false)}
              >
                <Text style={{ alignSelf: "center" }}>{snackBarMessage}</Text>
              </Snackbar>
            </View>
          </View>
        </KeyboardAwareScrollView>

        <View style={commonStyles.static_white_background}></View>
      </View>
    </SafeAreaView>
  );
};

export default eventAttendanceDetailScreen;
