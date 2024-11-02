import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    Button,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

const CustomedAlert = ({ visible, onClose, children }) => {
    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>{children}</View>
        </Modal>
    );
};

export default CustomedAlert;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
