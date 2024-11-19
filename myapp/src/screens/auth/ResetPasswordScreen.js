import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Keyboard,
} from 'react-native';
import CustomedInput from '../../components/CustomedInput';
import CustomedButton from '../../components/CustomedButton';
import logo from '../../../assets/logo.png';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { apiResetPassword } from '../../apis';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading, showAlert } from '../../store/app/appSlice';
import { validate } from '../../utils/helpers';

const ResetPasswordScreen = ({ navigation }) => {
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [isShowKeyboard, setIsShowKeyboard] = useState(true);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const dispatch = useDispatch();

    const [invalidFields, setInvalidFields] = useState([]);

    const handleLogin = async () => {
        const payload = { password, otp };
        const isValid = validate(payload, setInvalidFields);
        if (isValid > 0) {
            setPassword('');
            setOtp('');
            return;
        } else {
            try {
                dispatch(showLoading());
                const res = await apiResetPassword({
                    password,
                    token: otp,
                });
                dispatch(hideLoading());

                if (res.success) {
                    setPassword('');
                    setOtp('');
                    dispatch(
                        showAlert({
                            title: 'Password reset successful',
                            icon: 'shield-checkmark',
                            message:
                                'Awesome, your password has been reset successfully, please press OK to log into your account!',
                            onConfirm: () => navigation.navigate('Login'),
                        }),
                    );
                } else {
                    console.log('reset password failed', res.message);
                }
            } catch (error) {
                dispatch(hideLoading());
                dispatch(
                    showAlert({
                        title: 'Password reset failed',
                        icon: 'warning',
                        message:
                            'Your password has been failed to reset, please try again!',
                    }),
                );
            }
        }
    };

    useEffect(() => {
        const keyboardDidShow = Keyboard.addListener('keyboardDidShow', () =>
            setIsShowKeyboard(true),
        );
        const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () =>
            setIsShowKeyboard(false),
        );

        return () => {
            keyboardDidShow.remove();
            keyboardDidHide.remove();
        };
    }, []);

    const toggleIsShowPassword = () => {
        setIsShowPassword(!isShowPassword);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 10}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.innerContainer}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        bounces={isShowKeyboard}
                    >
                        <View style={styles.topContent}>
                            <Image style={styles.avatar} source={logo} />
                            <Text style={styles.title}>
                                Reset your password
                            </Text>
                        </View>
                        <View style={styles.midContent}>
                            <View style={styles.input}>
                                <CustomedInput
                                    LeftIcon={() => (
                                        <MaterialCommunityIcons
                                            name="lock-outline"
                                            size={24}
                                            color="#666"
                                        />
                                    )}
                                    placeholder="Enter your new password"
                                    value={password}
                                    onChangeText={setPassword}
                                    type={isShowPassword ? 'text' : 'password'}
                                    invalidFields={invalidFields}
                                    setInvalidFields={setInvalidFields}
                                    nameKey="password"
                                    RightIcon={() => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                toggleIsShowPassword();
                                            }}
                                        >
                                            {isShowPassword ? (
                                                <MaterialCommunityIcons
                                                    name="eye-off-outline"
                                                    size={24}
                                                    color="#666"
                                                />
                                            ) : (
                                                <MaterialCommunityIcons
                                                    name="eye-outline"
                                                    size={24}
                                                    color="#666"
                                                />
                                            )}
                                        </TouchableOpacity>
                                    )}
                                />
                                <CustomedInput
                                    LeftIcon={() => (
                                        <MaterialIcons
                                            name="password"
                                            size={24}
                                            color="#666"
                                        />
                                    )}
                                    placeholder="enter your otp"
                                    value={otp}
                                    onChangeText={setOtp}
                                    type="email"
                                    invalidFields={invalidFields}
                                    setInvalidFields={setInvalidFields}
                                    nameKey="otp"
                                />
                            </View>

                            <View style={styles.midBtn}>
                                <CustomedButton
                                    title="RESET PASSWORD"
                                    handleOnPress={handleLogin}
                                />
                            </View>
                        </View>
                        <View style={styles.bottomContent}>
                            <View style={styles.bottomFooter}>
                                <TouchableOpacity
                                    style={styles.bottomFooterBtnWrapper}
                                    onPress={() => navigation.navigate('Login')}
                                >
                                    <MaterialIcons
                                        name="keyboard-backspace"
                                        size={24}
                                        color="#ee3131"
                                    />
                                    <Text style={styles.bottomFooterBtn}>
                                        Back to log in
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: -20,
        backgroundColor: '#fff',
    },
    innerContainer: {
        padding: 20,
    },
    topContent: {
        alignItems: 'center',
    },
    avatar: {
        width: 200,
        objectFit: 'contain',
        marginBottom: 40,
    },
    title: {
        fontSize: 18,
        marginBottom: 40,
    },
    input: {
        gap: 20,
        marginBottom: 40,
    },
    midMessage: {
        alignItems: 'flex-end',
        marginBottom: 40,
    },
    midMessageText: {
        color: '#ee3131',
    },
    midBtn: {
        alignItems: 'center',
        marginBottom: 20,
    },
    bottomContent: {
        alignItems: 'center',
    },
    bottomFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    bottomFooterText: {
        fontSize: 18,
    },
    bottomFooterBtnWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    bottomFooterBtn: {
        color: '#ee3131',
        fontSize: 18,
    },
});

export default ResetPasswordScreen;
