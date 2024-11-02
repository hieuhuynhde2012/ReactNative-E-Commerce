import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainTab from './MainTab';
import AuthStack from './AuthStack';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrent } from '../store/user/asyncAction';

const Stack = createStackNavigator();

const AppNavigation = () => {
    const dispatch = useDispatch();
    const { isLoggedIn, ...data } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getCurrent());
    }, [dispatch]);

    return (
        <Stack.Navigator>
            {isLoggedIn ? (
                <Stack.Screen
                    name="MainTab"
                    component={MainTab}
                    options={{ headerShown: false }}
                />
            ) : (
                <Stack.Screen
                    name="AuthStack"
                    component={AuthStack}
                    options={{ headerShown: false }}
                />
            )}
        </Stack.Navigator>
    );
};

export default AppNavigation;
