import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  SectionList,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import StaffScheduleService from '../../services/staffScheduleService';
import { isLoadingChanged } from '../../redux/app-redux';
import RetrieveStudentsService from '../../services/retrieveStudentsService';
import StaffScheduleListItem from '../../components/staffScheduleListItem';
import NoStudentsFoundMessage from '../../components/noStudentsFoundMessage';
import StaffScheduleHomeroomListItem from '../../components/staffScheduleHomeroomListItem';
import Loader from '../../components/Loader';
import { invertColor } from '../../functions/functions';
import realtimeStyles from '../../constants/realtimeStyles';
import commonStyles from '../../styles/commonStyles';

const scheduleScreen = ({ navigation }) => {
  const { districtData } = useSelector((state) => state);
  const { userData } = useSelector((state) => state);
  const [markingPeriodDisplay, setMarkingPeriodDisplay] = useState();
  const [locationDescription, setLocationDescription] = useState();
  const [scheduleData, setScheduleData] = useState([]);
  const [scheduleData1, setScheduleData1] = useState([]);
  const { height: wHeight } = Dimensions.get('window');
  const dispatch = useDispatch();
  useEffect(() => {
    pullStaffScheduleData();
  }, []);

  // Server request to get Staff Schedule data for the FlatList
  const pullStaffScheduleData = async () => {
    try {
      dispatch(isLoadingChanged(true));
      const staffScheduleService = new StaffScheduleService();
      const response =
        await staffScheduleService.performRetrieveStaffScheduleRequest(
          userData.sessionToken
        );

      if (!response.JWTIsValid) {
        dispatch(isLoadingChanged(false));
        return;
      }
      if (response.status === 'success') {
        setMarkingPeriodDisplay(response.markingPeriodDisplay);
        setLocationDescription(
          response.scheduleData[0]?.data[0]?.locationDescription
        );
        setScheduleData(response.scheduleData[0]?.data);
        setScheduleData1(response.scheduleData);
      } else {
        Alert.alert('Problem retrieving staff schedule data.');
      }
      dispatch(isLoadingChanged(false));
    } catch (responseError) {
      dispatch(isLoadingChanged(false));
      Alert.alert('Unable to retrieve staff schedule data.', responseError);
    }
  };

  // Retrieve all the students for the selected course or homeroom,
  // If successful, navigate to the Student List Screen
  const navigateToStudentListForCourseSectionScreen = async (
    courseSectionObj
  ) => {
    try {
      dispatch(isLoadingChanged(true));
      const retrieveStudentsService = new RetrieveStudentsService();
      let response = {};

      if (courseSectionObj.isHomeroom) {
        // GET STUDENTS FOR HOMEROOM
        const roomID = courseSectionObj.roomID;
        const locationID = courseSectionObj.locationID;

        response =
          await retrieveStudentsService.performStudentsForHomeroomRequest(
            userData.sessionToken,
            roomID,
            locationID
          );
      } else {
        // GET STUDENTS FOR COURSE SECTION
        const meetingTimeID = courseSectionObj.meetingTimeID;

        response =
          await retrieveStudentsService.performStudentsForCourseSectionRequest(
            userData.sessionToken,
            meetingTimeID
          );
      }

      
      if (!response.JWTIsValid) {
        dispatch(isLoadingChanged(false));
        return;
      }

      if (response.status === 'success') {
        // Success = navigate to student List screen        
        navigation.navigate('StudentListForCourseSectionScreen', {
          studentsArray: response.students,
          labelText: 'Students Found:',
          valueText: response.students.length,
          courseSectionObj,
        });
      } else {
        Alert.alert('Problem retrieving student data.');
      }
      dispatch(isLoadingChanged(false));
    } catch (responseError) {
      idispatch(isLoadingChanged(false));
      Alert.alert('Unable to retrieve student data.', responseError);
    }
  };

  const renderLoaderTemp = () => {
    return (
      <View>
        <Loader column={1} />
        <Loader column={1} />
        <Loader column={1} />
      </View>
    );
  };

  const renderStaffSchedule = () => {
    // if ( !checkLocalUserPermission('Display Schedule') ) {
    //   return (<RealtimeGenericErrorMessage message='Display Schedule Permission is required.'/>) ;
    // }
    return (
      <SectionList
        sections={scheduleData1}
        style={realtimeStyles.w100}
        renderItem={({ item }) => {
          if (item.isHomeroom) {
            return (
              <StaffScheduleHomeroomListItem
                onPress={() =>
                  navigateToStudentListForCourseSectionScreen(item)
                }
                courseTitle={item.courseTitle}
                room={item.roomID}
              />
            );
          }
          var markinper = `''${item.markingPeriods}`;
          if (markinper.indexOf(markingPeriodDisplay) != -1) {
            return (
              <StaffScheduleListItem
                onPress={() =>
                  navigateToStudentListForCourseSectionScreen(item)
                }
                currentDay={item.currentDayCode}
                courseTitle={item.courseTitle}
                courseSection={item.courseSection}
                room={item.roomID}
                markingPeriods={item.markingPeriods}
                altMondayCode={item.altMondayCode}
                mDisplay={item.mDisplay}
                altTuesdayCode={item.altTuesdayCode}
                tDisplay={item.tDisplay}
                altWednesdayCode={item.altWednesdayCode}
                wDisplay={item.wDisplay}
                altThursdayCode={item.altThursdayCode}
                rDisplay={item.rDisplay}
                altFridayCode={item.altFridayCode}
                fDisplay={item.fDisplay}
                altSaturdayCode={item.altSaturdayCode}
                sDisplay={item.sDisplay}
                altSundayCode={item.altSundayCode}
                zDisplay={item.zDisplay}
              />
            );
          } else {
            return null;
          }
        }}
        keyExtractor={(item) => item.meetingTimeID}
      />
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
            height: Platform.OS === "ios" ? wHeight - 150 : wHeight - 100,
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
                name="arrow-back-ios"
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
              My Schedule
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
              padding: 5,
              marginBottom: 20,
              flexDirection: "column",
            }}
          >
            {scheduleData && scheduleData?.length ? (
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "bold",
                      opacity: 0.4,
                    }}
                  >
                    Marking Period {markingPeriodDisplay}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 14,
                    }}
                  >
                    {locationDescription}
                  </Text>
                </View>
              </View>
            ) : scheduleData ? (
              <Loader column={1} />
            ) : null}
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
            {scheduleData?.length > 0 ? (
              renderStaffSchedule()
            ) : scheduleData ? (
              renderLoaderTemp()
            ) : (
              <>
                <NoStudentsFoundMessage message='No schedules found for the user' />
              </>
            )}
          </View>
        </View>

        <View style={commonStyles.static_white_background}></View>
      </View>
    </SafeAreaView>
  );
};

export default scheduleScreen;