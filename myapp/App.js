import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from './src/navigation/AppNavigation';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store/redux';
import CustomedLoading from './src/components/common/CustomedLoading';
import CustomedAlert from './src/components/common/CustomedAlert';
import CustomedModal from './src/components/common/CustomedModal';
import { useSelector } from 'react-redux';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();

const App = () => {
    return (
        <Provider store={store}>
            <PersistGate
                loading={<Text>Loading...</Text>}
                persistor={persistor}
            >
                <AppContent />
            </PersistGate>
        </Provider>
    );
};

const AppContent = () => {
    const { isShownModalPortal } = useSelector((state) => state.app);
    return (
        <>
            <NavigationContainer>
                <SafeAreaView style={styles.container}>
                    <CustomedLoading />
                    <CustomedAlert />
                    <CustomedModal />
                    <StatusBar
                        barStyle="dark-content"
                        backgroundColor="transparent"
                        translucent={true}
                    />

                    <AppNavigation />
                </SafeAreaView>
            </NavigationContainer>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default App;
