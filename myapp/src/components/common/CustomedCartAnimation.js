import { StyleSheet, View } from 'react-native';
import React from 'react';
import Lottie from 'lottie-react-native';

const CustomedCartAnimation = () => {
    return (
        <View style={styles.overlay}>
            <Lottie
                source={require('../../../assets/animations/cart_loading.json')}
                autoPlay
                loop
                style={{ width: 320, height: 320 }}
                colorFilters={[
                    {
                        keypath: 'button',
                        color: '#F00000',
                    },
                    {
                        keypath: 'Sending Loader',
                        color: '#F00000',
                    },
                ]}
            />
        </View>
    );
};

export default CustomedCartAnimation;

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
    },
});
