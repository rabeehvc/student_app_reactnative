import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WarningContentMessage = (props) => {
    return (
        <View style={styles.messageView}>
                <Text style={styles.messageText}>{props.message}</Text>
            </View>
    )
}

export default WarningContentMessage

const styles = StyleSheet.create({
    messageView: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '50%'
    },
    messageText: {
        fontSize: 16,
        color: 'gray'
    }
});

