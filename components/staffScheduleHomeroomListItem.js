import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import realtimeStyles from '../constants/realtimeStyles';

const StaffScheduleListItem = (props) => {
  return (
    <TouchableOpacity
        onPress={props.onPress}
        disabled={props.disabled}
      >
        <View
          style={[
            realtimeStyles.staffScheduleHomeroomListItem,
            realtimeStyles.rowSpaceBetween,
          ]}
        >
          <Text style={[{ color: 'white', fontSize: 13 }]}>
            {props.courseTitle}
          </Text>
          <View style={realtimeStyles.rowFlexEnd}>
            <Text style={[realtimeStyles.staffScheduleListItemRoomLabelText]}>
              Room :{' '}
            </Text>
            <Text style={[realtimeStyles.staffScheduleListItemRoomLabelText]}>
              {props.room}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
  )
}

export default StaffScheduleListItem
