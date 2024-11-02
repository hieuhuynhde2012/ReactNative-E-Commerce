import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomInput from '../components/CustomInput'; 
import { AuthContext } from '../context/AuthContext'; 

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext); 

  const handleLogin =  () => {
    if (login(email, password)) {
      navigation.navigate('Main')
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.image} />
      <Text style={styles.header}>Login In To Your Account</Text>
      
      <CustomInput iconName="account-circle" placeholder="Email" value={email} onChangeText={setEmail} />
      <CustomInput iconName="lock" placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.signupPrompt}>
        Don't have an account?  
        <Text 
          style={styles.signupLink} 
          onPress={() => navigation.navigate('Register')}
        >
          Sign up here
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start', padding: 20, backgroundColor: '#ffffff' },
  header: { fontSize: 24, textAlign: 'center', marginBottom: 50, marginTop: 50, fontWeight: 'bold' },
  image: { alignSelf: 'center', marginTop: 80, marginBottom: 20, width: 100, height: 100 },
  loginButton: { backgroundColor: 'red', paddingVertical: 10, borderRadius: 5, marginVertical: 10 },
  loginButtonText: { color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
  signupPrompt: { textAlign: 'center' },
  signupLink: { color: 'darkblue', fontWeight: 'bold' },
});

export default LoginScreen;
