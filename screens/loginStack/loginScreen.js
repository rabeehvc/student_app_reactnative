import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  Platform,
  Switch,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  authStateChanged,
  hasFullAccessChanged,
  districtDataChanged,
  isLoadingChanged,
  userDataChanged,
  loginUserChanged,
  loginPassChanged,
  isTabDevice,
} from '../../redux/app-redux';
import { StatusBar } from 'expo-status-bar';
import CheckBox from 'expo-checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Device from 'expo-device';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-tiny-toast';
import LoginService from '../../services/loginService';
import commonStyles from '../../styles/commonStyles';
import { invertColor, decrypt, encrypt } from '../../functions/functions';

const LoginScreen = () => {
  const [userName, setUserName] = useState('');
  const [passWord, setPassWord] = useState('');
  const [isSelected, setSelection] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);  
  const ref_password = useRef();
  const { districtData, loginUser, loginPass } = useSelector((state) => state);
  const isFocused = useIsFocused();
  const { height: wHeight } = Dimensions.get('window');

  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  useEffect(() => {
    setDeviceTabOrPhone();
  }, []);

  // Check whether the Device is phone or Tablet in order to display the
  //profile image in center position
  //  '0': 'UNKNOWN',
  //  '1': 'PHONE',
  //  '2': 'TABLET',
  //  '3': 'DESKTOP',
  //  '4': 'TV',
  const setDeviceTabOrPhone = async () => {
    let deviceType = await Device.getDeviceTypeAsync();
    if (deviceType == 2) {
      dispatch(isTabDevice(true));
    }
  };

  useEffect(() => {
    if (isFocused) {
      getUserName();
    }
  }, [isFocused]);

  //geting saved username from Async storage
  const getUserName = () => {
    if (loginUser != null) {
      setUserName(loginUser);
      setSelection(true);
    } else {
      setUserName('');
      setSelection(false);
    }
  };

  // Login into the application
  const onLoginButtonPress = async () => {
    if (userName === '' || passWord === '') {
      Toast.show('You must enter a username and password.', {
        mask: true,
        shadow: true,
        containerStyle: {
          backgroundColor: '#D8000C',
          borderRadius: 999,
          width: "auto",
        },
        textStyle: { fontSize: 14 },
      });
    } else {
      try {
        // Make network request for login
        dispatch(isLoadingChanged(true));            
        const loginService = new LoginService();
        const response = await loginService.performLoginRequest(
          userName,
          passWord,
          districtData.districtID
        );

        // Check for errors - if no errors, save DistrictData to global state
        if (
          response.error === undefined ||
          response.error == null ||
          response.error === ''
        ) {
          if (response.status === 'success') {            
            dispatch(isLoadingChanged(false));            
            if (isSelected) {
              dispatch(loginUserChanged(userName));
              //AsyncStorage.setItem('@username', userName);
            } else {
              dispatch(loginUserChanged(null));
              //AsyncStorage.removeItem('@username');
            }

            const encrypted_text = encrypt('salt', passWord);
            //AsyncStorage.setItem('@Password', encrypted_text);

            dispatch(loginPassChanged(encrypted_text));
            dispatch(isLoadingChanged(false));
            dispatch(userDataChanged(response.userData));
            dispatch(authStateChanged(true));
            dispatch(hasFullAccessChanged(true));
          } else {
            Alert.alert('Invalid login', response.message);                                 
          }
        } else {
          Alert.alert('Invalid Login', response.error);                  
        }
        dispatch(isLoadingChanged(false));
      } catch (responseError) {
        dispatch(isLoadingChanged(false));        
        Alert.alert('Unable to Authenticate User', responseError);
      }
    }
  };

  const fallBackToDefaultAuth = () => {
    console.log('fall back to password authentication');
  };

  //Biometrics login authentication starts here
  const handleBiometricAuth = async () => {
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();
    // Fallback to default authentication method (password) if Fingerprint is not available
    if (!isBiometricAvailable)
      return Alert.alert(
        'Please enter your password',
        'Biometric Authentication not supported',
        'OK',
        () => fallBackToDefaultAuth()
      );

    // Check Biometrics types available (Fingerprint, Facial recognition, Iris recognition)
    if (isBiometricAvailable)
      await LocalAuthentication.supportedAuthenticationTypesAsync();
    // Check Biometrics are saved locally in user's device
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics)
      return Alert.alert(
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

    if (biometricAuth.success == true) {
      if (!userName.trim()) {
        let instructionMessage = 'Please fill the username.';

        Toast.show(instructionMessage, {
          mask: true,
          shadow: true,
          containerStyle: {
            backgroundColor: '#D8000C',
            borderRadius: 999,
            width: "auto",
          },
          textStyle: { fontSize: 14 },
        });
      } else {
        try {       
          if (loginPass != null) {
            const decrypted_string = decrypt('salt', loginPass);
            // Make network request for district settings
            dispatch(isLoadingChanged(true));
            const loginService = new LoginService();
            const response = await loginService.performLoginRequest(
              userName,
              decrypted_string,
              districtData.districtID
            );

            // Check for errors - if no errors, save DistrictData to global state
            if (
              response.error === undefined ||
              response.error == null ||
              response.error === ''
            ) {
              if (response.status === 'success') {                
                if (isSelected) {
                  dispatch(loginUserChanged(userName));                 
                } else {
                  dispatch(loginUserChanged(null));                 
                }
                dispatch(isLoadingChanged(false));
                dispatch(userDataChanged(response.userData));
                dispatch(authStateChanged(true));
                dispatch(hasFullAccessChanged(true));
              } else {
                Alert.alert('Invalid login', response.message);                                
              }
            } else {
              Alert.alert('Invalid Login', response.error);              
            }           
          } else {
            let instructionMessage = 'Use password to login for first time';
            Toast.show(instructionMessage, {
              mask: true,
              shadow: true,
              containerStyle: {
                backgroundColor: '#D8000C',
                borderRadius: 999,
                width: "auto",
              },
              textStyle: { fontSize: 14 },
            });                    
          }
          dispatch(isLoadingChanged(false));      
        } catch (responseError) {        
          dispatch(isLoadingChanged(false));
          Alert.alert('Unable to Authenticate User', responseError);
        }
      }
    }
  };

  // To change the district
  const navToDistrictChange = () => {
    dispatch(districtDataChanged(null));
  };

  return (
    <SafeAreaView
      style={[
        commonStyles.container,
        {
          backgroundColor: districtData?.primaryColor
            ? districtData?.primaryColor
            : '#ffffff',
        },
      ]}
    >
      <StatusBar style={"inverted"} />
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, height: wHeight - 70 }}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          ></View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={[
                commonStyles.txth1,
                {
                  color: invertColor(
                    districtData?.primaryColor
                      ? districtData?.primaryColor
                      : '#ffffff',
                    true
                  ),
                },
              ]}
            >
              Realtime
            </Text>
            <Text
              style={[
                commonStyles.txth2,
                {
                  color: invertColor(
                    districtData?.primaryColor
                      ? districtData?.primaryColor
                      : '#ffffff',
                    true
                  ),
                },
              ]}
            >
              Link for Staff
            </Text>
          </View>

          <View
            style={{
              flex: 3,

              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require('../../assets/images/loginimage.png')}
            ></Image>
          </View>

          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={[
                commonStyles.txth3,
                {
                  color: invertColor(
                    districtData?.primaryColor
                      ? districtData?.primaryColor
                      : '#ffffff',
                    true
                  ),
                },
              ]}
            >
              {districtData?.districtDisplayName}
            </Text>
          </View>

          <View style={{ flex: 1, marginLeft: '5%', marginRight: '5%' }}>
            <TextInput
              style={[
                commonStyles.txtInput,
                {
                  color: invertColor(
                    districtData?.primaryColor
                      ? districtData?.primaryColor
                      : '#ffffff',
                    true
                  ),
                  borderBottomColor: districtData?.secondaryColor
                    ? districtData?.secondaryColor
                    : '#000000',
                },
              ]}
              value={userName}
              maxLength={25}
              onChangeText={(username) => setUserName(username)}
              onSubmitEditing={() => ref_password.current.focus()}
              placeholder='Username'
              placeholderTextColor={invertColor(
                districtData?.primaryColor
                  ? districtData?.primaryColor
                  : '#ffffff',
                true
              )}
            ></TextInput>
            <Feather name='user' style={commonStyles.icon} />
          </View>

          <View style={{ flex: 1, marginLeft: '5%', marginRight: '5%' }}>
            <TextInput
              style={[
                commonStyles.txtInput,
                {
                  color: invertColor(
                    districtData?.primaryColor
                      ? districtData?.primaryColor
                      : '#ffffff',
                    true
                  ),
                  borderBottomColor: districtData?.secondaryColor
                    ? districtData?.secondaryColor
                    : '#000000',
                },
              ]}
              value={passWord}
              maxLength={25}
              ref={ref_password}
              onChangeText={(password) => setPassWord(password)}
              onSubmitEditing={() => onLoginButtonPress()}
              placeholder='Password'
              placeholderTextColor={invertColor(
                districtData?.primaryColor
                  ? districtData?.primaryColor
                  : '#ffffff',
                true
              )}
              autoCapitalize="none"
              secureTextEntry={true}
            ></TextInput>
            <Feather name='lock' style={commonStyles.icon} />
          </View>

          <View style={{ flex: 1, marginLeft: '3%', marginRight: '5%' }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-start",
                }}
              >
                {Platform.OS === "android" ? (
                  <CheckBox
                    color={isSelected ? districtData?.secondaryColor
                      ? districtData?.secondaryColor
                      : '#000000' : undefined}                  
                    style={commonStyles.CheckBox}
                    value={isSelected}
                    onValueChange={setSelection}
                  />
                ) : (
                  <Switch
                    style={commonStyles.remembermeSwitch}
                    trackColor={{
                      true: districtData?.secondaryColor
                        ? districtData?.secondaryColor
                        : '#000000',
                      false: districtData?.primaryColor
                        ? districtData?.primaryColor
                        : '#ffffff',
                    }}
                    thumbColor={
                      isSelected
                        ? invertColor(
                            districtData?.primaryColor
                              ? districtData?.primaryColor
                              : '#ffffff',
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
                    commonStyles.txtCheck,
                    {
                      color: invertColor(
                        districtData?.primaryColor
                          ? districtData?.primaryColor
                          : '#ffffff',
                        true
                      ),
                    },
                  ]}
                >
                  Remember Me
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "flex-end",
                }}
              >
                <Text                 
                  style={[
                    commonStyles.btnBiokit,
                    {
                      color: invertColor(
                        districtData?.primaryColor
                          ? districtData?.primaryColor
                          : '#ffffff',
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
            </View>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginLeft: '5%',
              marginRight: '5%',
            }}
          >
            <TouchableOpacity            
              activeOpacity={0.6}
              style={[
                commonStyles.btn,
                {
                  backgroundColor: districtData?.secondaryColor
                    ? districtData?.secondaryColor
                    : '#000000',
                },
              ]}
              onPress={() => onLoginButtonPress()}
            >
              <Text
                style={{
                  color: invertColor(
                    districtData?.secondaryColor
                      ? districtData?.secondaryColor
                      : '#000000',
                    true
                  ),
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              style={[
                commonStyles.btnChangedist,
                {
                  borderBottomColor: districtData?.secondaryColor
                    ? districtData?.secondaryColor
                    : '#000000',
                },
              ]}
              onPress={() => navToDistrictChange()}
            >
              <Text
                style={{
                  color: invertColor(
                    districtData?.primaryColor
                      ? districtData?.primaryColor
                      : '#ffffff',
                    true
                  ),
                }}
              >
                Change District
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}></View>

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              marginRight: 5,
              marginLeft: 5,
            }}
          >
            <Text
              style={[
                {
                  color: invertColor(
                    districtData?.primaryColor
                      ? districtData?.primaryColor
                      : '#ffffff',
                    true
                  ),
                  fontSize: 11,
                  textAlign: "center",
                },
              ]}
            >
              Realtime Information Technology. inc 2003-2021 All Rights Reserved
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
