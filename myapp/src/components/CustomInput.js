// components/CustomInput.js
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

const CustomInput = ({
    iconName,
    placeholder,
    secureTextEntry,
    value,
    onChangeText,
}) => {
    return (
        <View style={styles.inputContainer}>
            <Icon name={iconName} color="gray" size={20} style={styles.icon} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                value={value}
                onChangeText={onChangeText}
                autoCapitalize="none"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 40,
        fontSize: 16,
    },
});

export default CustomInput;
