import React from 'react';
import { Icon, ListItem } from 'react-native-elements';
import realtimeStyles from '../constants/realtimeStyles';
import { Text, View } from 'react-native';
import {
  disabledGray,
  realtimeBlue,
} from '../constants/realtimeStyleConstants';

const StudentProfileMenuItem = (props) => {
  return (
    <ListItem
        key={props.id}     
        containerStyle={realtimeStyles.studentProfileListStyle}
        titleStyle={[
          realtimeStyles.studentProfileListTitleStyle,
          props.disabled ? realtimeStyles.disabledText : null,
        ]}
        onPress={props.onPress}
        disabled={props.disabled}
      >
        <ListItem.Content style={{ flexDirection: "row", flex: 1 }}>
          <View style={{ flex: 2 }}>
            <Icon
              name={props.leftIconName}
              type='font-awesome'
              color={props.disabled ? disabledGray : realtimeBlue}
            />
          </View>
          <View style={{ flex: 9 , marginLeft:10}}>
            <Text>{props.title}</Text>
          </View>
        </ListItem.Content>
      </ListItem>
  )
}

export default StudentProfileMenuItem
