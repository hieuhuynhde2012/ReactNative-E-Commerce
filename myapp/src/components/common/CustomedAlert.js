import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { hideAlert } from '../../store/app/appSlice';
import { alertCallback } from '../../store/app/middlewares';
import Ionicons from '@expo/vector-icons/Ionicons';

const CustomedAlert = () => {
    const {
        isShown,
        title,
        icon,
        message,
        onConfirmText,
        onCancelText,
        closable,
    } = useSelector((state) => state.app.alert);

    const dispatch = useDispatch();

    const handleOnCancel = () => {
        dispatch(hideAlert());
        if (alertCallback.onCancel) {
            alertCallback.onCancel();
        }
    };

    const handleOnConfirm = () => {
        dispatch(hideAlert());
        if (alertCallback.onConfirm) {
            alertCallback.onConfirm();
        }
    };

    return (
        <>
            {isShown && (
                <View style={styles.overlay}>
                    <View style={styles.alertBox}>
                        {closable && (
                            <TouchableOpacity
                                style={styles.clodeBtn}
                                onPress={() => {
                                    dispatch(hideAlert());
                                }}
                            >
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color="white"
                                />
                            </TouchableOpacity>
                        )}
                        {icon && (
                            <Ionicons name={icon} size={24} color="black" />
                        )}
                        {title && <Text style={styles.title}>{title}</Text>}

                        {message && (
                            <Text style={styles.message}>{message}</Text>
                        )}

                        <View style={styles.buttonContainer}>
                            {alertCallback.onCancel && (
                                <TouchableOpacity
                                    onPress={handleOnCancel}
                                    style={styles.cancelBtn}
                                >
                                    <Text style={styles.cancelBtnText}>
                                        {onCancelText}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                onPress={handleOnConfirm}
                                style={styles.confirmBtn}
                            >
                                <Text style={styles.confirmBtnText}>
                                    {onConfirmText}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </>
    );
};

export default CustomedAlert;

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        flex: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        animation: 'fade',
    },
    alertBox: {
        position: 'relative',
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        elevation: 5,
    },
    clodeBtn: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: '#ee3131',
        padding: 4,
        borderBottomLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#666',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 10,
        width: '100%',
    },
    cancelBtn: {
        padding: 10,
        borderRadius: 10,
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ee3131',
    },
    cancelBtnText: {
        color: 'white',
        fontWeight: 'bold',
    },
    confirmBtn: {
        padding: 10,
        borderRadius: 10,
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ee3131',
    },
    confirmBtnText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
