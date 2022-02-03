import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RealtimeGenericErrorMessage = (props) => {
  return (
    <View style={styles.messageView}>
      <Text style={styles.messageText}>{props.message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageView: {
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    height: '100%',
  },
  messageText: {
    textAlign: "center",
    color: 'red',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default RealtimeGenericErrorMessage;
