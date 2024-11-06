import { StyleSheet, View } from 'react-native';
import React from 'react';
import Lottie from 'lottie-react-native';
import { useSelector } from 'react-redux';

const CustomedLoading = () => {
    const { isLoading } = useSelector((state) => state.app);
    return (
        <>
            {isLoading && (
                <View style={styles.overlay}>
                    <Lottie
                        source={require('../../../assets/animations/loading.json')}
                        autoPlay
                        loop
                        style={{ width: 100, height: 100 }}
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
            )}
        </>
    );
};

export default CustomedLoading;

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
