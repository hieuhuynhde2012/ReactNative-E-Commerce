import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { modalChildren } from '../../store/app/middlewares';
import { hideModal } from '../../store/app/appSlice';

const CustomedModal = () => {
    const dispatch = useDispatch();
    const { isShownModal, backdropClosable } = useSelector(
        (state) => state.app.modal,
    );
    const children = modalChildren.content;
    const timeoutIdRef = useRef(null);

    useEffect(() => {
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = null;
        }
    }, []);

    useEffect(() => {
        timeoutIdRef.current = setTimeout(() => {
            if (isShownModal && backdropClosable) {
                dispatch(hideModal());
            }
        }, 600);

        return () => {
            clearTimeout(timeoutIdRef.current);
        };
    }, [isShownModal, backdropClosable, dispatch]);

    return (
        <>
            {isShownModal &&
                (backdropClosable ? (
                    <TouchableWithoutFeedback
                        onPress={() => {
                            dispatch(hideModal());
                        }}
                    >
                        <View style={styles.overlay}>
                            <TouchableWithoutFeedback>
                                <View>{children}</View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                ) : (
                    <View style={styles.overlay}>{children}</View>
                ))}
        </>
    );
};

export default CustomedModal;

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',

        padding: 16,
    },
});
