import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import ListItemSeparator from './graphical/listItemSeparator';
import realtimeStyles from '../constants/realtimeStyles';

const StudentListItem = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress}>
        <View style={styles.listItemContainer}>
            {/* Name and ID */}
            <View style={realtimeStyles.flexGrow}>
                {/* Name */}
                <Text style={realtimeStyles.largeTextBold}>{props.studentName}</Text>
                {/* ID */}
                <View style={styles.studentIDView}>
                    <Text style={[realtimeStyles.studentListItemLabelText, styles.idText]}>ID:</Text>
                    <Text style={realtimeStyles.bold}>{props.studentID}</Text>
                </View>
            </View>
            {/* Grade and HR */}
            <View style={realtimeStyles.centeredVertColumn}>
                {/* Grade */}
                <View style={styles.rightSectionView}>
                    <Text style={realtimeStyles.studentListItemLabelText}>Grade:</Text>
                    <Text style={realtimeStyles.bold}>{props.grade}</Text>
                </View>
                {/* HR */}
                <View style={[styles.rightSectionView, styles.homeroomView]}>
                    <Text style={realtimeStyles.studentListItemLabelText}>Homeroom:</Text>
                    <Text style={realtimeStyles.bold}>{props.homeroom}</Text>
                </View>
            </View>
        </View>
        <ListItemSeparator />
    </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    listItemContainer: {
        flexDirection: 'row',
        padding: 12
    },
    idText: {
        paddingLeft: 1
    },
    studentIDView: {
        flexDirection: 'row',
        paddingTop: 6
    },
    rightSectionView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    homeroomView: {
        paddingTop: 6
    }
});

export default StudentListItem;
