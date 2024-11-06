import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { apiGetAdditionalAddress, apiGetCurrent } from "../apis";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const ConfirmationScreen = () => {
  const steps = [
    { title: "Address", content: "Address Form" },
    { title: "Delivery", content: "Delivery Options" },
    { title: "Payment", content: "Payment Details" },
    { title: "Place Order", content: "Order Sumary" },
  ];
  const [currentStep, setCurrentStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [option, setOption] = useState(false);
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
  const [selectedAddress, setselectedAddress] = useState("");
  return (
    <ScrollView style={styles.container}>
      <View style={styles.viewContainer}>
        <View style={styles.viewIndex}>
          {steps?.map((step, index) => (
            <View style={styles.mapViewContainer}>
              {index > 0 && (
                <View
                  style={[
                    { flex: 1, height: 2, backgroundColor: "#ee3131" },
                    index <= currentStep && { backgroundColor: "#ee3131" },
                  ]}
                />
              )}
              <View
                style={[
                  styles.indexContainer,
                  index < currentStep && { backgroundColor: "green" },
                ]}
              >
                {index < currentStep ? (
                  <Text style={styles.indexText}>&#10003;</Text>
                ) : (
                  <Text style={styles.indexText}>{index + 1}</Text>
                )}
              </View>

              <Text style={styles.titleContainer}>{step.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {currentStep == 0 && (
        <View style={styles.deliveryContainer}>
          <Text style={styles.deliveryText}>Select delivery address</Text>

          <Pressable>
            {addresses?.map((item, index) => (
              <Pressable style={styles.addressContainer}>
                {selectedAddress && selectedAddress._id === item?._id ? (
                  <FontAwesome6 name="dot-circle" size={20} color="#ee3131" />
                ) : (
                  <Entypo
                    onPress={() => setselectedAddress(item)}
                    name="circle"
                    size={20}
                    color="gray"
                  />
                )}

                <View style={styles.addressesInfoBorderContainer}>
                  <View style={styles.addressesInfoContainer}>
                    <Text style={styles.addressesInfoText}>{item?.name}</Text>
                    <Entypo name="location-pin" size={24} color="#ee3131" />
                  </View>
                  <Text style={styles.addressesDetailInfoText}>
                    {item?.houseNo}, {item?.landmark}
                  </Text>
                  <Text style={styles.addressesDetailInfoText}>
                    {item?.street}
                  </Text>
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
                    <Pressable style={styles.editAddressButton}>
                      <Text style={styles.editAddressText}>Edit</Text>
                    </Pressable>
                    <Pressable style={styles.editAddressButton}>
                      <Text style={styles.editAddressText}>Remove</Text>
                    </Pressable>
                    <Pressable style={styles.editAddressButton}>
                      <Text style={styles.editAddressText}>Set as default</Text>
                    </Pressable>
                  </View>

                  <View>
                    {selectedAddress && selectedAddress._id === item?._id && (
                      <Pressable
                        onPress={() => setCurrentStep(1)}
                        style={styles.addressFrame}
                      >
                        <Text style={styles.addressFrameText}>
                          Deliver to this address
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </Pressable>
        </View>
      )}

      {currentStep == 1 && (
        <View style={styles.deliveryOptionContainer}>
          <Text style={styles.deliveryOptionText}>
            Choose your delivery options
          </Text>

          <View style={styles.infoOptionContainer}>
            {option ? (
              <FontAwesome6 name="dot-circle" size={20} color="#ee3131" />
            ) : (
              <Entypo
                onPress={() => setOption(!option)}
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <Text style={styles.infoOptionTextContainer}>
              <Text style={styles.infoOptionText}>Tomorrow by 10am</Text> -
              Discount up to 80% with membership
            </Text>
          </View>

          <View style={styles.infoOptionContainer}>
            {option ? (
              <FontAwesome6 name="dot-circle" size={20} color="#ee3131" />
            ) : (
              <Entypo
                onPress={() => setOption(!option)}
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <Text style={styles.infoOptionTextContainer}>
              <Text style={styles.infoOptionText}>Tomorrow</Text> - Free
              shipping with paypal payment
            </Text>
          </View>

          <Pressable
            onPress={() => setCurrentStep(2)}
            style={styles.continueButtonContainer}
          >
            <Text style={styles.continueButtonText}>Continute</Text>
          </Pressable>
        </View>
      )}

      {currentStep == 2 && (
        <View style = {styles.paymentContainer}>
          <Text style={styles.paymentInfoText}>Select your payment Method</Text>

          <View style ={styles.paymentInfoContainer}>
          <Entypo
                onPress={() => setOption(!option)}
                name="circle"
                size={20}
                color="gray"
              />

              <Text>Cash on delivery</Text>

          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  viewContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  viewIndex: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  indexContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  indexText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  titleContainer: {
    textAlign: "center",
    marginTop: 8,
  },
  mapViewContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  deliveryContainer: {
    marginHorizontal: 20,
  },
  deliveryText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  addressesDetailInfoText: {
    fontSize: 15,
    color: "#181818",
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
  addressContainer: {
    borderWidth: 1,
    borderColor: "#D0D0D0",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingBottom: 17,
    marginVertical: 7,
    borderRadius: 6,
  },
  addressesInfoBorderContainer: {
    marginLeft: 6,
  },
  addressFrame: {
    backgroundColor: "#ee3131",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  addressFrameText: {
    color: "white",
  },
  deliveryOptionText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  deliveryOptionContainer: {
    marginHorizontal: 20,
  },
  infoOptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 8,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    marginTop: 10,
  },
  infoOptionTextContainer: {
    flex: 1,
  },
  infoOptionText: {
    color: "#ee3131",
    fontWeight: "500",
  },
  continueButtonContainer: {
    backgroundColor: "#ee3131",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  continueButtonText: {
    color: "white",
  },
  paymentContainer: {
    marginHorizontal: 20

  },
  paymentInfoText: {
    fontSize: 20,
    fontWeight: "bold"
  }, 
  paymentInfoContainer: {
    backgroundColor: "white",
    padding: 8,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 12
  }
});
export default ConfirmationScreen;
