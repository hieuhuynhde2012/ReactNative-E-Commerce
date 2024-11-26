import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    Easing,
    withTiming,
    useSharedValue,
    useAnimatedStyle,
    withDelay,
} from 'react-native-reanimated';
import { useSelector, useDispatch } from 'react-redux';
import { setIsAlreadyShownIntro } from '../store/app/appSlice';

import { images } from '../../assets';

const INTROTIMETHRESHOLD = 1 * 1000;

const IntroScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { isLoggedIn, lastActiveTime } = useSelector((state) => state.user);
    const opacity = useSharedValue(0);

    useEffect(() => {
        opacity.value = withDelay(
            500,
            withTiming(1, {
                duration: 500,
                easing: Easing.ease,
            }),
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    useEffect(() => {
        const checkFirstTime = async () => {
            const currentTime = new Date().getTime();
            if (
                parseInt(currentTime) - parseInt(lastActiveTime) >
                INTROTIMETHRESHOLD
            ) {
                showIntroScreen();
            } else {
                skipIntroScreen();
            }
        };

        const showIntroScreen = () => {
            setTimeout(() => {
                if (isLoggedIn) {
                    navigation.replace('MainTab');
                    dispatch(
                        setIsAlreadyShownIntro({ isAlreadyShownIntro: true }),
                    );
                } else {
                    navigation.replace('Login');
                    dispatch(
                        setIsAlreadyShownIntro({ isAlreadyShownIntro: true }),
                    );
                }
            }, 1000);
        };

        const skipIntroScreen = () => {
            setTimeout(() => {
                if (isLoggedIn) {
                    navigation.replace('MainTab');
                    dispatch(
                        setIsAlreadyShownIntro({ isAlreadyShownIntro: true }),
                    );
                } else {
                    navigation.replace('Login');
                    dispatch(
                        setIsAlreadyShownIntro({ isAlreadyShownIntro: true }),
                    );
                }
            }, 200);
        };

        checkFirstTime();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.Image
                source={images.logo}
                style={[styles.logo, animatedStyle]}
            />
            <Animated.Text style={[styles.text, animatedStyle]}>
                Bring the world closer
            </Animated.Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        gap: 12,
    },

    logo: {
        width: '100%',
        resizeMode: 'contain',
    },
    text: {
        fontStyle: 'italic',
    },
});

export default IntroScreen;
