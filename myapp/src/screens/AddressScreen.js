import React, { useState } from "react";
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
} from "react-native";
import { apiAddAdditionalAddress } from "../apis";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomedInput from "../components/CustomedInput";
import CustomedButton from "../components/CustomedButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
const AddressScreen = () => {
  const navigation = useNavigation();
  const [country, setCountry] = useState("");
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLanmark] = useState("");
  const [postalCode, setPostalCode] = useState("");
  

  const handleAddAddress = async () => {
    if (!name || !mobileNo) {
      Alert.alert("Error", "Full name and mobile number are required.");
      return;
    }
    const address = {
      country,
      name,
      mobileNo,
      houseNo,
      street,
      landmark,
      postalCode,
    };

    try {
      const response = await apiAddAdditionalAddress({
        additionalAddress: address,
      });
      if (response.success) {
        Alert.alert("Success", "Address added successfully!");
        setCountry("");
        setName("");
        setMobileNo("");
        setHouseNo("");
        setStreet("");
        setLanmark("");
        setPostalCode("");

        setTimeout(() => {
          navigation.goBack();
        }, 500);
      } else {
        Alert.alert(
          "Error",
          response.data ? response.data.updatedUser : "Unknown error"
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to add address. Please try again.");
    }
  };
  return (
    <SafeAreaView style={{flex: 1, zIndex: 30000}}>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 10}
    >
      <View style={styles.addressBlock} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsHorizontalScrollIndicator={false}
            style={styles.addressContainer}
          >
            <View style={styles.topContent}>
              <Text style={styles.title}>Add a new Address</Text>
            </View>
            <View style={styles.midContent}>
              <View style={styles.input}>
                <CustomedInput
                  LeftIcon={() => (
                    <AntDesign name="earth" size={24} color="#666" />
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
                    <FontAwesome5 name="house-user" size={24} color="#666" />
                  )}
                  placeholder="Enter your house number"
                  value={houseNo}
                  onChangeText={(text) => setHouseNo(text)}
                  nameKey="houseNo"
                />

                <CustomedInput
                  LeftIcon={() => (
                    <FontAwesome name="street-view" size={24} color="#666" />
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
                    <Entypo name="location-pin" size={24} color="#666" />
                  )}
                  placeholder="Enter pincode"
                  value={postalCode}
                  onChangeText={(text) => setPostalCode(text)}
                  nameKey="postalCode"
                />
              </View>

              <View>
                <CustomedButton
                  title="Add Address"
                  handleOnPress={handleAddAddress}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </SafeAreaView>

  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    // marginTop: -20,
    backgroundColor: "#fff",
    
  },
  addressContainer: {
    flexGrow: 1,
    backgroundColor: "white",
  },
  innerContainer: {
    padding: 20,
  },
  addressBlock: {
    height: 50,
    backgroundColor: "#ee3131",
  },
  addAddressHeader: {
    padding: 10,
    alignItems: "center",
  },
  addAddressText: {
    fontSize: 18,
    marginBottom: 40,
  },
  addFieldInput: {
    padding: 10,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 5,
  },
  addField: {
    fontSize: 15,
    fontWeight: "bold",
  },
  addNameContainer: {
    marginVertical: 10,
  },
  addAddressButtonContainer: {
    backgroundColor: "#ee3131",
    padding: 19,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    height: 60,
  },
  addAddressButtonText: {
    fontWeight: "bold",
    color: "white",
  },
  topContent: {
    alignItems: "center",
  },
  input: {
    gap: 20,
    marginBottom: 40,
  },

  midBtn: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 40,
  },
});
