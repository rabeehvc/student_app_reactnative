import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { authStateChanged, isLoadingChanged } from './../redux/app-redux';
import realtimeStyles from '../constants/realtimeStyles';
// requires a personName and a personID
// This allows us to re-use it for an employee vs a student, with different clickables.

const StudentDetailButtonDisplay = (props) => {

  const selectStudentForCheckpointList = () => {
    props.onSelect(props.personID);
  };

  const renderRightDisplay = () => {
    return (
      <View
        style={[
          {
            flex: props.isTab ? 3 : 6,
            flexDirection: "column",
            justifyContent: "center",
          },
        ]}
      >
        <TouchableOpacity
          onPress={selectStudentForCheckpointList}
          style={[styles.submitButton, realtimeStyles.realtimeButtonBlue]}
        >
          <View style={realtimeStyles.centeredVertColumn}>
            <Text style={{ alignSelf: "flex-start" }}>
              {props.rightTopText}
            </Text>
            <Text>{props.rightBottomText}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, flexDirection: "row", padding: 12 }}>
        {/* Name and ID */}
        <View style={{ flex: 6 }}>
          {/* Name */}
          <Text style={realtimeStyles.largeTextBold}>
            {props.personName}
          </Text>
          {/* ID */}
          <View style={styles.studentIDView}>
            <Text
              style={[realtimeStyles.studentListItemLabelText, styles.idText]}
            >
              ID:
            </Text>
            <Text style={realtimeStyles.bold}>{props.personID}</Text>
          </View>
        </View>
        {/* Grade and HR */}
        {renderRightDisplay()}
      </View>
  )
}

const styles = StyleSheet.create({
  listItemContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 12,
  },
  idText: {
    paddingLeft: 1,
  },
  studentIDView: {
    flexDirection: "row",
    paddingTop: 6,
  },
  rightSectionView: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  checkpointButton: {
    backgroundColor: 'green',
    padding: 5,
  },
  submitButton: {
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
    borderRadius: 5,
    paddingHorizontal: 16,
  },
  submitButtonText: {
    color: 'black',
    fontSize: 16,
  },
});

const mapStateToProps = (state) => ({
  isAuthenticated: state.isAuthenticated,
  userData: state.userData,
});
export default connect(mapStateToProps, { authStateChanged, isLoadingChanged })(
  StudentDetailButtonDisplay
);
