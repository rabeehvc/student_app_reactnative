import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import StaffScheduleListItemDayCell from './staffScheduleListItemDayCell';
import realtimeStyles from '../constants/realtimeStyles';

const StaffScheduleListItem = (props) => {

  const [currentDay, setCurrentDay] = useState()
  const [currentDayIndex, setCurrentDayIndex] = useState()

  useEffect(() => {
    setCurrentDay(props.currentDay)   
    setCurrentDayIndex(new Date().getDay())
  }, [])

    // Compare the cell's daycode with the location's current day code
   const isCurrentDay = (dayCode) => {
      if (dayCode === currentDay) {
        return true;
      }
      return false;
    };
  
    // Compare the index of today's day of week with the cell's day of week
    const isCurrentDayIndex = (dayIndex) => {
      if (
        dayIndex === currentDayIndex &&
        currentDay.length < 1
      ) {
        return true;
      }
      return false;
    };
  
    renderDayCell = (dayCodeText, periodText, defaultDayText, dayIndex) => {
      // if we have a day code set up in the system for this day, display day cell with day code text
      if (dayCodeText != null) {
        return (
          <StaffScheduleListItemDayCell
            dayCodeText={dayCodeText}
            periodText={periodText}
            isCurrentDay={isCurrentDay(dayCodeText)}
          />
        );
      }
      // if we do not have a day code set up in the system for this day, but the course meets on this day,
      // display day cell with default day name (ie. Wed, Thurs, Fri)
      if (dayCodeText === null && periodText) {
        return (
          <StaffScheduleListItemDayCell
            dayCodeText={defaultDayText}
            periodText={periodText}
            isCurrentDay={isCurrentDayIndex(dayIndex)}
          />
        );
      }
      return null;
    };

  return (
    <View
        style={{
          borderColor: '#D3D3D3',
          borderWidth: 0.5,
          borderRadius: 10,
          padding: 10,
          marginBottom: 10,
          // borderBottomColor: '#D3D3D3',
          // borderBottomWidth: 1,
          // paddingBottom: 10,
        }}
      >
        <TouchableOpacity
          onPress={props.onPress}
          disabled={props.disabled}
        >
          {/* Schedule item details */}
          <View style={realtimeStyles.staffScheduleListItemDetailView}>
            <Text style={realtimeStyles.largeTextBold}>
              {props.courseTitle}
            </Text>
            <View style={realtimeStyles.rowSpaceBetween}>
              <Text style={realtimeStyles.staffScheduleCourseSectionText}>
                {props.courseSection}
              </Text>
              <View style={realtimeStyles.rowFlexEnd}>
                <Text style={realtimeStyles.staffScheduleListItemRoomLabelText}>
                  Room:{' '}
                </Text>
                <Text
                  style={[
                    realtimeStyles.bold,
                    { fontSize: 10, paddingBottom: 2 },
                  ]}
                >
                  {props.room}
                </Text>
              </View>
            </View>
          </View>
          {/* Row of day cells for weekly schedule */}
          <View style={realtimeStyles.staffScheduleListItemScheduleView}>
            {renderDayCell(
              props.altMondayCode,
              props.mDisplay,
              'Mon',
              1
            )}
            {renderDayCell(
              props.altTuesdayCode,
              props.tDisplay,
              'Tues',
              2
            )}
            {renderDayCell(
              props.altWednesdayCode,
              props.wDisplay,
              'Wed',
              3
            )}
            {renderDayCell(
              props.altThursdayCode,
              props.rDisplay,
              'Thurs',
              4
            )}
            {renderDayCell(
              props.altFridayCode,
              props.fDisplay,
              'Fri',
              5
            )}
            {renderDayCell(
              props.altSaturdayCode,
              props.sDisplay,
              'Sat',
              6
            )}
            {renderDayCell(
              props.altSundayCode,
              props.zDisplay,
              ' Sun',
              0
            )}
          </View>
        </TouchableOpacity>
      </View>
  )
}

export default StaffScheduleListItem


