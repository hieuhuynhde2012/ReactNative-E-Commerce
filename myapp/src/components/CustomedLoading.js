import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Lottie from 'lottie-react-native';

const CustomedLoading = () => {
    return (
        <>
            <Lottie
                source={require('../../assets/animations/loading.json')}
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
        </>
    );
};

export default CustomedLoading;

const styles = StyleSheet.create({});
