import React, { Component } from 'react';
import { Text, View } from 'react-native';
import HorizontalRule from './horizontalRule';
import realtimeStyles from '../../constants/realtimeStyles';
import { realtimeGreen } from '../../constants/realtimeStyleConstants';

class AppTitleText extends Component {
    render() {
        return (
            <View style={[realtimeStyles.appTitleContainer, this.props.style]}>
                <Text style={[realtimeStyles.appTitleText, realtimeStyles.white]}>Realtime Link</Text>
                <HorizontalRule width={166} color={realtimeGreen} />
                <Text style={[realtimeStyles.appSubTitleText, realtimeStyles.white]}>For Staff</Text>
            </View>
        );
    }
}

export default AppTitleText;
