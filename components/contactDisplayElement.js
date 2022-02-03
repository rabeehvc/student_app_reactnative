import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Picker } from 'react-native-woodpicker';
import { MaterialIcons } from '@expo/vector-icons';
import commonStyles from '../styles/commonStyles';

// requires a personName and a personID
// This allows us to re-use it for an employee vs a student, with different clickables.
class ContactDisplayElement extends Component {
  constructor(props) {
    super(props); // studentID, onContactSelected
    this.state = this.getInitialState();
  }

  componentDidMount = () => {
    this.loadContactsForStudent(this.props.studentID);
  };

  isLoadingChanged = (toValue) => {
    this.setState({ isLoading: toValue });
  };

  getUserData() {
    const { userData } = this.props;
    return userData;
  }

  loadContactsForStudent = (studentID) => {
    this.isLoadingChanged(true);
    this.props.loadContactFunction(this.props.studentID);
    this.isLoadingChanged(false);
  };

  getInitialState = () => {
    return {
      isLoading: true,
      selectedContactID: '',
    };
  };

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (prevProps.studentID != this.props.studentID) {
      this.setState(this.getInitialState());
      this.loadContactsForStudent(this.props.studentID);
    }
  };

  render() {
    if (this.state.isLoading == true) {
      return (
        <View style={styles.listItemContainer}>
          <Text>Loading</Text>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        {/* <RealtimeDropdownSelect
            label="Contact"
            data={this.props.contacts}
            value={this.state.selectedContactID}
            onChangeText={contactID => this.props.onContactSelected(contactID) }
        /> */}

        <Picker
          style={{
            borderBottomColor: '#D3D3D3',
            borderBottomWidth: 1,
            height: 30,
          }}
          item={this.state.selectedContactID}
          items={this.props.contacts}
          textInputStyle={{ fontSize: 13 }}
          onItemChange={this.props.onContactSelected}
          placeholder='-- Select Contact --'
          isNullable
        />
        <MaterialIcons name='keyboard-arrow-down' style={commonStyles.icon} />

        {/* <Picker
          // selectedValue={this.props.selectedAttendanceCode}
          selectedValue={this.state.selectedContactID}
          style={{
            height: 33,
          }}
          onValueChange={this.props.onContactSelected}
        >
          {this.props.contacts.map((item, index) => {
            return (
              <Picker.Item key={index} label={item.label} value={item.value} />
            );
          })}
        </Picker> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listItemContainer: {
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
  homeroomView: {
    paddingTop: 6,
  },
});

export default ContactDisplayElement;
