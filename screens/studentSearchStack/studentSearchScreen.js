import React, { useEffect, useState, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { isLoadingChanged } from '../../redux/app-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Picker } from 'react-native-woodpicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Snackbar } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { Feather, AntDesign, MaterialIcons } from '@expo/vector-icons';
import RetrieveLocationsService from '../../services/retrieveLocationsService';
import RetrieveStudentsService from '../../services/retrieveStudentsService';
import Loader from '../../components/Loader';
import commonStyles from '../../styles/commonStyles';
import { invertColor } from '../../functions/functions';

const studentSearchScreen = ({ navigation, route }) => {
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
  const { height: wHeight } = Dimensions.get('window');
  const isFocused = useIsFocused();
  const [snackBarIsVisible, setSnackBarIsVisible] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (route.params?.message) {
      if (isFocused) {
        setSnackBarIsVisible(true);
        setSnackBarMessage(route.params?.message);
        route.params.message = null;
      }
    }
  }, [route.params?.message, isFocused]);

  useEffect(() => {
    pullLocationData();
  }, []);

  useEffect(() => {
    if (isFocused) {
      if (typeof route.params?.navigationOrigin == 'undefined') {
        setNavigationOrigin(undefined);
      } else {
        setNavigationOrigin(route.params?.navigationOrigin);
      }
      navigation.setParams({ navigationOrigin: undefined });
    }
  }, [isFocused]);

  // Server request to get location data for location filter
  const pullLocationData = async () => {
    try {
      dispatch(isLoadingChanged(true));
      const retrieveLocationsService = new RetrieveLocationsService();
      const response = await retrieveLocationsService.performLocationsRequest(
        userData.sessionToken
      );
      
      if (!response.JWTIsValid) {
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
        dispatch(isLoadingChanged(false));
        setLocationData(locationData);
        setSelectedLocation(locationData[0]);
      } else {
        Alert.alert('Problem retrieving location data.');
      }
    } catch (responseError) {
      dispatch(isLoadingChanged(false));
      Alert.alert('Unable to retrieve location data.', responseError);
    }
  };

  // PUll the students data based on the filteration such as name,lastname,location
  const pullStudentData = async () => {
    try {
      // Use RetrieveStudentsService to make network request
      dispatch(isLoadingChanged(true));      
      setDisableSubmit(true);
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
        return;
      }
      if (response.status === 'success') {      
        if (response.students.length === 1) {
          // If there is only 1 student returned, navigate to StudentProfileScreen
          const { students } = response;
          const currentIndex = 0;
          const currentStudent = students[currentIndex];

          navigation.navigate('StudentProfileScreen', {
            studentID: currentStudent.studentid,
            firstName: currentStudent.firstname,
            lastName: currentStudent.lastname,
            grade: currentStudent.grade,
            homeroom: currentStudent.homeroom,
            navigationOrigin: navigationOrigin,
            singleStudent: true,
          });
        } else {
          // If there are multiple students returned, navigate to StudentListScreen
          navigation.navigate('StudentListScreen', {
            studentsArray: response.students,
            labelText: 'Students Found:',
            valueText: response.students.length,
            navigationOrigin: navigationOrigin,
            singleStudent: false,
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

  const onSearchStudentPressed = () => {
    
    pullStudentData();
  };

  // Navigate to the barcodescanner page
  const onBarCodeScanPressed = () => {
    navigation.navigate('StudentBarCodeScanner',{
      navigationOrigin: navigationOrigin,
      singleStudent: true      
    });
  };

  // Location dropdown change event
  const changeLocation = (item) => {
    if (item.value == '') {
      setSelectedLocation(locationData[0]);
    } else {
      setSelectedLocation(item);
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
                backgroundColor: "white",
                width: '86%',
                alignSelf: "center",
                borderRadius: 10,
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 10,
                paddingBottom: 10,
                marginBottom: Platform.OS === "ios" ? 0 : 20,
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
                          borderBottomWidth: 1,
                          height: 30,
                        }}
                        value={studentID}
                        maxLength={25}
                        keyboardType="numeric"
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
                  <View style={{ flex: 2 }}>                
                    <Snackbar
                      duration={1500}
                      visible={snackBarIsVisible}
                      onDismiss={() => setSnackBarIsVisible(false)}
                    >
                      {snackBarMessage}
                    </Snackbar>
                  </View>
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
        </KeyboardAwareScrollView>
        <View style={commonStyles.static_white_background}></View>
      </View>
    </SafeAreaView>
  );

};

export default studentSearchScreen;


