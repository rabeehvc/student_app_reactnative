import React, { useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Platform,
} from 'react-native';
import { DatePicker, Picker } from 'react-native-woodpicker';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { invertColor } from '../functions/functions';
import realtimeStyles from '../constants/realtimeStyles';

const DailyAttendanceListItem = (props) => {
  useEffect(() => {
    setUseComment(props.comment);
  }, []);

  const [useComment, setUseComment] = useState(false);

  const onAddCommentButtonPress = () => {
    setUseComment(true);
  };

  const onRemoveCommentButtonPress = () => {
    setUseComment(false);
    props.onChangeComment('');
  };

  const renderListItemContent = () => {
    const disallowedDayTypes = ['F', 'H', 'I', 'S', 'V', 'W', '8'];
    // NOT ENROLLED
    if (disallowedDayTypes.includes(props.dayType.toString())) {
      return (
        <Text
          style={[
            realtimeStyles.red,
            realtimeStyles.bold,
            realtimeStyles.textLeft,
            realtimeStyles.w100,
            realtimeStyles.periodAttendanceFieldPadding,
          ]}
        >
          Attendance actions are unavailable for this student and date.
        </Text>
      );
    }

    // SHOW FORM FIELDS
    return (
      <View style={realtimeStyles.w100}>
        {/* ATTENDANCE CODE SELECT */}
        {renderAttendanceCodeAndTimeFields()}

        {/* COMMENT INPUT */}
        {renderCommentField()}
      </View>
    );
  };

  const renderAttendanceCodeAndTimeFields = () => {
    let hasTimeField = 0;
    props.attendanceCodes.forEach((attendanceCode) => {
      if (attendanceCode.value === props.selectedAttendanceCode.value) {
        hasTimeField = attendanceCode.requiresTime;
      }
    });

    if (hasTimeField) {
      return (
        <View style={realtimeStyles.rowSpaceBetween}>
          {renderAttendanceCodeDropdown()}
          <View
            style={[
              realtimeStyles.column,
              realtimeStyles.justifyContentCenter,
              realtimeStyles.periodAttendanceTimePickerDiv,
              { marginBottom: 15, marginTop: 5 },
            ]}
          >
            <DatePicker
              style={{
                borderBottomColor: props.transactionColor
                  ? invertColor(props.transactionColor, true)
                  : 'black',
                borderBottomWidth: 0.6,
                height: 30,
              }}
              textInputStyle={{
                fontSize: 13,
                color: props.transactionColor
                  ? invertColor(props.transactionColor, true)
                  : 'black',
              }}
              mode='time'
              onDateChange={props.onDateChange}
              text={props.transactionTime ? props.transactionTime : 'Time'}
              // is24Hour={true}
              iosDisplay='inline'
              backdropAnimation={{ opacity: 0 }}
              androidMode='countdown'
              iosDisplay='spinner'
              androidDisplay='spinner'
            />
            <Feather
              name='clock'
              style={{
                position: "absolute",
                right: 5,
                color: props.transactionColor
                  ? invertColor(props.transactionColor, true)
                  : 'black',
                fontSize: 17,
              }}
            />
          </View>
        </View>
      );
    }
    return renderAttendanceCodeDropdown();
  };

  const renderAttendanceCodeDropdown = () => {
    return (
      <View
        style={{
          flex: 0.6,
          borderBottomColor: props.transactionColor
            ? invertColor(props.transactionColor, true)
            : 'black',
          borderBottomWidth: 0.6,
          justifyContent: "center",
          marginBottom: 15,
          marginTop: 5,
        }}
      >
        <Picker
          style={{
            height: 30,
          }}
          textInputStyle={{
            fontSize: 13,
            color: props.transactionColor
              ? invertColor(props.transactionColor, true)
              : 'black',
          }}
          item={props.selectedAttendanceCode}
          items={props.attendanceCodes}
          onItemChange={props.onChangeAttendanceCode}
          isNullable
        />

        <MaterialIcons
          name='keyboard-arrow-down'
          style={{
            position: "absolute",
            right: 5,
            color: props.transactionColor
              ? invertColor(props.transactionColor, true)
              : 'black',
            fontSize: 23,
          }}
        />
      </View>
    );
  };

  const renderCommentField = () => {
    if (useComment) {
      return (
        <View>
          <TextInput
            placeholder='Comment'
            value={props.comment}
            onChangeText={props.onChangeComment}
            placeholderTextColor={
              props.transactionColor
                ? invertColor(props.transactionColor, true)
                : 'black'
            }
            maxLength={50}
            style={{
              height: 30,
              fontSize: 13,
              borderBottomColor: props.transactionColor
                ? invertColor(props.transactionColor, true)
                : 'black',
              borderBottomWidth: 0.6,
              marginBottom: 5,
              marginTop: 5,
              color: props.transactionColor
                ? invertColor(props.transactionColor, true)
                : 'black',
            }}
          />
          <TouchableOpacity onPress={onRemoveCommentButtonPress}>
            <Text
              style={[
                {
                  fontSize: 12,
                  marginTop: 5,
                  color: props.transactionColor
                    ? invertColor(props.transactionColor, true)
                    : 'black',
                },
                realtimeStyles.textRight,
              ]}
            >
              Remove Comment
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <TouchableOpacity onPress={onAddCommentButtonPress}>
        <Text
          style={[
            {
              fontSize: 12,
              marginTop: 5,
              color: props.transactionColor
                ? invertColor(props.transactionColor, true)
                : 'black',
            },
            realtimeStyles.textRight,
          ]}
        >
          Add Comment
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <View
        style={[
          {
            marginBottom: 10,
            borderColor: '#D3D3D3',
            borderWidth: 1,
            borderRadius: 6,
          },
          realtimeStyles.periodAttendanceListItemContainer,
          realtimeStyles.centeredFlexColumn,
          // realtimeStyles.w100,
          { backgroundColor: props.transactionColor },
        ]}
      >
        {/* NAME AND ID */}
        <View style={[realtimeStyles.rowSpaceBetween, realtimeStyles.w100]}>
          {/* NAME */}
          <Text
            style={[
              realtimeStyles.largeTextBold,
              {
                color: props.transactionColor
                  ? invertColor(props.transactionColor, true)
                  : 'black',
              },
            ]}
          >
            {props.studentName}
          </Text>
          {/* ID */}
          <View
            style={[
              realtimeStyles.row,
              realtimeStyles.periodAttendanceStudentIDView,
            ]}
          >
            <Text
              style={[
                realtimeStyles.studentListItemLabelText,
                {
                  color: props.transactionColor
                    ? invertColor(props.transactionColor, true)
                    : 'black',
                },
              ]}
            >
              ID:
            </Text>
            <Text
              style={[
                realtimeStyles.bold,
                {
                  color: props.transactionColor
                    ? invertColor(props.transactionColor, true)
                    : 'black',
                },
              ]}
            >
              {props.studentID}
            </Text>
          </View>
        </View>

        {/* PERIOD ATTENDANCE FORM */}
        {renderListItemContent()}
      </View>
    </View>
  );
};

export default DailyAttendanceListItem;
