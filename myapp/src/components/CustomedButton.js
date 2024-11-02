import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';

const CustomedButton = ({ title, handleOnPress = () => {} }) => {
    return (
        <>
            <TouchableOpacity style={styles.container} onPress={handleOnPress}>
                <Text style={styles.text}>{title}</Text>
            </TouchableOpacity>
        </>
    );
};

export default CustomedButton;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#ee3131',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 20,
    },
});
