import React, { useState, useEffect } from 'react';
import {
  Alert,
  Text,
  Image,
  TouchableOpacity,
  View,
  TextInput,
  Dimensions,
  LogBox
} from 'react-native';
import { useDispatch } from 'react-redux';
import { districtDataChanged, isLoadingChanged } from '../../redux/app-redux';
import { MaterialIcons } from '@expo/vector-icons';
import {
  KeyboardAwareScrollView,
  KeyboardAwareFlatList,
} from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-tiny-toast';
import DistrictDataLookupService from '../../services/districtDataLookupService';
import commonStyles from '../../styles/commonStyles';

const { height: wHeight } = Dimensions.get('window');

LogBox.ignoreLogs(['VirtualizedLists'])

const DistrictSearchScreen = ({ navigation, route }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [selectedValue, setSelectedValue] = useState({});
  const [searchKey, setSearchKey] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    setDistrictList(route.params?.districtsArray);
    dispatch(isLoadingChanged(false));
  }, []);

  // Search the district name typed in the textbox against the ditrictList array
  function filterDistrict(query) {
    setSearchKey(query);
    setSelectedValue('');
    // Method called every time when we change the value of the input
    if (query?.length > 3) {
      const newArray = districtList.filter((item) => {
        return (
          item.searchfield.toLowerCase().indexOf(query.toLowerCase()) === 0
        );
      });
      setSuggestions(newArray);
    } else {
      // If the query is null then return blank
      setSuggestions([]);
    }
  }

  // setting the district code while selecting the district from the dropdown list
  const onSelectDistrict = (district) => {
    setSelectedValue(district);
    setSearchKey(district.searchfield);
    setSuggestions([]);
  };

  // while clicking the Search button it will collect the district data and go to the lgin page
  const passDistData = async () => {
    // setBtnDisabled(true);
    
    let instructionMessage =
        'Please, start typing the name of your school district into the search bar, ';
      instructionMessage +=
        'check your spelling, then choose the your school district from the dropdown list.';
    if (!searchKey) {            
      Toast.show(instructionMessage, {
        mask: true,
        shadow: true,
        containerStyle: {
          backgroundColor: '#D8000C',
          borderRadius: 999,
          width: "auto",
        },
        textStyle: { fontSize: 13 },
      });
    } else {
      let localDistrictCode = selectedValue.districtcode;      
      if ( typeof(localDistrictCode) != 'undefined') {
        dispatch(isLoadingChanged(true));
        try {
          // Make network request for district settings
          const districtService = new DistrictDataLookupService(
            localDistrictCode
          );
          const response = await districtService.retrieveDistrictSettings();          
          
          // Check for errors - if no errors, save DistrictData to global state
          dispatch(isLoadingChanged(false));
          if (
            response.error === undefined ||
            response.error == null ||
            response.error === ''
          ) {
            const districtData = response.districtData;
            dispatch(isLoadingChanged(false));
            dispatch(districtDataChanged(districtData));
          } else {
            Alert.alert('Unable to Retrieve District Data', response.error);
          }
        } catch (responseError) {
          isLoadingChanged(false);
          Alert.alert('Unable to Retrieve District Data', responseError);
        }
      } else {
        Alert.alert('Invalid District Entered', instructionMessage);
      }
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <StatusBar style="inverted" />
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            flex: 1,
            height: wHeight,
          }}
        >
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
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
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
              <MaterialIcons name='arrow-back-ios' size={24} color='#ffffff' />
            </TouchableOpacity>
            <View style={{ flex: 6 }}>
              <Text style={commonStyles.txth1}>Realtime</Text>
              <Text style={commonStyles.txth2}>Link for Staff</Text>
            </View>
            <View style={{ flex: 2 }}></View>
          </View>
          <View
            style={{
              flex: 4,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require('../../assets/images/searchdistrictimg.png')}
            ></Image>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Text style={commonStyles.txth3}>Search for Districts</Text>
          </View>
          <View
            style={{
              flex: 2,
              marginLeft: '5%',
              marginRight: '5%',
              zIndex: 999,
            }}
          >
            <TextInput
              style={commonStyles.txtInput}
              placeholder='Enter District Name'
              placeholderTextColor='#ffffff'
              returnKeyType='next'
              returnKeyLabel='next'
              onChangeText={(distName) => filterDistrict(distName)}
              value={searchKey}
            />
            <Feather
              name='map-pin'
              style={{
                position: "absolute",
                right: 13,
                color: '#CCD1D8',
                fontSize: 20,
              }}
            />
            {suggestions && suggestions.length > 0 && (
              <KeyboardAwareFlatList
                data={suggestions}
                renderItem={({ item, index }) => {
                  return (
                    <View style={{ zIndex: 999 }}>
                      <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => onSelectDistrict(item)}
                      >
                        <Text variant='bodyText' style={{ marginBottom: 3 }}>
                          {item.searchfield}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                }}
                keyExtractor={(item) => item.districtcode}
                style={commonStyles.searchResultsContainer}
                extraData={searchKey}
                keyboardShouldPersistTaps="always"
                keyboardDismissMode="on-drag"
              />
            )}
          </View>

          <View
            style={{
              flex: 1,
              marginLeft: '5%',
              marginRight: '5%',
            }}
          >
            <TouchableOpacity
              style={commonStyles.btn}
              onPress={() => passDistData()}
            >
              <Text style={commonStyles.btnText}>Search</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flex: 2,
            }}
          >
                      
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default DistrictSearchScreen;

