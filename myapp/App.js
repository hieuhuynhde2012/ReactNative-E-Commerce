import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from './src/navigation/AppNavigation';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store/redux';
import { ModalPortal } from 'react-native-modals';
import CustomedLoading from './src/components/common/CustomedLoading';
import CustomedAlert from './src/components/common/CustomedAlert';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

const App = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <AppContent />
            </PersistGate>
        </Provider>
    );
};

const AppContent = () => {
    return (
        <SafeAreaView style={styles.container}>
               
            <NavigationContainer>
                <CustomedLoading />
                <CustomedAlert />
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor="transparent"
                    translucent={true}
                />
                <AppNavigation />
            </NavigationContainer>
            <ModalPortal />
        </SafeAreaView>
    );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default App;
