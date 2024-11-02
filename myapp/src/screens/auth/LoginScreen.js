import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Image,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Keyboard,
} from 'react-native';
import CustomedInput from '../../components/CustomedInput';
import CustomedButton from '../../components/CustomedButton';
import logo from '../../assets/logo.png';
import { apiLogin } from '../../apis';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useDispatch } from 'react-redux';
import { login } from '../../store/user/userSlice';
import { showLoading, hideLoading } from '../../store/app/appSlice';
import { validate } from '../../utils/helpers';
import CustomedLoading from '../../components/CustomedLoading';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isShowKeyboard, setIsShowKeyboard] = useState(true);
    const [isShowPassword, setIsShowPassword] = useState(false);

    const [invalidFields, setInvalidFields] = useState([]);

    const resetLoggedInData = () => {
        setEmail('');
        setPassword('');
    };

    const dispatch = useDispatch();

    const handleLogin = async () => {
        const payload = { email, password };
        const isValid = validate(payload, setInvalidFields);

        if (isValid > 0) {
            resetLoggedInData();
            return;
        }

        try {
            dispatch(showLoading(<CustomedLoading />));
            const res = await apiLogin({ email, password });
            dispatch(hideLoading());
            if (res.success) {
                resetLoggedInData();
                dispatch(
                    login({
                        isLoggedIn: true,
                        token: res.accessToken,
                    }),
                );
            } else {
                resetLoggedInData();
                Alert.alert('', `${res.message}`, [{ text: 'OK' }]);
            }
        } catch (error) {
            resetLoggedInData();
            dispatch(hideLoading());
            Alert.alert('', `${error.message}`, [{ text: 'OK' }]);
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
                                Login into your Account
                            </Text>
                        </View>
                        <View style={styles.midContent}>
                            <View style={styles.input}>
                                <CustomedInput
                                    LeftIcon={() => (
                                        <MaterialCommunityIcons
                                            name="email-outline"
                                            size={24}
                                            color="#666"
                                        />
                                    )}
                                    placeholder="email"
                                    value={email}
                                    onChangeText={setEmail}
                                    type="email"
                                    invalidFields={invalidFields}
                                    setInvalidFields={setInvalidFields}
                                    nameKey="email"
                                />
                                <CustomedInput
                                    LeftIcon={() => (
                                        <MaterialCommunityIcons
                                            name="lock-outline"
                                            size={24}
                                            color="#666"
                                        />
                                    )}
                                    placeholder="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    type={isShowPassword ? 'text' : 'password'}
                                    invalidFields={invalidFields}
                                    setInvalidFields={setInvalidFields}
                                    nameKey="password"
                                    RightIcon={() => (
                                        <TouchableOpacity
                                            onPress={toggleIsShowPassword}
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
                            </View>
                            <View style={styles.midMessage}>
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate(
                                            'EmailVerification',
                                        );
                                    }}
                                >
                                    <Text style={styles.midMessageText}>
                                        Forgot password?
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.midBtn}>
                                <CustomedButton
                                    title="LOG IN"
                                    handleOnPress={handleLogin}
                                />
                            </View>
                        </View>
                        <View style={styles.bottomContent}>
                            <View style={styles.bottomFooter}>
                                <Text style={styles.bottomFooterText}>
                                    Don't have an account?
                                </Text>
                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate('Register')
                                    }
                                >
                                    <Text style={styles.bottomFooterBtn}>
                                        sign up here!
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
        marginTop: -40,
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
        marginBottom: 6,
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
    bottomFooterBtn: {
        color: '#ee3131',
        fontSize: 18,
    },
});

export default LoginScreen;
