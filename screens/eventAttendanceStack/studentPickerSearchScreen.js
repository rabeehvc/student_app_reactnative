import React, { useEffect, useState, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from 'react-native-woodpicker';
import { isLoadingChanged } from '../../redux/app-redux';
import RetrieveLocationsService from '../../services/retrieveLocationsService';
import RetrieveStudentsService from '../../services/retrieveStudentsService';
import Loader from '../../components/Loader';
import { invertColor } from '../../functions/functions';
import commonStyles from '../../styles/commonStyles';

const studentPickerSearchScreen = ({ navigation, route }) => {
  const { userData } = useSelector((state) => state);
  const { districtData } = useSelector((state) => state);
  const [locationData, setLocationData] = useState([]);
  const [studentID, setStudentID] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [grade, setGrade] = useState('');
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [navigationOrigin, setNavigationOrigin] = useState();
  const ref_firstname = useRef();
  const ref_lasttname = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    pullLocationData();
    setNavigationOrigin(route.params.navigationOrigin);
  }, []);

  // Server request to get location data for location filter
  const pullLocationData = async () => {
    try {
      dispatch(isLoadingChanged(true));
      const retrieveLocationsService = new RetrieveLocationsService();
      const response = await retrieveLocationsService.performLocationsRequest(
        userData.sessionToken
      );

      if (!response.JWTIsValid) {
        dispatch(isLoadingChanged(false));
        return;
      }
      if (response.status === 'success') {
        const locationData = [{ value: '', label: '-- ALL --' }]; // Start off array of location data with an --ALL-- option

        // If successfully retrieved array of locations,
        // parse into array usable by the dropdown select,
        // and stuff into local State
        response.locations.map((locationItem) =>
          locationData.push({
            value: locationItem.locationid,
            label: locationItem.description,
          })
        );

        setLocationData(locationData);
        setSelectedLocation(locationData[0]);
      } else {
        Alert.alert('Problem retrieving location data.');
      }
      dispatch(isLoadingChanged(false));
    } catch (responseError) {
      dispatch(isLoadingChanged(false));
      Alert.alert('Unable to retrieve location data.', responseError);
    }
  };

  const pullStudentData = async () => {
    try {
      // Use RetrieveStudentsService to make network request
      dispatch(isLoadingChanged(true));
      const retrieveStudentsService = new RetrieveStudentsService();
      const response =
        await retrieveStudentsService.performStudentSearchRequest(
          userData.sessionToken,
          studentID,
          firstName,
          lastName,
          grade,
          selectedLocation.value
        );

      if (!response.JWTIsValid) {
        dispatch(isLoadingChanged(false));
        return;
      }

      if (response.status === 'success') {
        if (response.students.length === 1) {
          const { students } = response;
          const currentIndex = 0;
          const currentStudent = students[currentIndex];
          navigation.navigate({
            name: 'EventAttendanceDetailScreen',
            params: {
              studentID: currentStudent.studentid,
              firstName: currentStudent.firstname,
              lastName: currentStudent.lastname,
            },
            merge: true,
          });
        } else {
          // If there are multiple students returned, navigate to StudentListScreen
          navigation.navigate('StudentPickerListScreen', {
            studentsArray: response.students,
            labelText: 'Students Found : ',
            valueText: response.students.length,
            navigationOrigin: navigationOrigin,
          });
        }
      } else {
        Alert.alert('Problem retrieving student data.');
      }
      dispatch(isLoadingChanged(false));
      setDisableSubmit(false);
    } catch (responseError) {
      dispatch(isLoadingChanged(false));
      setDisableSubmit(false);
      Alert.alert('Unable to retrieve student data.', responseError);
    }
  };

  const changeLocation = (item) => {
    if (item.value == '') {
      setSelectedLocation(locationData[0]);
    } else {
      setSelectedLocation(item);
    }
  };

  const onSearchStudentPressed = () => {
    setDisableSubmit(true);    
    pullStudentData();
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
              Student Search
            </Text>
            <View
              style={{
                flex: 2,
              }}
            ></View>
          </View>

          <View
            style={{
              flex: 7,
              backgroundColor: 'white',
              width: '86%',
              alignSelf: "center",
              borderRadius: 10,
              padding: 20,
              marginTop: 10,
              marginBottom: 20,
            }}
          >
            {locationData.length > 0 ? (
              <>
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
                        borderBottomWidth: 0.5,
                        height: 30,
                      }}
                      value={studentID}
                      maxLength={25}
                      keyboardType='numeric'
                      onChangeText={(username) => setStudentID(username)}
                      onSubmitEditing={() => ref_firstname.current.focus()}
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

                <View
                  style={{
                    flex: 1,

                    justifyContent: "center",
                  }}
                >
                  <TextInput
                    ref={ref_firstname}
                    style={{
                      borderBottomColor: '#D3D3D3',
                      borderBottomWidth: 1,
                      height: 30,
                    }}
                    value={firstName}
                    maxLength={25}
                    onChangeText={(username) => setFirstName(username)}
                    onSubmitEditing={() => ref_lasttname.current.focus()}
                    placeholder='First Name'
                    placeholderTextColor={'#999999'}
                  ></TextInput>
                  <Feather name='user' style={commonStyles.icon} />
                </View>

                <View style={{ flex: 1, justifyContent: "center" }}>
                  <TextInput
                    ref={ref_lasttname}
                    style={{
                      borderBottomColor: '#D3D3D3',
                      borderBottomWidth: 1,
                      height: 30,
                    }}
                    value={lastName}
                    maxLength={25}
                    onChangeText={(username) => setLastName(username)}
                    placeholder='Last Name'
                    placeholderTextColor={'#999999'}
                  ></TextInput>
                  <Feather name='user-plus' style={commonStyles.icon} />
                </View>

                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Picker
                    style={{
                      borderBottomColor: '#D3D3D3',
                      borderBottomWidth: 1,
                      height: 30,
                    }}
                    item={selectedLocation}
                    items={locationData}
                    textInputStyle={{ fontSize: 13 }}
                    onItemChange={(item) => {
                      changeLocation(item);
                    }}
                    placeholder='Select Location'
                    isNullable
                  />
                 
                    <MaterialIcons
                      name='keyboard-arrow-down'
                      style={commonStyles.icon}
                    />
                 
                </View>

                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    disabled={disableSubmit}
                    activeOpacity={0.6}
                    style={[commonStyles.btn]}
                    onPress={() => onSearchStudentPressed()}
                  >
                    <Text
                      style={{
                        color: 'white',
                      }}
                    >
                      Search Students
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 2 }}></View>
              </>
            ) : (
              <>
                <Loader column={1} />
                <Loader column={1} />
                <Loader column={1} />
              </>
            )}
          </View>
        </View>

        <View style={commonStyles.static_white_background}></View>
      </View>
    </SafeAreaView>
  );
};

export default studentPickerSearchScreen;
