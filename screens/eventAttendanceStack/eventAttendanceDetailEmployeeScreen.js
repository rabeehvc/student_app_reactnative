import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  FlatList
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import EventAttendanceStudentStatisticsService from '../../services/eventAttendanceStudentStatisticsService';
import { invertColor } from '../../functions/functions';
import commonStyles from '../../styles/commonStyles';

const eventAttendanceDetailEmployeeScreen = ({ navigation, route }) => {
  const { districtData } = useSelector((state) => state);
  const { eventDetail } = route.params;
  const { height: wHeight } = Dimensions.get('window');
  const [statisticsTotalFinal, setStatisticsTotalFinal] = useState();
  const [statisticsTotalStudents, setStatisticsTotalStudents] = useState();

  useEffect(() => {    
    refreshEventDataStatistics(eventDetail);
  }, []);    

  // Refresh the event details
  const refreshEventDataStatistics = (newEventDetail) => {
    const eventStatsService = new EventAttendanceStudentStatisticsService();
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
    // setStudentKeyedData(newState.studentKeyedData);
  };

  const onPersonSelected = () => {};

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
              Event - Employees
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
              marginBottom: 5,
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
              flex: 7,
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
            <FlatList
              data={eventDetail.employeeArray}
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
                  <TouchableOpacity onPress={onPersonSelected}>
                    <View
                      style={{ flex: 1, flexDirection: "column", padding: 10 }}
                    >
                      <Text style={{ fontWeight: "bold" }}>
                        {item.firstName.trim()} {item.lastName.trim()}
                      </Text>
                      <Text style={{ marginTop: 5 }}>
                        ID : {item.employeeID}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(i) => i.employeeID.toString()}
            />
          </View>
        </View>

        <View style={commonStyles.static_white_background}></View>
      </View>
    </SafeAreaView>
  );
};

export default eventAttendanceDetailEmployeeScreen;
