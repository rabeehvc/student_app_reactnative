import React, { useEffect, useState } from 'react';
import { StyleSheet, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { isLoadingChanged } from '../../redux/app-redux';
import { useSelector, useDispatch } from 'react-redux';
import ValidateStudentExistsService from '../../services/validateStudentExistsService';
import WarningContentMessage from '../../components/warningContentMessage';
import commonStyles from '../../styles/commonStyles';

const studentBarCodeScanner = ({ navigation, route }) => {
  const { districtData } = useSelector((state) => state);
  const { userData } = useSelector((state) => state);
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanningPaused, setIsScanningPaused] = useState(false);
  const [response, setResponse] = useState(null)
  const [studentID, setStudentID] = useState('')
  const dispatch = useDispatch();

  useEffect(() => {
    // grand the permission for barcode scanning
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(()=>{
    if(isScanningPaused){
      if (response.status === 'success') {              
        setIsScanningPaused(true);      
        navigation.navigate({
          name: 'StudentProfileScreen',
          params: {
            studentID: studentID,
            navigationOrigin: route.params.navigationOrigin,
            singleStudent: true,
            fromBarcodeScreen: true,
          },
        
        });
      } else {                         
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
    }

  },[isScanningPaused])

  const handleBarCodeScanned = async ({ type, data }) => {
    let studentID = data.replace(/\D/g, '');

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
        setStudentID(studentID)
        setResponse(response)        
        setIsScanningPaused(true);        
      } catch (responseError) {
        dispatch(isLoadingChanged(false))
        Alert.alert('Error', responseError);
      }
    }
  };

  if (hasPermission === null) {
    return <WarningContentMessage message='Requesting for camera permission' />;
  }
  if (hasPermission === false) {
    return <WarningContentMessage message='No access to camera' />;
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
      <StatusBar style="inverted" />
     
      <BarCodeScanner
        onBarCodeScanned={isScanningPaused ? undefined : handleBarCodeScanned}       
        type={BarCodeScanner.Constants.Type.back}
        style={StyleSheet.absoluteFillObject}
      />
    </SafeAreaView>
  );
};

export default studentBarCodeScanner;
