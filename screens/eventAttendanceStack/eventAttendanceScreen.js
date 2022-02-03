import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Alert,
  FlatList,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { isLoadingChanged } from '../../redux/app-redux';
import NoStudentsFoundMessage from '../../components/noStudentsFoundMessage';
import { checkLocalUserPermission } from '../../utilities/permissionsUtilities';
import EventScheduleService from '../../services/eventScheduleService';
import { invertColor } from '../../functions/functions';
import commonStyles from '../../styles/commonStyles';

const eventAttendanceScreen = ({ navigation, routes }) => {
  const { districtData } = useSelector((state) => state);
  const { userData } = useSelector((state) => state);
  const [eventData, setEventData] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (checkLocalUserPermission('Display Schedule')) {
      pullEventScheduleData();
    }
  }, []);

  // // Server request to get Staff Schedule data for the FlatList
  const pullEventScheduleData = async () => {
    try {
      dispatch(isLoadingChanged(true));
      const eventScheduleService = new EventScheduleService();
      const response =
        await eventScheduleService.performRetrieveEventScheduleRequest(
          userData.sessionToken
        );
      if (!response.JWTIsValid) {
        dispatch(isLoadingChanged(false));
        return;
      }

      if (response.status === 'success') {
        setEventData(response.eventData);
      } else {
        Alert.alert('Problem retrieving event schedule data.');
      }
      dispatch(isLoadingChanged(false));
    } catch (responseError) {
      dispatch(isLoadingChanged(false));
      Alert.alert('Unable to retrieve event schedule data.', responseError);
    }
  };

  // Fetch event details and navigatet to the details screen
  const pullEventDetailData = async (event) => {
    try {
      dispatch(isLoadingChanged(true));
      const eventScheduleService = new EventScheduleService();
      const response =
        await eventScheduleService.performRetrieveEventDetailRequest(
          userData.sessionToken,
          event.eventID
        );

      if (!response.JWTIsValid) {
        dispatch(isLoadingChanged(false));
        return;
      }

      if (response.status === 'success') {
        navigation.navigate('EventAttendanceDetailScreen', {
          eventData: event.eventDetail,
          eventDetail: response['eventDetail'],
          eventDateTime: event.eventDateTime.format('lll'),
        });
      } else {
        Alert.alert('Problem retrieving event detail data.');
      }
      dispatch(isLoadingChanged(false));
    } catch (responseError) {
      dispatch(isLoadingChanged(false));
      Alert.alert('Unable to retrieve event data.', responseError);
    }
  };

  const navigateToEventScreen = async (event) => {
    pullEventDetailData(event);
  };

  const renderEventDataItem = (event) => {
    return (
      <View
        style={{
          borderColor: '#D3D3D3',
          borderWidth: 0.5,
          borderRadius: 10,
          marginBottom: 10,
          flex: 1,
          flexDirection: "column",
          padding: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigateToEventScreen(event);
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16 }}>{event.eventName}</Text>
          </View>
          <View style={{ flex: 1, marginTop: 5 }}>
            <Text>{event.eventDateTime.format('lll')}</Text>
          </View>
        </TouchableOpacity>
      </View>
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
                flex: 2,
                alignItems: "center",
              }}
            >
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
              Event Attendance
            </Text>
            <View
              style={{
                flex: 2,
              }}
            ></View>
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
            {eventData && eventData?.length ? (
              <FlatList
                data={eventData}
                renderItem={({ item }) => renderEventDataItem(item)}
                keyExtractor={(i) => i.eventID}
              />
            ) : (
              <View>
                <NoStudentsFoundMessage message='No events found for the user' />
              </View>
            )}
          </View>
        </View>

        <View style={commonStyles.static_white_background}></View>
      </View>
    </SafeAreaView>
  );
};

export default eventAttendanceScreen;
