import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import NoStudentsFoundMessage from '../../components/noStudentsFoundMessage';
import StudentDetailButtonDisplay from '../../components/studentDetailButtonDisplay';
import EventAttendanceStudentStatisticsService from '../../services/eventAttendanceStudentStatisticsService';
import { invertColor } from '../../functions/functions';
import commonStyles from '../../styles/commonStyles';

const eventAttendanceDetailStudentScreen = ({ navigation, route }) => {
  const { districtData, isTab } = useSelector((state) => state);
  const { eventDetail } = route.params;

  var eventDateTime = moment(eventDetail.eventDefinition.eventDateTimeString);
  const { height: wHeight } = Dimensions.get('window');
  const [statisticsTotalFinal, setStatisticsTotalFinal] = useState();
  const [statisticsTotalStudents, setStatisticsTotalStudents] = useState();
  const [studentKeyedData, setStudentKeyedData] = useState([]);
  const eventStatsService = new EventAttendanceStudentStatisticsService();

  useEffect(() => {
    refreshEventDataStatistics(eventDetail);
  }, []);

  // Refresh the event Details
  const refreshEventDataStatistics = (newEventDetail) => {
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
    // setStatistics(newState.statistics);
    setStudentKeyedData(newState.studentKeyedData);
  };

  // navigate to the screens based on the final checkpoint check
  const handleStudentClick = (studentID) => {
    if (
      eventStatsService.doesStudentHaveFinalCheckpoint(studentID)['result'] ==
      false
    ) {
      navigation.navigate('EventAttendanceDetailScreen', {
        eventDetail: eventDetail,
        studentID: studentID,
      });
    } else {
      selectStudentForCheckpointList(studentID);
    }
  };

  const selectStudentForCheckpointList = (studentID) => {
    navigation.navigate('EventAttendanceDetailStudentCheckpointsScreen', {
      eventDetail: eventDetail,
      studentID: studentID.toString(),
    });
  };

  // render the details of the status of the students in the event
  const renderPerson = (person) => {
    if (typeof studentKeyedData != 'undefined') {
      var totalCount =
        studentKeyedData[person.studentID]?.['checkpoints']?.length;

      var totalText = `Checkpoints: ${totalCount}`;
      var hasFinalText = '';
      if (studentKeyedData[person.studentID]?.hasFinalRelease) {
        hasFinalText = 'Released';
      }

      return (
        <View>
          <StudentDetailButtonDisplay
            personName={`${person.firstName} ${person.lastName}`}
            personID={person.studentID}
            rightTopText={totalText}
            rightBottomText={hasFinalText}
            isFinal={studentKeyedData[person.studentID]?.hasFinalRelease}
            isFinal={false}
            isTab={isTab}
            onSelect={selectStudentForCheckpointList}
          />
        </View>
      );
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
              Event - Students
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
                <Text style={{ opacity: 0.4 }}>{statisticsTotalStudents}</Text>
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
              marginBottom: Platform.OS === "ios" ? 0 : 20,
              padding: 10,
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {eventDetail?.studentArray.length > 0 ? (
              <FlatList
                data={eventDetail?.studentArray}
                renderItem={({ item, index }) => (
                  <View
                    key={index}
                    style={{
                      borderRadius: 5,
                      borderColor: '#D3D3D3',
                      borderWidth: 0.5,
                      marginBottom: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleStudentClick(item.studentID)}
                    >
                      <View>{renderPerson(item)}</View>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(i) => i.studentID.toString()}
              />
            ) : (
              <NoStudentsFoundMessage message='No students found in the event.' />
            )}
          </View>
        </View>

        <View style={commonStyles.static_white_background}></View>
      </View>
    </SafeAreaView>
  );
};

export default eventAttendanceDetailStudentScreen;
