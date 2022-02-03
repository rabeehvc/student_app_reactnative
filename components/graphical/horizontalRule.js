import React, { Component } from 'react';
import { View } from 'react-native';

class HorizontalRule extends Component {
    render() {
        return (
            <View style={[
                { borderBottomWidth: 1 },
                this.props.styles,
                {
                    borderBottomColor: this.props.color || 'black',
                    width: this.props.width || 40
                }]}
            />
        );
    }
}

export default HorizontalRule;
