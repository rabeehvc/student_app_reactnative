import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Snackbar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import NoStudentsFoundMessage from '../../components/noStudentsFoundMessage';
import StudentListItem from '../../components/studentListItem';
import { invertColor } from '../../functions/functions';
import commonStyles from '../../styles/commonStyles';

const studentListScreen = ({ navigation, route }) => {
  const [studentsData, setStudentsData] = useState([]);
  const [studentsCount, setStudentsCount] = useState('');
  const [navigationOrigin, setNavigationOrigin] = useState();
  const [snackBarIsVisible, setSnackBarIsVisible] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState(null);
  const isFocused = useIsFocused();
  const { districtData } = useSelector((state) => state);

  useEffect(() => {
    setStudentsData(route.params?.studentsArray);
    setStudentsCount(route.params?.valueText);
    setNavigationOrigin(route.params?.navigationOrigin);
  }, []);

  useEffect(() => {
    if (route.params?.message) {
      if (isFocused) {
        setSnackBarIsVisible(true);
        setSnackBarMessage(route.params?.message);
        route.params.message = null;
      }
    }
  }, [route.params?.message, isFocused]);

  const navigateToStudentProfileScreen = (item) => {
    navigation.navigate('StudentProfileScreen', {
      studentID: item.studentid,
      navigationOrigin: navigationOrigin,
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
                  flex: 4,
                  color: invertColor(
                    districtData?.primaryColor
                      ? districtData?.primaryColor
                      : '#ffffff',
                    true
                  ),
                },
              ]}
            >
              Students Found : {studentsCount}
            </Text>

            <View
              style={{
                alignItems: "flex-start",
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
              paddingLeft: 5,
              paddingRight: 5,
              marginTop: 10,
              marginBottom: Platform.OS === 'ios' ? 0 : 20,
            }}
          >
            {studentsData?.length > 0 ? (
              <FlatList
                data={studentsData}
                renderItem={({ item }) => (
                  <StudentListItem
                    onPress={() => navigateToStudentProfileScreen(item)}
                    studentName={`${item.firstname} ${item.lastname}`}
                    studentID={item.studentid.toString()}
                    grade={item.grade}
                    homeroom={item.homeroom}
                  />
                )}
                keyExtractor={(i) => i.studentid.toString()}
              />
            ) : (
              <NoStudentsFoundMessage message='No students found matching the search criteria.' />
            )}
          </View>

          <Snackbar
            duration={1500}
            visible={snackBarIsVisible}
            onDismiss={() => setSnackBarIsVisible(false)}
          >
            {snackBarMessage}
          </Snackbar>
        </View>
        <View style={commonStyles.static_white_background}></View>
      </View>
    </SafeAreaView>
  );
};

export default studentListScreen;
