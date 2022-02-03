import React, { Component } from 'react';
import { View } from 'react-native';
import realtimeStyles from '../../constants/realtimeStyles';

class ListItemSeparator extends Component {
    render() {
        return (
            <View style={realtimeStyles.simpleItemSeparator} />
        );
    }
}

export default ListItemSeparator;
