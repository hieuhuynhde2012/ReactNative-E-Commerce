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
import { apiRegister, apiCompleteRegister } from '../../apis';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

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

    const handleSignup = async () => {
        if (
            email.trim() === '' ||
            password.trim() === '' ||
            firstname.trim() === '' ||
            lastname.trim() === '' ||
            mobile.trim() === ''
        ) {
            Alert.alert('', 'all fields are required', [{ text: 'OK' }]);
            setFirstname('');
            setLastname('');
            setMobile('');
            setEmail('');
            setPassword('');
            return;
        }
        try {
            const res = await apiRegister({
                email,
                firstname,
                lastname,
                password,
                mobile,
            });
            if (res.success) {
                setFirstname('');
                setLastname('');
                setMobile('');
                setEmail('');
                setPassword('');
                setIsVerifiedEmail(true);
            } else {
                setFirstname('');
                setLastname('');
                setMobile('');
                setEmail('');
                setPassword('');
                Alert.alert('', `${res.message}`, [{ text: 'OK' }]);
                console.log('signup failed', res);
            }
        } catch (error) {
            setFirstname('');
            setLastname('');
            setMobile('');
            setEmail('');
            setPassword('');
            Alert.alert('', `${error.message}`, [{ text: 'OK' }]);
            console.log('signup failed', error.message);
        }
    };

    const handleCompleteSignup = async () => {
        if (token.trim() === '') {
            Alert.alert('', 'registration code is required', [{ text: 'OK' }]);
            setToken('');
            return;
        } else {
            try {
                const res = await apiCompleteRegister(token);
                if (res.success) {
                    setToken('');
                    Alert.alert(
                        '',
                        `${res.message}, press "OK" to log into your account`,
                        [
                            {
                                text: 'OK',
                                onPress: () => navigation.navigate('Login'),
                            },
                        ],
                    );
                } else {
                    Alert.alert('', `${res.message}`, [{ text: 'OK' }]);
                    setToken('');
                }
            } catch (error) {
                Alert.alert('', `${error.message}`, [{ text: 'OK' }]);
                setToken('');
            }
        }
        setIsVerifiedEmail(false);
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
