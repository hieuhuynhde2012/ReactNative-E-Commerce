import { StyleSheet, Text, View, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

const CustomedInput = ({
    LeftIcon = null,
    type = '',
    placeholder = '',
    value = '',
    onChangeText = () => {},
    nameKey = '',
    invalidFields = [],
    setInvalidFields = () => {},
    editable = true,
    multiline = false,
    RightIcon = null,
}) => {
    return (
        <View style={styles.outerContainer}>
            {invalidFields?.some((item) => item.name === nameKey) && (
                <View style={styles.errorWrapper}>
                    <Ionicons name="warning" size={18} color="#ee3131" />
                    <Text style={styles.errorText}>
                        {
                            invalidFields?.find((item) => item.name === nameKey)
                                ?.message
                        }
                    </Text>
                </View>
            )}
            <View
                style={[
                    styles.container,
                    !editable && { borderColor: '#aaa' },
                    invalidFields.some((item) => item.name === nameKey) && {
                        borderColor: '#ee3131',
                    },
                ]}
            >
                {LeftIcon && <LeftIcon />}
                <TextInput
                    style={[
                        styles.input,
                        !editable && styles.unenabledInput,
                        multiline && { height: 160 },
                    ]}
                    placeholder={placeholder}
                    value={value}
                    keyboardType={type === 'number' ? 'numeric' : 'default'}
                    autoCorrect={type !== 'email'}
                    secureTextEntry={type === 'password'}
                    onChangeText={(value) => {
                        onChangeText(value);
                        setInvalidFields([]);
                    }}
                    editable={editable}
                    multiline={multiline}
                />
                {RightIcon && <RightIcon />}
            </View>
        </View>
    );
};

export default CustomedInput;

const styles = StyleSheet.create({
    outerContainer: {
        position: 'relative',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#666',
        borderRadius: 10,
        gap: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 16,
    },
    unenabledInput: {
        color: '#aaa',
    },
    errorWrapper: {
        position: 'absolute',
        top: -18,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: -14,
    },
    errorText: {
        color: '#ee3131',
    },
});
