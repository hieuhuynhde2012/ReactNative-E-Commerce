import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CompleteRegister from '../screens/CompleteRegister';
import { AuthContext } from '../context/AuthContext';
import MainTab from './MainTab';

const Stack = createStackNavigator();

const AuthStack = () => {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {user ? (
        <Stack.Screen name="Main" component={MainTab} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="CompleteRegister" component={CompleteRegister} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AuthStack;
