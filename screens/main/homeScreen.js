import React, { useEffect, useState } from 'react';
import { Text, View, Alert, Image, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import {isLoadingChanged} from '../../redux/app-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Loader from '../../components/Loader';
import RetrieveStaffHeadlinesService from '../../services/retrieveStaffHeadlinesService';
import commonStyles from '../../styles/commonStyles';

const HomeScreen = () => {
  const [headlines, setHeadLines] = useState([]);
  const { districtData } = useSelector((state) => state);
  const { userData, isTab } = useSelector((state) => state);

  useEffect(() => {
    pullStaffHeadlines();
  }, []);

  // fetching the staff details and rendering to the header
  const pullStaffHeadlines = async () => {
    try {
      isLoadingChanged(true);
      const retrieveStaffHeadlinesService = new RetrieveStaffHeadlinesService();
      const response =
        await retrieveStaffHeadlinesService.performStaffHeadlinesRequest(
          userData.sessionToken,
          userData.locationID,
          districtData.districtID,
          userData.actualSchoolYear
        );
      isLoadingChanged(false);
      setHeadLines(response);
    } catch (responseError) {
      isLoadingChanged(false);
      Alert.alert('Unable to retrieve staff headlines data.', responseError);
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
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            zIndex: 999,
          }}
        >
          <View style={{ flex: 1, marginBottom: 10 }}></View>
          <View
            style={{
              flex: 2,
              backgroundColor: "white",
              width: '86%',
              alignSelf: "center",
              paddingLeft: 20,
              paddingRight: 20,
              borderRadius: 10,
              marginBottom: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={{
                width: isTab ? 170 : 130,
                height: isTab ? 170 : 130,
                borderRadius: 8,
                marginTop: 10,
                position: "absolute",
                top: isTab ? -90 : -70,
                left: isTab ? '39.5%' : '35%',
              }}
              source={require('../../assets/images/noimage.png')}
            ></Image>
            <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 70 }}>
              {userData?.firstName} {userData?.lastName}
            </Text>
            <Text style={{ opacity: 0.5, marginTop: 5, fontSize: 15 }}>
              {userData?.description}
            </Text>
            <Text style={{ opacity: 0.5, marginTop: 5, fontSize: 15 }}>
              {userData?.employeeID}
            </Text>
          </View>

          <View
            style={{
              flex: 5,
              backgroundColor: "white",
              width: '86%',
              alignSelf: "center",
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 10,
              paddingBottom: 10,
              borderRadius: 10,
              marginBottom: Platform.OS === 'ios' ? 0 : 20,
            }}
          >
            {headlines?.length == 0 ? (
              <Loader column={1} />
            ) : (
              <>
                <View
                  style={{
                    borderBottomColor: '#D3D3D3',
                    borderBottomWidth: 1,
                    padding: 8,
                  }}
                >
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {headlines[0]?.title}
                  </Text>
                </View>
                <View
                  style={{
                    padding: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                  }}
                >
                  <Text style={{ marginTop: 20, fontSize: 15 }}>
                    {headlines[0]?.details}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
        <View style={commonStyles.static_white_background}></View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
