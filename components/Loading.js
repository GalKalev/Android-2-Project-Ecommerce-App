import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Spinner from 'react-native-loading-spinner-overlay';

const Loading = ({loading}) => {
    return (
        <View style={styles.container}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    spinnerTextStyle: {
        color: '#FFF'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },

})

export default Loading