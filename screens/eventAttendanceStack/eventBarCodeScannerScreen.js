import React, { useState, useEffect } from 'react';
import { Text, Alert, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useSelector, useDispatch } from 'react-redux';
import { isLoadingChanged } from '../../redux/app-redux';
import ValidateStudentExistsService from '../../services/validateStudentExistsService';
import commonStyles from '../../styles/commonStyles';

const eventBarCodeScannerScreen = ({ navigation, route }) => {
  const { districtData } = useSelector((state) => state);
  const { userData } = useSelector((state) => state);
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanningPaused, setIsScanningPaused] = useState(false);
  const dispatch = useDispatch()

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {    
    let studentID = data.replace(/\D/g,'');

    // this check is to ensure that the alert message isn't thrown multiple times -
    // due to the barcode scanner being executed multiple times while focused on the barcode.
    if (!isScanningPaused) {
      dispatch(isLoadingChanged(true))
      // make a network request to check if barcode scanned correlates to a valid studentid.
      // If so, send the user to the students profile screens. Otherwise, alert the user that the student is invalid.
      try {
        const studentExistsService = new ValidateStudentExistsService();
        const response = await studentExistsService.retrieveStudentExists(
          userData.sessionToken,
          studentID
        );

        dispatch(isLoadingChanged(false))
        if (!response.JWTIsValid) {
          return;
        }
        if (response.status === 'success') {
          
          if(route.params.navOrigin == 'EventAttendanceDetailScreen'){
            navigation.navigate({
              name: 'EventAttendanceDetailScreen',
              params: { studentID: studentID },
              merge: true,
            });
          }else{
            navigation.navigate({
              name: 'EventAttendanceDetailCheckpointScanScreen',
              params: { studentID: studentID },
              merge: true,
            });
          }
         
        } else {
          setIsScanningPaused(true);
          Alert.alert(
            'Invalid student',
            response.message,
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => setIsScanningPaused(false),
              },
            ],
            { cancelable: false }
          );
        }
      } catch (responseError) {
        dispatch(isLoadingChanged(false))
        Alert.alert('Error', responseError);
      }
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

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
      <BarCodeScanner
        onBarCodeScanned={isScanningPaused ? undefined : handleBarCodeScanned}        
        type={BarCodeScanner.Constants.Type.back}
        style={StyleSheet.absoluteFillObject}
      />
    </SafeAreaView>
  );
};

export default eventBarCodeScannerScreen;
