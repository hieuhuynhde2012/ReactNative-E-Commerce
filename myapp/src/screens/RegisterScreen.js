import React, { useState, useContext } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CustomInput from '../components/CustomInput';
import { AuthContext } from '../context/AuthContext'; // Sử dụng AuthContext
import { apiRegister } from '../apis';

const RegisterScreen = ({ navigation }) => {
  //const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstname, setFirstname] = useState('');  // Thêm firstname
  const [lastname, setLastname] = useState('');    // Thêm lastname
  const [mobile, setMobile] = useState('');        // Thêm mobile
  const { register } = useContext(AuthContext);    // Thêm register vào AuthContext

  const handleRegister = async () => {
    try {
      // Kiểm tra các trường đầu vào
      if (!email || !password || !firstname || !lastname || !mobile) {
        alert('Please fill in all fields');
        return;
      }
  
      if (password === confirmPassword) {
        // Gọi API với email, password, và các thông tin khác
        const response = await apiRegister({ email, password, firstname, lastname, mobile });
        
        // Kiểm tra phản hồi từ API
        console.log('API Response:', response);
        
        if (response.success) {
          navigation.navigate('CompleteRegister', { status: 'succeed' });
        } else {
          alert('Registration failed: ' + response.message);
        }
      } else {
        alert('Passwords do not match');
      }
    } catch (error) {
      // Kiểm tra lỗi có phản hồi hay không
      if (error.response) {
        // Lỗi phía server trả về
        console.error('Register error (server):', error.response.data);
        alert('Server error: ' + error.response.data.message);
      } else if (error.request) {
        // Lỗi khi không có phản hồi từ server
        console.error('Register error (no response):', error.request);
        alert('No response from server. Please check your connection.');
      } else {
        // Lỗi phát sinh ở client
        console.error('Register error (client):', error.message);
        alert('An error occurred: ' + error.message);
      }
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')} // Đường dẫn tới hình ảnh logo
        style={styles.image}
      />
      <Text style={styles.header}>Create New Account</Text>

      {/* <CustomInput
        iconName="account-circle"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      /> */}
      
      <CustomInput
        iconName="email"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      
      <CustomInput
        iconName="lock"
        placeholder="Enter password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      <CustomInput
        iconName="lock"
        placeholder="Confirm password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <CustomInput
        iconName="account-box"
        placeholder="First Name"
        value={firstname}
        onChangeText={setFirstname}
      />

      <CustomInput
        iconName="account-box"
        placeholder="Last Name"
        value={lastname}
        onChangeText={setLastname}
      />

      <CustomInput
        iconName="phone"
        placeholder="Mobile Number"
        value={mobile}
        onChangeText={setMobile}
      />

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? Login here</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
  },
  image: {
    alignSelf: 'center',
    marginTop: 80,
    marginBottom: 20,
  },
  registerButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  registerButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  loginText: {
    color: 'darkblue',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RegisterScreen;
