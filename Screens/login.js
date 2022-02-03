import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
  StatusBar,
  Switch,
  Platform,
} from 'react-native'
import CheckBox from 'expo-checkbox';
import { useIsFocused } from '@react-navigation/native';
import Barcode from 'react-native-barcode-expo';
import Moment from 'react-moment';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import OneSignal from 'react-native-onesignal';
import DeviceInfo from 'react-native-device-info';
import jwt_decode from 'jwt-decode';
import Toast from 'react-native-tiny-toast';
import * as LocalAuthentication from 'expo-local-authentication';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import themes from '../Styles/themes';
import { LoginServices } from '../Services/authentication-services';
import { invertColor } from '../Functions/functions';
import { checkURL } from '../Functions/functions';
import { decrypt } from '../Functions/functions';
import { encrypt } from '../Functions/functions';

const Login = ({ navigation, route }) => {
  //useStates
  const [indicator, setIndicator] = useState(false);
  const [userName, setUserName] = useState('');
  const [passWord, setPassWord] = useState('');
  const [isSelected, setSelection] = useState(false);
  const [value, setValues] = useState('');
  const [year, setYear] = useState('');
  //useRef to reference the text iput from username to password
  const ref_password = useRef();
  const [isModalVisible, setisModalVisible] = useState(false);
  const [isButtonVisible, setisButtonVisible] = useState(false);
  const [data, setDistData] = useState();
  const [isBiometricSupported, setIsBiometricSupported] = React.useState(false);
  const [isDisabled, setBtnDisabled] = useState(false);
  const [bioBtnDisabled, setBioBtnDisabled] = useState(false);
  const isFocused = useIsFocused();
  const [onesignalUserID, setOneSignalUserID] = useState();
  const [oneSignalPushToken, setOneSignalPushToken] = useState();
  const [distPortalCode, setDistCode] = useState();
  const [deviceUniqueID, setDeviceid] = useState();
  const [deviceName, setDeviceName] = useState();
  const [devicePlatform, setDevicePlatform] = useState();
  const [nativeAppVersion, setNativeAppVersion] = useState();
  const [barcodeString, setBarcodeString] = useState('');

  let timeOutIDNormalLogin = null;
  let timeOutIDBioLogin = null;

  useEffect(() => {
    setIndicator(false);
    setBtnDisabled(false);
    setBioBtnDisabled(false);
    getUserId();
    setUniqueDeviceID();
    setDeviceName(Device.deviceName);
    setDevicePlatform(Platform.OS);    
    if (Application.nativeAppVersion == undefined) {
      setNativeAppVersion(DeviceInfo.getVersion());
    }else{
      setNativeAppVersion(Application.nativeAppVersion);
    }
    
  }, []);

  const setUniqueDeviceID = async () => {
    let fetchUUID = await SecureStore.getItemAsync('secure_deviceid');
    let deviceid = fetchUUID.slice(1);
    deviceid = deviceid.slice(0, deviceid.length - 1);
    setDeviceid(deviceid);
    retrieveData(deviceid);
  };

  useEffect(() => {
    if (isFocused) {
      getUserName();
      retrieveData();
      getIdDetails();
      AsyncStorage.getItem('@logout').then((logout) => {
        if (logout) {
          setPassWord('');
          AsyncStorage.removeItem('@logout');
          if (!isSelected) {
            setUserName('');
          }
        }
      });
      AsyncStorage.removeItem('@apilogdata');
      setBtnDisabled(false);
    }
  }, [isFocused]);

  //retrive data from asyncstorage
  const retrieveData = () => {
    if (route.params?.data) {
      setDistData(route.params.data);
      AsyncStorage.setItem('@apidistData', JSON.stringify(route.params.data));
    } else {
      AsyncStorage.getItem('@apidistData').then((distdata) => {
        setDistData(JSON.parse(distdata));
      });
    }
    AsyncStorage.getItem('@distCode').then((distCode) => {
      setDistCode(distCode);
    });
    AsyncStorage.getItem('@BarcodeString').then((barCode) => {
      setBarcodeString(barCode);
    });
  };

  // Check if hardware supports biometrics
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  });

  //visible id-card getting datas to id card
  const getIdDetails = () => {
    AsyncStorage.getItem('@idDetails').then((idData) => {
      if (idData) {
        setisButtonVisible(true);
        setValues(JSON.parse(idData));
        getYear();
      } else {
        setisButtonVisible(false);
      }
    });
  };

  //event to close the modal
  const changeModelVisible = (bool) => {
    setisModalVisible(bool);
  };

  //geting stored year value
  const getYear = () => {
    AsyncStorage.getItem('@idYear').then((year) => {
      setYear(JSON.parse(year));
    });
  };

  //geting saved username from async storage
  const getUserName = () => {
    AsyncStorage.getItem('@username').then((name) => {
      if (name) {
        setUserName(name);
        setSelection(true);
      } else {
        setUserName('');
        setSelection(false);
      }
    });
  };

  const getUserId = async () => {
    const deviceState = await OneSignal.getDeviceState();
    if (deviceState != null) {
      setOneSignalUserID(deviceState.userId);
      setOneSignalPushToken(deviceState.pushToken);
    }
  };

  const setBarcodeStringDuringLogin = async (jwt_session) => {
    let barcodeString = '';
    let defaultScanCharacter = '';
    let localStudentIdentfier = '';
    let identifiers = jwt_decode(jwt_session);
    defaultScanCharacter = identifiers?.defaultScanCharacter;
    localStudentIdentfier = identifiers?.localStudentIdentfier;
    let studentID = identifiers?.ADDRESSID;
    if (defaultScanCharacter != undefined) {
      if (localStudentIdentfier != undefined && Number(localStudentIdentfier)) {
        barcodeString =
          `${defaultScanCharacter}${localStudentIdentfier}${defaultScanCharacter}`;
      } else {
        barcodeString = `${defaultScanCharacter}${studentID}${defaultScanCharacter}`;
      }
    } else {
      if (localStudentIdentfier != undefined && Number(localStudentIdentfier)) {
        barcodeString = `*${localStudentIdentfier}*`;
      } else {
        barcodeString = `*${studentID}*`;
      }
    }
    if (defaultScanCharacter == '') {
      if (localStudentIdentfier != undefined && Number(localStudentIdentfier)) {
        barcodeString = localStudentIdentfier;
      } else {
        barcodeString = studentID;
      }
    }
    AsyncStorage.setItem('@BarcodeString', barcodeString);
  };

  //button event for login
  const studentLogin = async () => {
    setBtnDisabled(true);
    setBioBtnDisabled(true);
    setIndicator(true);
    if (errorCheck()) {
      let formdata = new FormData();
      //append username,password,districtid,portalcode to the url
      formdata.append('username', userName);
      formdata.append('password', passWord);
      formdata.append('districtID', data.districtid);
      formdata.append('vendorID', onesignalUserID);
      formdata.append('pushToken', oneSignalPushToken);
      formdata.append('portalcode', distPortalCode);
      formdata.append('deviceID', deviceUniqueID);
      formdata.append('deviceFriendlyName', deviceName);
      formdata.append('deviceType', devicePlatform);
      formdata.append('deviceAppVersion', nativeAppVersion);
      let response = await LoginServices(formdata);
      setIndicator(true);
      if (response.ok) {
        try {
          let logdata = await response.json();        
          if (logdata.status == 'success') {           
            //if check box selected data will be stored
            if (isSelected) {
              AsyncStorage.setItem('@username', userName);
            } else {
              AsyncStorage.removeItem('@username');
            }
            const encrypted_text = encrypt('salt', passWord);
            AsyncStorage.setItem('@Password', encrypted_text);
            AsyncStorage.removeItem('@logout');
            setBarcodeStringDuringLogin(logdata.session);
            await AsyncStorage.setItem('@apilogdata', JSON.stringify(logdata));
            setIndicator(false);
            setBtnDisabled(false);
            setBioBtnDisabled(false);
            AsyncStorage.getItem('@loginTimeOutBio').then(async (Pass) => {
              if (Pass) {
                clearTimeout(parseInt(Pass));
              }
            });

            timeOutNormalFunc();

            AsyncStorage.setItem(
              '@loginTimeOutNormal',
              JSON.stringify(timeOutIDNormalLogin)
            );
            navigation.navigate('MenuComponent');
          } else {
            Alert.alert(
              'Invalid login',
              'Invalid login credentials provided.Please try again.'
            );
            setBtnDisabled(false);
            setBioBtnDisabled(false);
            setIndicator(false);
          }
        } catch (err) {
          alert(err);
        }
      } else {
        setBtnDisabled(false);
        setBioBtnDisabled(false);
        setIndicator(false);
        Alert.alert('Invalid Login', `Status Code: ${response.status}`);
      }
    }
  };
  const errorCheck = () => {
    let valid = true;
    if (!userName.trim() || !passWord.trim()) {
      valid = false;
      setIndicator(false);
      Toast.show('Please make sure you have filled out all the fields.', {
        mask: true,
        shadow: true,
        containerStyle: {
          backgroundColor: '#D8000C',
          borderRadius: 999,
          width: "auto",
        },
        textStyle: { fontSize: 12 },
      });
      setBtnDisabled(false);
      setBioBtnDisabled(false);
    }
    return valid;
  };

  // BIO authentication
  const fallBackToDefaultAuth = () => {
    console.log('fall back to password authentication');
  };

  const alertComponent = (title, mess, btnTxt, btnFunc) => {
    return Alert.alert(title, mess, [
      {
        text: btnTxt,
        onPress: btnFunc,
      },
    ]);
  };

  const timeOutNormalFunc = () => {
    timeOutIDNormalLogin = setTimeout(() => {
      Alert.alert('Alert', 'Your session has expired, Please login again', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Login');
          },
        },
      ]);
    }, 900000);
  };

  const timeOutBioFunc = () => {
    timeOutIDBioLogin = setTimeout(() => {
      Alert.alert('Alert', 'Your session has expired, Please login again', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Login');
          },
        },
      ]);
    }, 900000);
  };

  const handleBiometricAuth = async () => {
    // Check if hardware supports biometrics
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();
    // Fallback to default authentication method (password) if Fingerprint is not available
    if (!isBiometricAvailable)
      return alertComponent(
        'Please enter your password',
        'Biometric Authentication not supported',
        'OK',
        () => fallBackToDefaultAuth()
      );

    // Check Biometrics types available (Fingerprint, Facial recognition, Iris recognition)
    if (isBiometricAvailable)
      supportedBiometrics =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

    // Check Biometrics are saved locally in user's device
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics)
      return alertComponent(
        'Biometric record not found',
        'Please login with your password',
        'OK',
        () => fallBackToDefaultAuth()
      );

    // Authenticate use with Biometrics (Fingerprint, Facial recognition, Iris recognition)

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login with Biometrics',
      cancelLabel: 'Cancel',
      disableDeviceFallback: true,
    });

    // Log the user in on success

    if (biometricAuth.success == true) {
      setBioBtnDisabled(true);
      setBtnDisabled(true);
      setIndicator(true);
      if (!userName.trim()) {
        setIndicator(false);
        Toast.show('Please fill the username.', {
          mask: true,
          shadow: true,
          containerStyle: {
            backgroundColor: '#D8000C',
            borderRadius: 999,
            width: "auto",
          },
          textStyle: { fontSize: 12 },
        });
        setBioBtnDisabled(false);
        setBtnDisabled(false);
        setIndicator(false);
      } else {
        AsyncStorage.getItem('@Password').then(async (Pass) => {
          if (Pass) {
            const decrypted_string = decrypt('salt', Pass);
            let formdata = new FormData();
            //append username,password,districtid,portalcode to the url
            formdata.append('username', userName);
            formdata.append('password', decrypted_string);
            formdata.append('districtID', data.districtid);
            formdata.append('vendorID', onesignalUserID);
            formdata.append('pushToken', oneSignalPushToken);
            formdata.append('deviceID', deviceUniqueID);
            formdata.append('deviceFriendlyName', deviceName);
            formdata.append('deviceType', devicePlatform);
            formdata.append('deviceAppVersion', nativeAppVersion);

            let response = await LoginServices(formdata);
            if (response.ok) {
              try {
                let logdata = await response.json();
                if (logdata.status == 'success') {
                  //if check box selected data will be stored
                  if (isSelected) {
                    AsyncStorage.setItem('@username', userName);
                  } else {
                    AsyncStorage.removeItem('@username');
                  }
                  setBarcodeStringDuringLogin(logdata.session);
                  AsyncStorage.removeItem('@logout');
                  await AsyncStorage.setItem(
                    '@apilogdata',
                    JSON.stringify(logdata)
                  );
                  setBioBtnDisabled(false);
                  setIndicator(false);

                  AsyncStorage.getItem('@loginTimeOutNormal').then(
                    async (Pass) => {
                      if (Pass) {
                        clearTimeout(parseInt(Pass));
                      }
                    }
                  );

                  timeOutBioFunc();
                  AsyncStorage.setItem(
                    '@loginTimeOutBio',
                    JSON.stringify(timeOutIDBioLogin)
                  );
                  navigation.navigate('MenuComponent');
                } else {
                  Alert.alert(
                    'Invalid login',
                    'Invalid login credentials provided.Please try again.'
                  );
                  setBioBtnDisabled(false);
                  setBtnDisabled(false);
                  setIndicator(false);
                }
              } catch (err) {
                alert(err);
              }
            } else {
              setBtnDisabled(false);
              setBioBtnDisabled(false);
              setIndicator(false);
              Alert.alert(
                'Invalid Login',
                'Unable to login with these credentials'
              );
            }
          } else {
            alert('Use password to login for first time');
            setBioBtnDisabled(false);
            setIndicator(false);
            setBtnDisabled(false);
          }
        });
      }
    } else {
      setBtnDisabled(false);
      setBioBtnDisabled(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        themes.container,
        {
          backgroundColor: data?.primarycolor ? data?.primarycolor : '#ffffff',
        },
      ]}
    >
      <StatusBar
        animated={true}
        barStyle="light-content"
        backgroundColor={data?.primarycolor ? data?.primarycolor : '#ffffff'}
      />
      <View style={themes.containerPadding}>
        <ActivityIndicator
          size="large"
          style={themes.loading}
          color={invertColor(
            data?.primarycolor ? data?.primarycolor : '#ffffff',
            true
          )}
          animating={indicator}
        />
        <KeyboardAwareScrollView>
          <View style={themes.txtview}>
            {/* id card button only visible if there is any data */}
            {isButtonVisible && (
              <TouchableOpacity
                visible={isModalVisible}
                style={themes.idSavedBtn}
                onPress={() => changeModelVisible(true)}
              >
                <FontAwesome5
                  name='user-circle'
                  size={24}
                  color={invertColor(
                    data?.primarycolor ? data?.primarycolor : '#ffffff',
                    true
                  )}
                />
              </TouchableOpacity>
            )}
            <Text
              style={[
                themes.txth1,
                {
                  color: invertColor(
                    data?.primarycolor ? data?.primarycolor : '#ffffff',
                    true
                  ),
                },
              ]}
            >
              Realtime
            </Text>
            <Text
              style={[
                themes.txth2,
                {
                  color: invertColor(
                    data?.primarycolor ? data?.primarycolor : '#ffffff',
                    true
                  ),
                },
              ]}
            >
              Link for Students
            </Text>
          </View>
          <View style={themes.image}>
            <Image source={require('../assets/loginimage.png')}></Image>
          </View>
          {/* bottombox starts here */}
          <View style={themes.loginViewBox}>
            <Text
              style={[
                themes.txth3,
                {
                  color: invertColor(
                    data?.primarycolor ? data?.primarycolor : '#ffffff',
                    true
                  ),
                },
              ]}
            >
              {data?.districtdisplayname}
            </Text>
            {/* text field for username and password*/}
            <View style={themes.field}>
              <TextInput
                style={[
                  themes.txtInput,
                  {
                    color: invertColor(
                      data?.primarycolor ? data?.primarycolor : '#ffffff',
                      true
                    ),
                    borderBottomColor: data?.secondarycolor
                      ? data?.secondarycolor
                      : '#000000',
                  },
                ]}
                value={userName}
                maxLength={25}
                keyboardType="numeric"
                onChangeText={(username) => setUserName(username)}
                onSubmitEditing={() => ref_password.current.focus()}
                placeholder='Username'
                placeholderTextColor={invertColor(
                  data?.primarycolor ? data?.primarycolor : '#ffffff',
                  true
                )}
              ></TextInput>
              <Feather name='user' style={themes.icon} />
            </View>
            <View style={themes.fieldPass}>
              <TextInput
                style={[
                  themes.txtInput,
                  {
                    color: invertColor(
                      data?.primarycolor ? data?.primarycolor : '#ffffff',
                      true
                    ),
                    borderBottomColor: data?.secondarycolor
                      ? data?.secondarycolor
                      : '#000000',
                  },
                ]}
                value={passWord}
                maxLength={25}
                ref={ref_password}
                onChangeText={(password) => setPassWord(password)}
                placeholder='Password'
                placeholderTextColor={invertColor(
                  data?.primarycolor ? data?.primarycolor : '#ffffff',
                  true
                )}
                autoCapitalize="none"
                secureTextEntry={true}
              ></TextInput>
              <Feather name="lock" style={themes.icon} />
            </View>

            {/* checkbox fo remember me */}
            <View style={themes.checkboxContainer}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-start",
                }}
              >
                {Platform.OS === "android" ? (
                  <CheckBox
                    color={
                      isSelected
                        ? data?.secondarycolor
                          ? data?.secondarycolor
                          : '#000000'
                        : undefined
                    }
                    style={themes.CheckBox}
                    value={isSelected}
                    onValueChange={setSelection}
                  />
                ) : (
                  <Switch
                    style={themes.remembermeSwitch}
                    trackColor={{
                      true: data?.secondarycolor
                        ? data?.secondarycolor
                        : '#000000',
                      false: data?.primarycolor
                        ? data?.primarycolor
                        : '#ffffff',
                    }}
                    thumbColor={
                      isSelected
                        ? invertColor(
                            data?.primarycolor ? data?.primarycolor : '#ffffff',
                            true
                          )
                        : '#fffff'
                    }
                    value={isSelected}
                    onValueChange={setSelection}
                  ></Switch>
                )}
                <Text
                  style={[
                    themes.txtCheck,
                    {
                      color: invertColor(
                        data?.primarycolor ? data?.primarycolor : '#ffffff',
                        true
                      ),
                    },
                  ]}
                >
                  Remember Me
                </Text>
              </View>
              <Text
                disabled={bioBtnDisabled}
                style={[
                  themes.btnBiokit,
                  {
                    color: invertColor(
                      data?.primarycolor ? data?.primarycolor : '#ffffff',
                      true
                    ),
                  },
                ]}
                onPress={handleBiometricAuth}
              >
                {' '}
                {isBiometricSupported ? 'Login with Face/Touch ID' : ''}
              </Text>
            </View>

            {/*Login button */}
            <TouchableOpacity
              disabled={isDisabled}
              activeOpacity={0.3}
              style={[
                themes.btn,
                {
                  backgroundColor: data?.secondarycolor
                    ? data?.secondarycolor
                    : '#000000',
                },
              ]}
              onPress={() => studentLogin()}
            >
              <Text
                style={{
                  color: invertColor(
                    data?.secondarycolor ? data?.secondarycolor : '#000000',
                    true
                  ),
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
            <View style={themes.distStyle}>
              {/* change district code */}
              <TouchableOpacity
                activeOpacity={0.6}
                style={[
                  themes.btnChangedist,
                  {
                    borderBottomColor: data?.secondarycolor
                      ? data?.secondarycolor
                      : '#000000',
                  },
                ]}
                onPress={() => navigation.navigate('DistrictCode')}
              >
                <Text
                  style={{
                    color: invertColor(
                      data?.primarycolor ? data?.primarycolor : '#ffffff',
                      true
                    ),
                  }}
                >
                  Change District
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
        {/* saved Id Card display model box */}
        {isModalVisible && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => changeModelVisible(false)}
          >
            <View style={themes.centeredView}>
              <View style={themes.modalView}>
                {/* button to visible id card */}
                <TouchableOpacity
                  style={themes.closeBtn}
                  onPress={() => changeModelVisible(false)}
                >
                  <Image
                    style={themes.closeBtnImg}
                    source={require('../assets/closebutton.png')}
                  />
                </TouchableOpacity>
                <Text style={themes.idtxt1}>{value.locationdisplayname}</Text>
                <View style={themes.idImgView}>
                  <Image
                    style={themes.profileImg}
                    source={
                      checkURL(value.studentimageurl)
                        ? { uri: value.studentimageurl }
                        : require('../assets/noimage.png')
                    }
                  ></Image>
                  <Text style={themes.idtxtName}>
                    {`${value.firstname} ${value.middlename} ${value.lastname}`}
                  </Text>
                </View>
                <View style={themes.IdZview}>
                  <View style={themes.idField}>
                    <View style={themes.idFieldStyle}>
                      <Text style={themes.idSubtxt1}>DOB</Text>
                      <Text style={themes.idSubtxt2}>Home Room</Text>
                    </View>
                    <View style={themes.idRow}>
                      <Moment
                        style={themes.idResult1}
                        element={Text}
                        format='MMM, D YYYY'
                      >
                        {value.dob}
                      </Moment>
                      <Text style={themes.idResult2}>{value.homeroom}</Text>
                    </View>
                  </View>
                  <View style={themes.idField}>
                    <View style={themes.idFieldStyle}>
                      <Text style={themes.idSubtxt1}>Gender</Text>
                      <Text style={themes.idSubtxt2}>Grade</Text>
                    </View>
                    <View style={themes.idRow}>
                      <Text style={themes.idResult1}>{value.gender}</Text>
                      <Text style={themes.idResult2}>{value.grade}</Text>
                    </View>
                  </View>
                  <View style={themes.idFieldSchool}>
                    <View style={themes.idFieldStyle}>
                      <Text style={themes.idSubtxt1}>School Year</Text>
                    </View>
                    <View style={themes.idFieldStyle}>
                      <Text style={themes.idResult1}>
                        {`${JSON.stringify(
                          year.actualschoolyear
                        )} - ${JSON.stringify(year.actualschoolyear + 1)}`}
                      </Text>
                    </View>
                  </View>
                  <View style={themes.barcode}>
                    {barcodeString != '' ? (
                      <Barcode value={barcodeString} format="CODE128" />
                    ) : null}
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
};
export default Login;
