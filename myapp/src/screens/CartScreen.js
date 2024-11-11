import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Image,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import {
  incementQuantity,
  decrementQuantity,
  removeFromCart,
} from "../store/user/userSlice";
import { useNavigation } from "@react-navigation/native";
const CartScreen = () => {
  const navigation = useNavigation();
  const cart = useSelector((state) => state.user.cart);
  //console.log(cart);
  const total = parseFloat(
    cart
      ?.map((item) => (item.price / 24000) * item.quantity)
      .reduce((curr, prev) => curr + prev, 0)
      .toFixed(2)
  );
  const dispatch = useDispatch();
  const increaseQuantity = (item) => {
    dispatch(incementQuantity(item));
  };
  const decreaseQuantity = (item) => {
    dispatch(decrementQuantity(item));
  };
  const deleteItem = (item) => {
    dispatch(removeFromCart(item));
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="white" />
        </Pressable>
        <Pressable style={styles.searchBox}>
          <TextInput style={styles.searchTextInput} placeholder="Search" />
          <AntDesign
            style={styles.icon}
            name="search1"
            size={22}
            color="black"
          />
        </Pressable>
      </View>

      <View style={styles.subTotalContainer}>
        <Text style={styles.subTotalText}>Subtotal: </Text>
        <Text style={styles.subTotalNumber}>{total} $</Text>
      </View>

      <Text style={styles.cartHeader}>Cart detail available</Text>

      <Pressable
        onPress={() => navigation.navigate("Confirm")}
        style={styles.buyButtonContainer}
      >
        <Text style={styles.buyButtonText}>
          Proceed to Buy ({cart.length}) items
        </Text>
      </Pressable>

      <Text style={styles.seperator}></Text>

      <View style={styles.productInfoContainer}>
        {cart?.map((item, index) => (
          <View key={index}>
            <Pressable style={styles.productInfo}>
              <View>
                <Image
                  style={styles.imageContainer}
                  source={{ uri: item?.thumb }}
                />
              </View>

              <View>
                <Text numberOfLines={2} style={styles.productTitle}>
                  {item?.title}
                </Text>
                <Text style={styles.productPrice}>
                  {(item?.price / 24000).toFixed(2)} $
                </Text>
                <Text style={styles.inStockText}>In Stock</Text>
              </View>
            </Pressable>
            <Pressable style={styles.pressableContainer}>
              <View style={styles.iconCotainer}>
                {item?.quantity > 1 ? (
                  <Pressable
                    onPress={() => decreaseQuantity(item)}
                    style={styles.styleIcon}
                  >
                    <AntDesign name="minus" size={24} color="black" />
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => deleteItem(item)}
                    style={styles.styleIcon}
                  >
                    <MaterialIcons name="delete" size={24} color="black" />
                  </Pressable>
                )}

                <Pressable style={styles.quantityAdjust}>
                  <Text>{item?.quantity}</Text>
                </Pressable>

                <Pressable
                  onPress={() => increaseQuantity(item)}
                  style={styles.styleIcon}
                >
                  <AntDesign name="plus" size={24} color="black" />
                </Pressable>
              </View>

              <Pressable
                onPress={() => deleteItem(item)}
                style={styles.customButton}
              >
                <Text>Delete</Text>
              </Pressable>
            </Pressable>

            <Pressable style={styles.boderPressable}>
              <Pressable style={styles.customButton}>
                <Text>Save for later</Text>
              </Pressable>

              <Pressable style={styles.customButton}>
                <Text>See more like this</Text>
              </Pressable>
            </Pressable>
            <Text style={styles.seperator}></Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    //marginTop: 55,
    flex: 1,
    backgroundColor: "white",
  },
  searchContainer: {
    backgroundColor: "#ee3131",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 7,
    gap: 10,
    backgroundColor: "white",
    borderRadius: 3,
    height: 38,
    flex: 1,
    //marginLeft: 10
  },
  searchTextInput: {
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  subTotalContainer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  subTotalText: {
    fontSize: 18,
    fontWeight: "400",
  },
  subTotalNumber: {
    fontSize: 20,
    fontWeight: "bolde",
  },
  cartHeader: {
    marginHorizontal: 10,
  },
  buyButtonContainer: {
    backgroundColor: "#ee3131",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  buyButtonText: {
    fontSize: 18,
    fontWeight: "400",
    color: "white",
  },
  seperator: {
    height: 1,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    marginTop: 15,
  },
  imageContainer: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    borderColor: "#D0d0d0",
    borderWidth: 1,
    marginLeft: 10
  },
  productInfoContainer: {
    backgroundColor: "white",
    marginVertical: 10,
    borderBottomColor: "#F0F0F0",
    borderWidth: 2,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  productInfo: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productTitle: {
    width: 150,
    marginTop: 10,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 6,
  },
  inStockText: {
    color: "red",
    fontWeight: "500",
  },
  styleIcon: {
    backgroundColor: "#D8D8D8",
    padding: 7,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  iconCotainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 7,
    borderColor: "#D0d0d0",
    borderWidth: 1,
    marginLeft: 10
  },
  quantityAdjust: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderColor: "#D0d0d0",
    borderWidth: 1,
    borderRadius: 3
    
  },
  pressableContainer: {
    marginTop: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  customButton: {
    backgroundColor: "white",
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 5,
    borderColor: "#D0D0D0",
    borderWidth: 0.6,
  },
  boderPressable: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
    marginLeft: 10,
  },
});

export default CartScreen;
