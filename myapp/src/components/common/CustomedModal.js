import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { modalChildren } from '../../store/app/middlewares';

const CustomedModal = () => {
    const dispatch = useDispatch();
    const { isShownModal } = useSelector((state) => state.app);
    const children = modalChildren.content;

    return (
        <>{isShownModal && <View style={styles.overlay}>{children}</View>}</>
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',

        padding: 16,
    },
});
