import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  AppState,
  Alert,
  Image
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import {
  apiGetAdditionalAddress,
  apiGetCurrent,
  apiDeleteAdditionalAddress,
  apiSetDefaultAddress,
} from "../apis";
import { apiCreateOrder } from "../apis";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { cleanCart } from "../store/user/userSlice";
import { formatCurrency } from "../utils/helpers";


const ConfirmationScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const steps = [
    { title: "Address", content: "Address Form" },
    { title: "Delivery", content: "Delivery Options" },
    { title: "Payment", content: "Payment Details" },
    { title: "Place Order", content: "Order Sumary" },
  ];
  const { currentCart, current } = useSelector((state) => state.user);
  //console.log(cart);
  const total = formatCurrency(
    currentCart?.reduce(
      (sum, el) => sum + Number(el?.price * el?.quantity),
      0,
  ),
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [option, setOption] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedDelivery, setselectedDelivery] = useState("");
  const [selectedAddress, setselectedAddress] = useState("");

  const optionDelivery = [
    {
      id: 1,
      text: "Tomorrow by 10am - Discount up to 80% with membership",
    },
    {
      id: 2,
      text: "Tomorrow - Free shipping with online payment",
    },
    {
      id: 3,
      text: "On sunday - Free shipping with order total > $100",
    },
  ];

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

  const handlePlaceOrder = async () => {
    try {
      const userResponse = await apiGetCurrent();

      if (userResponse.success) {
        const userId = userResponse.rs._id;

        const orderData = {
          userId: userId,
          cartItems: cart,
          totalPrice: total,
          shippingAddress: selectedAddress,
          paymentMethod: selectedOption,
        };

        const response = await apiCreateOrder(orderData);
        console.log(response.createdOrder);

        if (response.success) {
          navigation.navigate("Order");
          console.log("Order created successfully", response.createdOrder);
          dispatch(cleanCart());
        } else {
          console.log("Error creating order", response.createdOrder);
        }
      } else {
        console.log("Failed to fetch user:", userResponse.message);
      }
    } catch (error) {
      console.log("Error in handlePlaceOrder", error.response || error);
    }
  };

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
          {addresses && addresses.length > 0 ? (
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
                        onPress={() => onDeleteAddress(item._id)}
                        style={styles.editAddressButton}
                      >
                        <Text style={styles.editAddressText}>Remove</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleSetDefaultAddress(item?._id)}
                        style={styles.editAddressButton}
                      >
                        <Text style={styles.editAddressText}>
                          Set as default
                        </Text>
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
          ) : (
            <View style={styles.noAddressContainer}>
              <Image
                source={{
                  uri: "https://cdni.iconscout.com/illustration/premium/thumb/no-address-found-illustration-download-in-svg-png-gif-file-formats--location-app-finding-permission-results-empty-state-error-pack-design-development-illustrations-3613886.png",
                }}
                style={styles.noaddressiconImage}
              />
              <Text style={styles.titleNo}>No Address Added</Text>
              <Text style={styles.noAddressText}>
                Add an address to ensure smooth delivery.
              </Text>
              <Pressable
                onPress={() => navigation.navigate("Add")}
                style={styles.addAddressButton}
              >
                <Text style={styles.addAddressText}>+ Add Address</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}

      {currentStep == 1 && (
        <View style={styles.deliveryOptionContainer}>
          <Text style={styles.deliveryOptionText}>
            Choose your delivery options
          </Text>

          <View>
            {optionDelivery.map((item) => (
              <Pressable
                key={item.id}
                style={styles.infoOptionContainer}
                onPress={() => setSelectedOption(item.id)}
              >
                {selectedOption === item.id ? (
                  <FontAwesome6 name="dot-circle" size={20} color="#ee3131" />
                ) : (
                  <Entypo name="circle" size={20} color="gray" />
                )}

                <Text style={styles.infoOptionTextContainer}>
                  <Text style={styles.infoOptionText}>{item.text}</Text>
                </Text>
              </Pressable>
            ))}
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
        <View style={styles.paymentContainer}>
          <Text style={styles.paymentInfoText}>Select your payment Method</Text>

          <View style={styles.paymentInfoContainer}>
            {selectedOption === "cash" ? (
              <FontAwesome6 name="dot-circle" size={20} color="#ee3131" />
            ) : (
              <Entypo
                onPress={() => setSelectedOption("cash")}
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <Text>Cash on delivery</Text>
          </View>

          <View style={styles.paymentInfoContainer}>
            {selectedOption === "card" ? (
              <FontAwesome6 name="dot-circle" size={20} color="#ee3131" />
            ) : (
              <Entypo
                onPress={() => setSelectedOption("card")}
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <Text>Credit or debit card</Text>
          </View>
          <Pressable
            onPress={() => setCurrentStep(3)}
            style={styles.continueButtonContainer}
          >
            <Text style={styles.continueButtonText}>Continute</Text>
          </Pressable>
        </View>
      )}

      {currentStep === 3 && selectedOption === "cash" && (
        <View style={styles.orderContainer}>
          <Text style={styles.orderText}>Order now</Text>
          <View style={styles.infoOrderContainer}>
            <View>
              <Text style={styles.detailInfoHeader}>
                Save 10% and never run out
              </Text>
              <Text style={styles.detailInfoText}>Turn on auto deliveries</Text>
            </View>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            />
          </View>

          <View style={styles.shippingAddressContainer}>
            <Text>Shipping to {selectedAddress?.name}</Text>

            <View style={styles.shippingDetailAddressContainer}>
              <Text style={styles.shippingDetailAddressHeader}>Items</Text>

              <Text style={styles.shippingDetailAddressText}>${total}</Text>
            </View>

            <View style={styles.shippingDetailAddressContainer}>
              <Text style={styles.shippingDetailAddressHeader}>Delivery</Text>

              <Text style={styles.shippingDetailAddressText}>0</Text>
            </View>

            <View style={styles.shippingDetailAddressContainer}>
              <Text style={styles.orderDetailContainer}>Order total</Text>

              <Text style={styles.orderDetailText}>${total}</Text>
            </View>
          </View>

          <View style={styles.payWithInfoContainer}>
            <Text style={styles.payWithInfoText}>Pay with</Text>
            <Text style={styles.payWithInfo}>Pay on delivery (cash)</Text>
          </View>

          <Pressable
            onPress={handlePlaceOrder}
            style={styles.placeOrderButtonContainer}
          >
            <Text style={styles.placeOrderButtonText}>Place your order</Text>
          </Pressable>
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
  noAddressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  noaddressiconImage: {
    width: 80,
    height: 80,
    marginBottom: 20,
    tintColor: '#ee3131',
  },
  titleNo: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  noAddressText: {
    fontSize: 16,
    color: '#666', 
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  addAddressButton: {
    backgroundColor: '#ee3131',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 10,
  },
  addAddressText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
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
    marginHorizontal: 20,
  },
  paymentInfoText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  paymentInfoContainer: {
    backgroundColor: "white",
    padding: 8,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 12,
  },
  orderContainer: {
    marginHorizontal: 20,
  },
  orderText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  infoOrderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    backgroundColor: "white",
    borderWidth: 1,
    marginTop: 10,
    borderColor: "#D0D0D0",
  },
  detailInfoHeader: {
    fontSize: 17,
    fontWeight: "bold",
  },
  detailInfoText: {
    fontSize: 15,
    color: "gray",
    marginTop: 5,
  },
  shippingAddressContainer: {
    backgroundColor: "white",
    padding: 8,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    marginTop: 10,
  },
  shippingDetailAddressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 7,
  },
  shippingDetailAddressHeader: {
    fontSize: 16,
    fontWeight: "500",
    color: "gray",
  },
  shippingDetailAddressText: {
    color: "gray",
    fontSize: 16,
  },
  orderDetailContainer: {
    fontSize: 20,
    fontWeight: "bold",
  },
  orderDetailText: {
    color: "#ee3131",
    fontSize: 17,
    fontWeight: "bold",
  },
  payWithInfoContainer: {
    backgroundColor: "white",
    padding: 8,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    marginTop: 10,
  },
  payWithInfoText: {
    fontSize: 16,
    color: "gray",
  },
  payWithInfo: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 7,
  },
  placeOrderButtonContainer: {
    backgroundColor: "#ee3131",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  placeOrderButtonText: {
    color: "white",
  },
});
export default ConfirmationScreen;
