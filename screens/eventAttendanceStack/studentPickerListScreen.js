import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoStudentsFoundMessage from '../../components/noStudentsFoundMessage';
import StudentListItem from '../../components/studentListItem';
import { invertColor } from '../../functions/functions';
import commonStyles from '../../styles/commonStyles';

const studentPickerListScreen = ({ navigation, route }) => {
  const [studentsData, setStudentsData] = useState([]);
  const [labelText, setLabelText] = useState([]);
  const [valueText, setValueText] = useState([]);
  const { districtData } = useSelector((state) => state);

  useEffect(() => {
    setStudentsData(route.params?.studentsArray);
    setLabelText(route.params?.labelText);
    setValueText(route.params?.valueText);
  }, []);

  const navigateToStudentProfileScreen = (item) => {
    navigation.navigate({
      name: 'EventAttendanceDetailScreen',
      params: {
        studentID: item.studentid,
        firstName: item.firstname,
        lastName: item.lastname,
      },
      merge: true,
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

            <View
              style={{
                flex: 6,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
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
                {labelText}
              </Text>
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
                {valueText}
              </Text>
            </View>

            <View
              style={{
                flex: 2,
                alignItems: "flex-start",
              }}
            ></View>
          </View>

          <View
            style={{
              flex: 9,
              backgroundColor: 'white',
              width: '86%',
              alignSelf: "center",
              borderRadius: 10,
              paddingLeft: 5,
              paddingRight: 5,
              marginTop: 10,
              marginBottom: 20,
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
        </View>

        <View style={commonStyles.static_white_background}></View>
      </View>
    </SafeAreaView>
  );
};

export default studentPickerListScreen;
