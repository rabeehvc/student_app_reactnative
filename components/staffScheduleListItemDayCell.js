import React from 'react';
import { Text, View } from 'react-native';
import realtimeStlyes from '../constants/realtimeStyles';

const StaffScheduleListItemDayCell = (props) => {
    return (
        <View style={[
            realtimeStlyes.staffScheduleListItemdayView,
            realtimeStlyes.borderRight,
            (props.isCurrentDay) ? realtimeStlyes.currentDay : null,
            (!props.periodText) ? realtimeStlyes.disabled : null
        ]}
        >
            <Text style={realtimeStlyes.staffScheduleListItemDayCodeText}>{props.dayCodeText}</Text>
            <Text style={realtimeStlyes.staffScheduleListItemPeriodDisplayText}>{props.periodText}</Text>
        </View>
    )
}

export default StaffScheduleListItemDayCell

