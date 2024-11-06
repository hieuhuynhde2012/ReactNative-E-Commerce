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
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { apiForgotPassword } from '../../apis';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading, showAlert } from '../../store/app/appSlice';
import { validate } from '../../utils/helpers';

const EmailVerificationScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [isShowKeyboard, setIsShowKeyboard] = useState(true);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [invalidFields, setInvalidFields] = useState([]);
    const dispatch = useDispatch();

    const handleVerifyEmail = async () => {
        const payload = { email };
        const isValid = validate(payload, setInvalidFields);

        if (isValid > 0) {
            setEmail('');
            return;
        } else {
            try {
                dispatch(showLoading());
                const res = await apiForgotPassword({ email });
                dispatch(hideLoading());

                if (res.success) {
                    setEmail('');
                    navigation.navigate('ResetPassword');
                } else {
                    dispatch(
                        showAlert({
                            title: 'Failed to verify email',
                            icon: 'warning',
                            message:
                                'Your email is incorrect or not in our system, please try again!',
                        }),
                    );
                }
            } catch (error) {
                dispatch(hideLoading());
                setEmail('');
                dispatch(
                    showAlert({
                        title: 'Failed to verify email',
                        icon: 'warning',
                        message:
                            'Your email is incorrect or not in our system, please try again!',
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
                                Verify your email address
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
                            </View>

                            <View style={styles.midBtn}>
                                <CustomedButton
                                    title="VERIFY"
                                    handleOnPress={handleVerifyEmail}
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

export default EmailVerificationScreen;
