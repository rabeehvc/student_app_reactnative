import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NoStudentsFoundMessage = (props) => {
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
    marginLeft:5,
    marginRight:5,    
    fontSize: 14,
  },
});

export default NoStudentsFoundMessage;
