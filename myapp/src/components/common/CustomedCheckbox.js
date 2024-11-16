import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomedCheckbox = ({
    isMultipleChoice = false,
    options = [],
    onOptionsChange = () => {},
    isResetOptions = false,
    onToggleResetOptions = () => {},
}) => {
    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        setSelectedOptions(options);
    }, []);

    useEffect(() => {
        if (isResetOptions) {
            const resetOptions = selectedOptions.map((option) => ({
                ...option,
                isActive: false,
            }));
            setSelectedOptions(resetOptions);
            onOptionsChange(resetOptions);
            onToggleResetOptions();
        }
    }, [
        isResetOptions,
        selectedOptions,
        onOptionsChange,
        onToggleResetOptions,
    ]);

    const handleMultipleOption = (option) => {
        const updatedOptions = selectedOptions.map((opt) =>
            opt.id === option.id ? { ...opt, isActive: !opt.isActive } : opt,
        );
        setSelectedOptions(updatedOptions);
        onOptionsChange(updatedOptions);
    };

    const handleSingleOption = (option) => {
        const updatedOptions = selectedOptions.map((opt) =>
            opt.id === option.id
                ? { ...opt, isActive: !opt.isActive }
                : { ...opt, isActive: false },
        );
        setSelectedOptions(updatedOptions);
        onOptionsChange(updatedOptions);
    };

    const toggleOption = (option) => {
        if (isMultipleChoice) {
            handleMultipleOption(option);
        } else {
            handleSingleOption(option);
        }
    };

    return (
        <View style={styles.container}>
            {options.length > 0 &&
                options.map((option) => (
                    <TouchableOpacity
                        key={option?.id}
                        style={[
                            styles.button,
                            option.isActive && styles.selectedButton,
                        ]}
                        onPress={() => toggleOption(option)}
                    >
                        <Text
                            style={[
                                option.isActive
                                    ? styles.activeButtonText
                                    : styles.buttonText,
                            ]}
                        >
                            {option.text}
                        </Text>
                    </TouchableOpacity>
                ))}
        </View>
    );
};

export default CustomedCheckbox;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    button: {
        padding: 10,
        margin: 5,
        borderRadius: 5,
        backgroundColor: 'lightgray',
    },
    selectedButton: {
        backgroundColor: '#ee3131',
    },
    buttonText: {
        color: 'black',
    },
    activeButtonText: {
        color: 'white',
    },
});
