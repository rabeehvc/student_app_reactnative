import React, { useState, useEffect } from 'react';
import {
  Alert,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { districtDataChanged, isLoadingChanged } from '../../redux/app-redux';
import Toast from 'react-native-tiny-toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import DistrictDataLookupService from '../../services/districtDataLookupService';
import commonStyles from '../../styles/commonStyles';

const { height: wHeight } = Dimensions.get('window');

const DistrictCodeScreen = ({ navigation }) => {
  const [districtCode, setDistrictCode] = useState();

  //code field parameters
  const CELL_COUNT = 4;
  const ref = useBlurOnFulfill({ value: districtCode, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    setValue: districtCode,
    setDistrictCode,
  });

  const dispatch = useDispatch();

  useEffect(() => {}, []);

  // While clicking the enter district button it will checkup the district code is valid and goes to the login page if it is valid
  const onSubmit = async () => {
    if (typeof districtCode == 'undefined') {
      Toast.show('Please, make sure you have entered 4 digits.', {
        mask: true,
        shadow: true,
        containerStyle: {
          backgroundColor: '#D8000C',
          borderRadius: 999,
          width: "auto",
        },
        textStyle: { fontSize: 14 },
      });
      return;
    }
    if (districtCode.length === 4) {
      dispatch(isLoadingChanged(true));      
      try {

        // Make network request for district settings
        const districtService = new DistrictDataLookupService(districtCode);
        const response = await districtService.retrieveDistrictSettings();

        // Check for errors - if no errors, save DistrictData to global state
        isLoadingChanged(false);
        if (
          response.error === undefined ||
          response.error == null ||
          response.error === ''
        ) {
          dispatch(isLoadingChanged(false));  
          const districtDataRes = response.districtData;
          if (typeof districtDataRes == "object") {
            dispatch(districtDataChanged(districtDataRes));  
          } 
        } else {
          Alert.alert('Unable to Retrieve District Data', response.error);         
        }
      } catch (responseError) {                
        Alert.alert('Unable to Retrieve District Data', responseError);
      }
      dispatch(isLoadingChanged(false));   
    } else {
      Alert.alert(
        'Invalid District Code',
        'Please, make sure you have entered 4 digits.'
      );     
    }
  };

  // Navigate to the district search screen
  const onDistrictSearchPress = async () => {
    dispatch(isLoadingChanged(true));
    try {      

      // Make network request for district settings      
      const districtService = new DistrictDataLookupService();
      const response =
        await districtService.performRetrieveDistrictListRequest();

      // Check for errors     
      if (
        response.error === undefined ||
        response.error == null ||
        response.error === ''
      ) {
        if (response.status === 'success') {
          dispatch(districtDataChanged(null));
          dispatch(isLoadingChanged(false));
          navigation.navigate('DistrictSearchScreen', {
            districtsArray: response.districts,
          });
        } else {
          Alert.alert('Unable to Retrieve District Data');
        }
      } else {
        Alert.alert('Unable to Retrieve District Data', response.error);
      }      
    } catch (responseError) {     
      Alert.alert('Unable to Retrieve District Data', responseError);
    }
    dispatch(isLoadingChanged(false));
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <StatusBar style={"inverted"} />     
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, height: wHeight }}>
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
            <Text style={commonStyles.txth1}>Realtime</Text>
            <Text style={commonStyles.txth2}>Link for Staff</Text>
          </View>

          <View
          style={{
              flex: 4,justifyContent: "center",
              
              alignItems: "center",
            }}
          >
            <Image
              source={require('../../assets/images/districtcodeimg.png')}
            ></Image>
          </View>

          <View
            style={{
              flex: 0.5,
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Text style={commonStyles.txth3}>Enter a School District Code</Text>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >          
            <CodeField
              onSubmitEditing={() => onSubmit()}
              ref={ref}
              {...props}
              value={districtCode}
              onChangeText={(districtCode) => {
                setDistrictCode(districtCode);
              }}
              cellCount={CELL_COUNT}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({ index, symbol, isFocused }) => (
                <View
                  key={index}
                  style={[
                    commonStyles.cellroot,
                    isFocused && commonStyles.focusCellroot,
                  ]}
                >
                  <Text
                    key={index}
                    style={commonStyles.cell}
                    onLayout={getCellOnLayoutHandler(index)}
                  >
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                </View>
              )}
            />
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
              style={commonStyles.btn}
              onPress={() => onSubmit()}
            >
              <Text style={commonStyles.btnText}>Enter District</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flex: 2,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              marginLeft: '5%',
              marginRight: '5%',
            }}
          >
            <Text style={commonStyles.txtQuestian}>
              Don't know your district code?
            </Text>
            <TouchableOpacity
              activeOpacity={0.6}
              style={commonStyles.btnBorder}
              onPress={() => onDistrictSearchPress()}
            >
              <Text style={commonStyles.btntxtSearch}>
                Search District Name
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flex: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          ></View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default DistrictCodeScreen;
