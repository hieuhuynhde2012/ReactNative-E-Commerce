import React, { useState, useContext } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CustomInput from '../components/CustomInput';
import { AuthContext } from '../context/AuthContext'; // Sử dụng AuthContext

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { login } = useContext(AuthContext); // Truy cập AuthContext

  const handleRegister = () => {
    // Logic đăng ký người dùng
    if (password === confirmPassword) {
      if (login(email, password)) {
        navigation.navigate('Login'); // Điều hướng đến Main sau khi đăng ký thành công
      }
    } else {
      alert('Passwords do not match');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/1/18/React_Native_Logo.png'}} 
        style={styles.image}
      />
      <Text style={styles.header}>Create New Account</Text>
      
      <CustomInput
        iconName="account-circle"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      
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
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 80,
    marginBottom: 20,
    borderRadius: 50
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