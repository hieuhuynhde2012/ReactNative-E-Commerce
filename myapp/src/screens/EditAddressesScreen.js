import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, StyleSheet, Alert, Pressable } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { apiEditAdditionalAddress } from "../apis";

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
      Alert.alert("No Changes", "No updates to save.");
      navigation.goBack();
      return;
    }
  
    try {
      const response = await apiEditAdditionalAddress(id, { additionalAddress: updatedAddress });
      if (response.success) {
        Alert.alert("Success", "Address updated successfully!");
        navigation.goBack();
      } else {
        Alert.alert("Error", response.message || "Update failed.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update address. Please try again.");
    }
  };
  
  return (
    <ScrollView style={styles.addressContainer}>
      <View style={styles.addressBlock} />

      <View style={styles.addAddressHeader}>
        <Text style={styles.addAddressText}>Edit Address</Text>

        <TextInput
          value={country}
          placeholder="Enter your country"
          onChangeText={(text) => setCountry(text)}
          placeholderTextColor={"black"}
          style={styles.addFieldInput}
        ></TextInput>

        <View style={styles.addNameContainer}>
          <Text style={styles.addField}>Full name (First and last name)</Text>

          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            placeholderTextColor={"black"}
            style={styles.addFieldInput}
            placeholder="Enter your name"
          />
        </View>

        <View>
          <Text style={styles.addField}>Mobile number</Text>
          <TextInput
            value={mobileNo}
            onChangeText={(text) => setMobileNo(text)}
            placeholderTextColor={"black"}
            style={styles.addFieldInput}
            placeholder="Enter your mobile number"
          />
        </View>
        <View>
          <Text style={styles.addField}>House number, building, company</Text>
          <TextInput
            value={houseNo}
            onChangeText={(text) => setHouseNo(text)}
            placeholderTextColor={"black"}
            style={styles.addFieldInput}
            placeholder="Enter your house number"
          />
        </View>
        <View>
          <Text style={styles.addField}>Area, street, sector, village</Text>
          <TextInput
            value={street}
            onChangeText={(text) => setStreet(text)}
            placeholderTextColor={"black"}
            style={styles.addFieldInput}
            placeholder="Enter your street"
          />
        </View>
        <View>
          <Text style={styles.addField}>Landmark</Text>
          <TextInput
            value={landmark}
            onChangeText={(text) => setLandmark(text)}
            placeholderTextColor={"black"}
            style={styles.addFieldInput}
            placeholder="Eg near apollo, hospital"
          />
        </View>
        <View>
          <Text style={styles.addField}>Pincode</Text>
          <TextInput
            value={postalCode}
            onChangeText={(text) => setPostalCode(text)}
            placeholderTextColor={"black"}
            style={styles.addFieldInput}
            placeholder="Enter pincode"
          />
        </View>

        <Pressable
          style={styles.addAddressButtonContainer}
          onPress={handleUpdateAddress}
        >
          <Text style={styles.addAddressButtonText}>Save Changes</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default EditAddressesScreen;
const styles = StyleSheet.create({
  addressContainer: {
    backgroundColor: "white",
  },
  addressBlock: {
    height: 50,
    backgroundColor: "#ee3131",
  },
  addAddressHeader: {
    padding: 10,
  },
  addAddressText: {
    fontSize: 17,
    fontWeight: "bold",
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
});