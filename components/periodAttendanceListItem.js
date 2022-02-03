import React, { Component, useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import realtimeStyles from '../constants/realtimeStyles';
import { Picker } from 'react-native-woodpicker';
import { DatePicker } from 'react-native-woodpicker';
import { TextInput } from 'react-native-gesture-handler';
import { invertColor } from '../functions/functions';
import { MaterialIcons, Feather } from '@expo/vector-icons';

const PeriodAttendanceListItem = (props) => {
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
    //NOT ENROLLED
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
    //DISABLED BUT SHOWING CURRENT PA VALUES
    if (!props.canEdit) {
      let attendanceCodeDisplay = '';
      props.attendanceCodes.forEach((attendanceCode) => {
        if (attendanceCode.value === props.selectedAttendanceCode.value) {
          attendanceCodeDisplay = attendanceCode.label;
        }
      });

      return (
        <View
          style={[
            realtimeStyles.w100,
            realtimeStyles.periodAttendanceFieldPadding,
          ]}
        >
          <View style={[realtimeStyles.rowSpaceBetween]}>
            <Text style={realtimeStyles.bold}>{attendanceCodeDisplay}</Text>
            <View style={realtimeStyles.row}>
              {props.transactionTime ? (
                <FontAwesome name='clock-o' size={24} />
              ) : null}
              <Text
                style={[
                  realtimeStyles.bold,
                  realtimeStyles.periodAttendanceStaticTransactionTime,
                ]}
              >
                {props.transactionTime}
              </Text>
            </View>
          </View>
          {props.comment ? <Text>{props.comment}</Text> : null}
        </View>
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
              realtimeStyles.periodAttendanceTimePickerDiv,
              { marginTop: Platform.OS == 'ios' ? 4 : 0 },
            ]}
          >
            <DatePicker
              style={{
                borderBottomColor: props.transactionColor
                  ? invertColor(props.transactionColor, true)
                  : 'black',
                borderBottomWidth: 0.6,
              }}
              mode='time'
              onDateChange={props.onDateChange}
              text={props.transactionTime ? props.transactionTime : 'Time'}
              textInputStyle={{
                fontSize: 13,
                color: props.transactionColor
                  ? invertColor(props.transactionColor, true)
                  : 'black',
              }}
              iosDisplay='inline'
              backdropAnimation={{ opacity: 0 }}
              androidMode='countdown'
              iosDisplay='spinner'
              androidDisplay='spinner'
            />
            <Feather
              name='clock'
              style={{
                top: Platform.OS == 'ios' ? 10 : 13,
                position: "absolute",
                right: 5,
                color: props.transactionColor
                  ? invertColor(props.transactionColor, true)
                  : 'black',
                fontSize: 15,
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
          flex: 0.7,
          borderBottomColor: props.transactionColor
            ? invertColor(props.transactionColor, true)
            : 'black',
          borderBottomWidth: 0.6,
          marginBottom: 15,
          marginTop: 5,
          justifyContent: "center",
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
            fontSize: 17,
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
            maxLength={50}
            placeholderTextColor={
              props.transactionColor
                ? invertColor(props.transactionColor, true)
                : 'black'
            }
            style={{
              borderBottomColor: props.transactionColor
                ? invertColor(props.transactionColor, true)
                : 'black',
              borderBottomWidth: 0.6,
              marginBottom: 5,
              marginTop: 5,
              color: props.transactionColor
                ? invertColor(props.transactionColor, true)
                : 'black',
              height: 30,
              fontSize:13
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
          { backgroundColor: props.transactionColor },
        ]}
      >
        {/* NAME AND ID */}
        <View style={[realtimeStyles.rowSpaceBetween, realtimeStyles.w100]}>
          {/* NAME */}
          <Text
            style={[
              {
                color: props.transactionColor
                  ? invertColor(props.transactionColor, true)
                  : 'black',
              },
              realtimeStyles.largeTextBold,
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
                {
                  color: props.transactionColor
                    ? invertColor(props.transactionColor, true)
                    : 'black',
                },
              ]}
            >
              ID :
            </Text>
            <Text
              style={[
                {
                  color: props.transactionColor
                    ? invertColor(props.transactionColor, true)
                    : 'black',
                },
                realtimeStyles.bold,
              ]}
            >
              {' '}
              {props.studentID}
            </Text>
          </View>
        </View>

        {/* PERIOD ATTENDANCE FORM */}
        {renderListItemContent()}
      </View>
      {/* <ListItemSeparator /> */}
    </View>
  );
};

export default PeriodAttendanceListItem;
