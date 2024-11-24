import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Pressable,
    Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiEditAdditionalAddress } from '../apis';
import CustomedInput from '../components/CustomedInput';
import CustomedButton from '../components/CustomedButton';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import logo from '../../assets/logo.png';
import Ionicons from '@expo/vector-icons/Ionicons';
const EditAddressesScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const {
        id,
        name: initialName,
        houseNo: initialHouseNo,
        landmark: initialLandmark,
        street: initialStreet,
        country: initialCountry,
        mobileNo: initialMobileNo,
        postalCode: initialPostalCode,
    } = route.params;

    const [name, setName] = useState(initialName);
    const [houseNo, setHouseNo] = useState(initialHouseNo);
    const [landmark, setLandmark] = useState(initialLandmark);
    const [street, setStreet] = useState(initialStreet);
    const [country, setCountry] = useState(initialCountry);
    const [mobileNo, setMobileNo] = useState(initialMobileNo);
    const [postalCode, setPostalCode] = useState(initialPostalCode);

    const handleUpdateAddress = async () => {
        const updatedAddress = {
            ...(name !== initialName ? { name } : {}),
            ...(houseNo !== initialHouseNo ? { houseNo } : {}),
            ...(landmark !== initialLandmark ? { landmark } : {}),
            ...(street !== initialStreet ? { street } : {}),
            ...(country !== initialCountry ? { country } : {}),
            ...(mobileNo !== initialMobileNo ? { mobileNo } : {}),
            ...(postalCode !== initialPostalCode ? { postalCode } : {}),
        };

        if (Object.keys(updatedAddress).length === 0) {
            Alert.alert('No Changes', 'No updates to save.');
            navigation.goBack();
            return;
        }

        try {
            const response = await apiEditAdditionalAddress(id, {
                additionalAddress: updatedAddress,
            });
            if (response.success) {
                Alert.alert('Success', 'Address updated successfully!');
                navigation.goBack();
            } else {
                Alert.alert('Error', response.message || 'Update failed.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to update address. Please try again.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 36 : 10}
        >
            <View style={styles.searchBarContainer}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons
                        name="arrow-back-outline"
                        size={32}
                        color="black"
                    />
                </Pressable>
                <Pressable onPress={() => navigation.navigate('Home')}>
                    <Image style={styles.logo} source={logo} />
                </Pressable>
            </View>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.innerContainer}>
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        style={styles.addressContainer}
                    >
                        <View style={styles.topContent}>
                            <Text style={styles.title}>Edit your Address</Text>
                        </View>
                        <View style={styles.midContent}>
                            <View style={styles.input}>
                                <CustomedInput
                                    LeftIcon={() => (
                                        <AntDesign
                                            name="earth"
                                            size={24}
                                            color="#666"
                                        />
                                    )}
                                    placeholder="Enter your country"
                                    value={country}
                                    onChangeText={(text) => setCountry(text)}
                                    nameKey="country"
                                />

                                <CustomedInput
                                    LeftIcon={() => (
                                        <MaterialCommunityIcons
                                            name="account-outline"
                                            size={24}
                                            color="#666"
                                        />
                                    )}
                                    placeholder="Enter your name"
                                    value={name}
                                    onChangeText={(text) => setName(text)}
                                    nameKey="name"
                                />

                                <CustomedInput
                                    LeftIcon={() => (
                                        <MaterialCommunityIcons
                                            name="cellphone"
                                            size={24}
                                            color="#666"
                                        />
                                    )}
                                    placeholder="Enter your mobile number"
                                    value={mobileNo}
                                    onChangeText={(text) => setMobileNo(text)}
                                    nameKey="mobileNo"
                                />

                                <CustomedInput
                                    LeftIcon={() => (
                                        <FontAwesome5
                                            name="house-user"
                                            size={24}
                                            color="#666"
                                        />
                                    )}
                                    placeholder="Enter your house number"
                                    value={houseNo}
                                    onChangeText={(text) => setHouseNo(text)}
                                    nameKey="houseNo"
                                />

                                <CustomedInput
                                    LeftIcon={() => (
                                        <FontAwesome
                                            name="street-view"
                                            size={24}
                                            color="#666"
                                        />
                                    )}
                                    placeholder="Enter your street"
                                    value={street}
                                    onChangeText={(text) => setStreet(text)}
                                    nameKey="street"
                                />

                                <CustomedInput
                                    LeftIcon={() => (
                                        <MaterialCommunityIcons
                                            name="office-building-marker"
                                            size={24}
                                            color="#666"
                                        />
                                    )}
                                    placeholder="Eg near apollo, hospital"
                                    value={landmark}
                                    onChangeText={(text) => setLanmark(text)}
                                    nameKey="landmark"
                                />

                                <CustomedInput
                                    LeftIcon={() => (
                                        <Entypo
                                            name="location-pin"
                                            size={24}
                                            color="#666"
                                        />
                                    )}
                                    placeholder="Enter pincode"
                                    value={postalCode}
                                    onChangeText={(text) => setPostalCode(text)}
                                    nameKey="postalCode"
                                />
                            </View>

                            <View>
                                <CustomedButton
                                    title="Save Changes"
                                    handleOnPress={handleUpdateAddress}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default EditAddressesScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        // marginTop: -20,
        backgroundColor: '#fff',
    },
    addressContainer: {
        flexGrow: 1,
        backgroundColor: 'white',
    },
    innerContainer: {
        padding: 20,
    },
    searchBarContainer: {
        position: 'absolute',
        zIndex: 1,
        top: 40,
        left: 0,
        right: 0,
        backgroundColor: '#f0f0f0',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: -40,
    },
    logo: {
        width: 160,
        objectFit: 'contain',
    },
    addAddressHeader: {
        padding: 10,
        alignItems: 'center',
    },
    addAddressText: {
        fontSize: 18,
        marginBottom: 40,
    },
    addFieldInput: {
        padding: 10,
        borderColor: '#D0D0D0',
        borderWidth: 1,
        marginTop: 10,
        borderRadius: 5,
    },
    addField: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    addNameContainer: {
        marginVertical: 10,
    },
    addAddressButtonContainer: {
        backgroundColor: '#ee3131',
        padding: 19,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        height: 60,
    },
    addAddressButtonText: {
        fontWeight: 'bold',
        color: 'white',
    },
    topContent: {
        alignItems: 'center',
    },
    input: {
        gap: 20,
        marginBottom: 40,
    },

    midBtn: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        marginBottom: 40,
    },
});
