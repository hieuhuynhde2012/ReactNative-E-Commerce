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
import logo from '../../assets/logo.png';
import { apiRegister, apiCompleteRegister } from '../../apis';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading, showAlert } from '../../store/app/appSlice';
import { validate } from '../../utils/helpers';

const RegisterScreen = ({ navigation }) => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [isVerifiedEmail, setIsVerifiedEmail] = useState(false);
    const [isShowKeyboard, setIsShowKeyboard] = useState(true);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [invalidFields, setInvalidFields] = useState([]);

    const resetSignupData = () => {
        setFirstname('');
        setLastname('');
        setMobile('');
        setEmail('');
        setPassword('');
    };
    const dispatch = useDispatch();

    const handleSignup = async () => {
        const payload = { firstname, lastname, mobile, email, password };
        const isValid = validate(payload, setInvalidFields);

        if (isValid > 0) {
            resetSignupData();
            return;
        }
        try {
            dispatch(showLoading());
            const res = await apiRegister(payload);
            dispatch(hideLoading());

            if (res.success) {
                resetSignupData();
                setIsVerifiedEmail(true);
            } else {
                resetSignupData();
                dispatch(
                    showAlert({
                        title: 'Failed to sign up',
                        icon: 'warning',
                        message: `${res.message}`,
                    }),
                );
            }
        } catch (error) {
            dispatch(hideLoading());
            resetSignupData();
            dispatch(
                showAlert({
                    title: 'Failed to sign up',
                    icon: 'warning',
                    message: `${error.message}`,
                }),
            );
        }
    };

    const handleCompleteSignup = async () => {
        const payload = { token };
        const isValid = validate(payload, setInvalidFields);

        if (isValid > 0) {
            setToken('');
            return;
        } else {
            try {
                dispatch(showLoading());
                const res = await apiCompleteRegister(token);
                dispatch(hideLoading());

                if (res.success) {
                    setToken('');
                    dispatch(
                        showAlert({
                            title: 'Sign up successfully',
                            icon: 'shield-checkmark',
                            message: `${res.message}, press OK to log into your account`,
                            onConfirm: () => navigation.navigate('Login'),
                        }),
                    );
                } else {
                    dispatch(
                        showAlert({
                            title: 'Sign up failed',
                            icon: 'warning',
                            message: `${res.message} try again!`,
                            onConfirmText: 'Verify again',
                            onCancelText: 'Go back',
                            onCancel: () => setIsVerifiedEmail(false),
                        }),
                    );
                    setToken('');
                }
            } catch (error) {
                dispatch(hideLoading());
                dispatch(
                    showAlert({
                        title: 'Sign up failed',
                        icon: 'warning',
                        message: `${error.message} try again!`,
                        onConfirmText: 'Verify again',
                        conCancelText: 'Go back',
                        onCancel: () => setIsVerifiedEmail(false),
                    }),
                );
                setToken('');
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
                        {isVerifiedEmail ? (
                            <>
                                <View style={styles.topContent}>
                                    <Image
                                        style={styles.avatar}
                                        source={logo}
                                    />
                                    <Text style={styles.title}>
                                        Complete your registration
                                    </Text>
                                </View>
                                <View style={styles.midContent}>
                                    <View style={styles.input}>
                                        <CustomedInput
                                            LeftIcon={() => (
                                                <MaterialIcons
                                                    name="password"
                                                    size={24}
                                                    color="#666"
                                                />
                                            )}
                                            placeholder="Enter your registration code"
                                            value={token}
                                            onChangeText={setToken}
                                            invalidFields={invalidFields}
                                            setInvalidFields={setInvalidFields}
                                            nameKey="token"
                                        />
                                    </View>

                                    <View style={styles.midBtn}>
                                        <CustomedButton
                                            title="VERIFY"
                                            handleOnPress={handleCompleteSignup}
                                        />
                                    </View>
                                </View>
                            </>
                        ) : (
                            <>
                                <View style={styles.topContent}>
                                    <Image
                                        style={styles.avatar}
                                        source={logo}
                                    />
                                    <Text style={styles.title}>
                                        Sign up your Account
                                    </Text>
                                </View>
                                <View style={styles.midContent}>
                                    <View style={styles.input}>
                                        <CustomedInput
                                            LeftIcon={() => (
                                                <MaterialCommunityIcons
                                                    name="account-outline"
                                                    size={24}
                                                    color="#666"
                                                />
                                            )}
                                            placeholder="First name"
                                            value={firstname}
                                            onChangeText={setFirstname}
                                            invalidFields={invalidFields}
                                            setInvalidFields={setInvalidFields}
                                            nameKey="firstname"
                                        />
                                        <CustomedInput
                                            LeftIcon={() => (
                                                <MaterialCommunityIcons
                                                    name="account-outline"
                                                    size={24}
                                                    color="#666"
                                                />
                                            )}
                                            placeholder="Last name"
                                            value={lastname}
                                            onChangeText={setLastname}
                                            invalidFields={invalidFields}
                                            setInvalidFields={setInvalidFields}
                                            nameKey="lastname"
                                        />
                                        <CustomedInput
                                            LeftIcon={() => (
                                                <MaterialCommunityIcons
                                                    name="cellphone"
                                                    size={24}
                                                    color="#666"
                                                />
                                            )}
                                            placeholder="Mobile"
                                            value={mobile}
                                            onChangeText={(value) =>
                                                setMobile(value + '')
                                            }
                                            type="number"
                                            invalidFields={invalidFields}
                                            setInvalidFields={setInvalidFields}
                                            nameKey="mobile"
                                        />
                                        <CustomedInput
                                            LeftIcon={() => (
                                                <MaterialCommunityIcons
                                                    name="email-outline"
                                                    size={24}
                                                    color="#666"
                                                />
                                            )}
                                            placeholder="Email"
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
                                            type={
                                                isShowPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            invalidFields={invalidFields}
                                            setInvalidFields={setInvalidFields}
                                            nameKey="password"
                                            RightIcon={() => (
                                                <TouchableOpacity
                                                    onPress={
                                                        toggleIsShowPassword
                                                    }
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

                                    <View style={styles.midBtn}>
                                        <CustomedButton
                                            title="SIGN UP"
                                            handleOnPress={handleSignup}
                                        />
                                    </View>
                                </View>
                                <View style={styles.bottomContent}>
                                    <View style={styles.bottomFooter}>
                                        <Text style={styles.bottomFooterText}>
                                            Already have an account?
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() =>
                                                navigation.navigate('Login')
                                            }
                                        >
                                            <Text
                                                style={styles.bottomFooterBtn}
                                            >
                                                log in here!
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </>
                        )}
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

export default RegisterScreen;
