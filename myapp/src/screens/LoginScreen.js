import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomInput from '../components/CustomInput'; // Import CustomInput
import { apiLogin } from '../apis/user'; // Import apiLogin từ user.js
import { AuthContext } from '../context/AuthContext';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user } = useContext(AuthContext);

  // Hàm xử lý khi người dùng nhấn login
  const handleLogin = () => {
    // Kiểm tra nếu người dùng trong AuthContext có tồn tại
    if (user) {
      // So sánh email và password với giá trị trong AuthContext
      if (email === user.email && password === user.password) {
        // Điều hướng đến màn hình chính nếu đăng nhập thành công
        navigation.navigate('Main');
      } else {
        // Thông báo nếu email hoặc password không đúng
        Alert.alert('Login failed', 'Invalid email or password');
      }
    } else {
      // Nếu không có user trong AuthContext (không có người dùng mặc định)
      Alert.alert('Login failed', 'No user found');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')} // Thay đổi đường dẫn tới hình ảnh của bạn
        style={styles.image}
      />
      <Text style={styles.header}>Login In To your Account</Text>
      
      <CustomInput
        iconName="account-circle"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      
      <CustomInput
        iconName="lock"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      <View style={styles.rowContainer}>
          <Text style={styles.keepMeLoggedIn}>Keep me logged in</Text>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </View>
      
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* <Text style={styles.orLogin}>Or login with</Text>

      <View style={styles.socialLoginContainer}>
        <Image
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/600px-2023_Facebook_icon.svg.png' }}
          style={styles.socialIcon}
        />
        <Image
          source={{ uri: 'https://cdn2.hubspot.net/hubfs/53/image8-2.jpg' }}
          style={styles.socialIcon}
        />
      </View> */}

      <Text style={styles.signupPrompt}>
        Don't have an account?  
        <Text 
          style={styles.signupLink} 
          onPress={() => navigation.navigate('Register')} // Điều hướng đến RegisterScreen
        >
           Sign up here
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 50,
    marginTop: 50
  },
  image: {
    alignSelf: 'center',
    marginTop: 80,
    marginBottom: 20,
  },
  forgotPassword: {
    color: 'red',
    textAlign: 'right',
    marginVertical: 10,
    fontSize: 16
  },
  orLogin: {
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  socialIcon: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
  },
  signupPrompt: {
    textAlign: 'center',
  },
  signupLink: {
    color: 'darkblue',
  },
  loginButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  loginButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  rowContainer: {
    flexDirection: 'row', // Bố trí các phần tử trong cùng một hàng
    justifyContent: 'space-between', // Tạo khoảng cách giữa các phần tử
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 50
  },
  keepMeLoggedIn: {
    marginLeft: 8, // Tạo khoảng cách giữa Switch và Text
    fontSize: 16,
    textAlign: 'left'
  },
});

export default LoginScreen;
