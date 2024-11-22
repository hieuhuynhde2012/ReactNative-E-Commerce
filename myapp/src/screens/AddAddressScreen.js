import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  Image,
  SafeAreaView
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  apiGetAdditionalAddress,
  apiGetCurrent,
  apiDeleteAdditionalAddress,
  apiSetDefaultAddress,
} from "../apis";
import Entypo from "@expo/vector-icons/Entypo";
import logo from "../../assets/logo.png";


const AddAddressScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const [addresses, setAddresses] = useState([]);
  useEffect(() => {
    fetchUserAndAddresses();
  }, []);

  const fetchUserAndAddresses = async () => {
    try {
      const userResponse = await apiGetCurrent();
      if (userResponse.success) {
        const userID = userResponse.rs._id;
        //console.log(userID);

        const addressResponse = await apiGetAdditionalAddress(userID);

        if (addressResponse.success) {
          //console.log(addressResponse.additionalAddress);
          setAddresses(addressResponse.additionalAddress);
        } else {
          console.log("Failed to fetch addresses:", addressResponse.message);
        }
      } else {
        console.log("Failed to fetch user:", userResponse.message);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  //refresh the addresses when the component comes to the focused element
  useFocusEffect(
    useCallback(() => {
      fetchUserAndAddresses();
    })
  );
  const onDeleteAddress = async (addressId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this address?",
      [
        {
          text: "No",
          onPress: () => console.log("Address deletion cancelled"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const response = await apiDeleteAdditionalAddress(addressId);
              if (response.success) {
                console.log("Address deleted successfully");
              } else {
                console.log("Failed to delete address");
              }
            } catch (error) {
              console.error("Error deleting address:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      const response = await apiSetDefaultAddress(addressId);
      if (response.success) {
        Alert.alert("Success", "Address set as default successfully!");
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to set as default."
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      
      setModalVisible(false);
    }, [])
  );

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      style={styles.addAddressContainer}
    >
      <View style={styles.searchBarContainer}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={32} color="black" />
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Home")}>
          <Image style={styles.logo} source={logo} />
        </Pressable>
      </View>

      <View style={styles.addressHeaderContainer}>
        <Text style={styles.addressHeaderText}>Your address</Text>

        <Pressable
          onPress={() => navigation.navigate("Add")}
          style={styles.addAddressHeader}
        >
          <Text>Add a new Address</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
        </Pressable>

        <Pressable>
          {addresses?.map((item, index) => (
            <Pressable style={styles.addressesInfoButton}>
              <View style={styles.addressesInfoContainer}>
                <Text style={styles.addressesInfoText}>{item?.name}</Text>
                <Entypo name="location-pin" size={24} color="#ee3131" />
              </View>
              <Text style={styles.addressesDetailInfoText}>
                {item?.houseNo}, {item?.landmark}
              </Text>
              <Text style={styles.addressesDetailInfoText}>{item?.street}</Text>
              <Text style={styles.addressesDetailInfoText}>
                {item?.country}
              </Text>
              <Text style={styles.addressesDetailInfoText}>
                Phone number: {item?.mobileNo}
              </Text>
              <Text style={styles.addressesDetailInfoText}>
                Pin code: {item?.postalCode}
              </Text>
              <View style={styles.addressButtonContainer}>
                <Pressable
                  onPress={() =>
                    navigation.navigate("EditAddress", {
                      id: item?._id,
                      name: item?.name,
                      houseNo: item?.houseNo,
                      landmark: item?.landmark,
                      street: item?.street,
                      country: item?.country,
                      mobileNo: item?.mobileNo,
                      postalCode: item?.postalCode,
                    })
                  }
                  style={styles.editAddressButton}
                >
                  <Text style={styles.editAddressText}>Edit</Text>
                </Pressable>
                <Pressable
                  onPress={() => onDeleteAddress(item?._id)}
                  style={styles.editAddressButton}
                >
                  <Text style={styles.editAddressText}>Remove</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleSetDefaultAddress(item?._id)}
                  style={styles.editAddressButton}
                >
                  <Text style={styles.editAddressText}>Set as default</Text>
                </Pressable>
              </View>
            </Pressable>
          ))}
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default AddAddressScreen;

const styles = StyleSheet.create({
  addAddressContainer: {
    backgroundColor: "white",
    flex: 1
    
  },
  searchBarContainer: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchContainer: {
    backgroundColor: "#ee3131",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 160,
    objectFit: "contain",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 7,
    gap: 10,
    backgroundColor: "white",
    borderRadius: 3,
    height: 38,
    flex: 1,
  },
  addressHeaderContainer: {
    padding: 10,
  },
  addressHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addAddressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 5,
  },
  addressesInfoButton: {
    borderWidth: 1,
    borderColor: "#D0D0D0",
    padding: 10,
    flexDirection: "column",
    gap: 5,
    marginVertical: 10,
  },
  addressesInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  addressesInfoText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  addressesDetailInfoText: {
    fontSize: 15,
    color: "#181818",
  },
  addressButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 7,
  },
  editAddressButton: {
    backgroundColor: "#ee3131",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    borderWidth: 0.9,
    borderColor: "#D0D0D0",
  },
  editAddressText: {
    color: "white",
  },
});
