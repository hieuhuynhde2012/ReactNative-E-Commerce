import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { apiCompleteRegister } from '../../apis/user';

const CompleteRegister = ({ route, navigation }) => {
    const { status } = route.params; // Nhận status từ params
    const [otp, setOtp] = useState('');

    const handleVerifyOtp = async () => {
        try {
            // Gọi API để xác thực mã OTP
            const response = await apiCompleteRegister(otp); // Gọi hàm API với mã OTP

            if (response.success) {
                // Nếu xác thực thành công, điều hướng tới trang đăng nhập
                navigation.navigate('Login');
            } else {
                // Nếu có lỗi, hiển thị thông báo "Something went wrong"
                Alert.alert('Error', 'Something went wrong. Please try again.');
            }
        } catch (error) {
            // Trong trường hợp xảy ra lỗi, hiển thị thông báo lỗi
            Alert.alert('Error', 'Something went wrong. Please try again.');
            console.error('Verification error:', error);
        }
    };

    const handleNavigate = () => {
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            {status === 'failed' ? (
                <>
                    <Text style={styles.message}>
                        Register failed. Please try again.
                    </Text>
                    <Button title="Go to Login" onPress={handleNavigate} />
                </>
            ) : (
                <>
                    <Text style={styles.message}>
                        Registration successful! Please check your email for
                        verification code.
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter OTP"
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="numeric"
                    />
                    <Button title="Verify OTP" onPress={handleVerifyOtp} />
                    {/* Không cần thêm nút chuyển đến Login ở đây */}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    message: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '80%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default CompleteRegister;
