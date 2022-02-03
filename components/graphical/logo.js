import React, { Component } from 'react';
import { View, Image } from 'react-native';
import realtimeStyles from '../../constants/realtimeStyles';

const logoImage = require('../../assets/images/realtimeLogo.png');

class Logo extends Component {
    render() {
        return (
            <View style={this.props.style}>
                <Image style={realtimeStyles.logo} source={logoImage} />
            </View>
        );
    }
}

export default Logo;
