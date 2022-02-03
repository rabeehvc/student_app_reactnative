import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

class ReLogButton extends Component {
    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                style={[styles.submitButton, this.props.style]}
            >
                <Text style={styles.submitButtonText}>Log In Again for Full Access</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    submitButton: {
        height: 40,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        paddingHorizontal: 16,
        zIndex: 2,
        position: 'absolute',
        bottom: 12,
        width: '90%'
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16
    }
});

export default ReLogButton;
