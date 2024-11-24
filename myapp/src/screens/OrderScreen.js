import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import React, { useEffect } from 'react';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

const OrderScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            navigation.replace('MainTab');
        }, 4000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <View style={styles.container}>
                <LottieView
                    source={require('../../assets/animations/cart_loading.json')}
                    style={{
                        height: 400,
                        width: 400,
                        alignSelf: 'center',
                        justifyContent: 'center',
                        marginTop: -86,
                    }}
                    autoPlay
                    loop={false}
                    speed={1}
                />
                <Text
                    style={{
                        marginTop: 0,
                        fontSize: 20,
                        fontWeight: '600',
                        textAlign: 'center',
                    }}
                >
                    Your Order Has been Placed
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default OrderScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
