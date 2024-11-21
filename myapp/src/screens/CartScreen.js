import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from "../store/user/userSlice";
import { useNavigation } from "@react-navigation/native";
import { formatCurrency } from "../utils/helpers";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import logo from "../../assets/logo.png";
import { apiRemoveCart, apiUpdateCart } from "../apis";

const CartScreen = () => {
  const navigation = useNavigation();
  const { currentCart, current } = useSelector((state) => state.user);
  const total = formatCurrency(
    currentCart?.reduce(
      (sum, el) => sum + Number(el?.price * el?.quantity),
      0,
  ),
  );
  const dispatch = useDispatch();
  const increaseQuantity = async (item) => {
    const updatedItem = { 
      pid: item.product._id, 
      color: item.color, 
      quantity: 1, 
      price: item.price,
      thumbnail: item.thumbnail,
      title: item.title ,
      actionType: 'increase'
    };
  
    try {
      const response = await apiUpdateCart(updatedItem);
      if (response.success) {
        dispatch(incrementQuantity({ pid: item.product._id, color: item.color }));
      } else {
        alert('Failed to update quantity');
      }
    } catch (error) {
      console.error('Error increasing quantity:', error);
      alert('An error occurred while increasing the quantity');
    }
  };
  
  
  const decreaseQuantity = async (item) => {
    if (item.quantity === 1) {
      try {
        await deleteItem(item.product._id, item.color);
        console.log("Product has been removed from cart");
      } catch (error) {
        console.error("Error removing item from cart:", error);
        alert("An error occurred while removing the item");
      }
    } else {
      const updatedItem = { 
        pid: item.product._id, 
        color: item.color, 
        quantity: item.quantity,
        price: item.price,
        thumbnail: item.thumbnail,
        title: item.title,
        actionType: 'decrease'
      };
  
      try {
        const response = await apiUpdateCart(updatedItem);
        if (response.success) {
          dispatch(decrementQuantity({ pid: item.product._id, color: item.color }));
        } else {
          alert('Failed to update quantity');
        }
      } catch (error) {
        console.error('Error decreasing quantity:', error);
        alert('An error occurred while decreasing the quantity');
      }
    }
  };
  
  
  const deleteItem = async (pid, color) => {
    try {
      const response = await apiRemoveCart(pid, color);
      console.log(response);
      if (response.success) {
        console.log("Product has been remove from cart");
        dispatch(removeFromCart({ pid, color }));
      
      } else {
        alert('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      alert('An error occurred while removing the item');
    }
  };
  

  return currentCart.length === 0 ? (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.textHeader}>Cart</Text>
        <Pressable onPress={() => navigation.navigate("Home")}>
          <Image style={styles.logo} source={logo} />
        </Pressable>
      </View>
      <View style={styles.emptyCartContainer}> 
      <View style={styles.cartIcon}>
        <Image
          source={{
            uri: "https://img.freepik.com/free-vector/supermarket-shopping-cart-concept-illustration_114360-22408.jpg",
          }}
          style={styles.cartImage}
        />
      </View>
      <Text style={styles.emptyTitle}>Your Cart is Empty!</Text>
      <Text style={styles.emptyMessage}>
        Must add items on the cart before you proceed to check out.
      </Text>
      <Pressable
        onPress={() => navigation.navigate("Home")}
        style={styles.emptyButton}
      >
        <Text style={styles.emptyButtonText}>SHOPPING NOW</Text>
      </Pressable>
      </View>
    </View>
  ) : (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerContainer}>
        <Text style={styles.textHeader}>Cart</Text>
        <Pressable onPress={() => navigation.navigate("Home")}>
          <Image style={styles.logo} source={logo} />
        </Pressable>
      </View>

      {/* <Text style={styles.seperator}></Text> */}

      <View style={styles.totalContainer}>
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
            Proceed to Buy ({currentCart.length}) items
          </Text>
        </Pressable>
      </View>
      <View style={styles.container}>
        {currentCart.map((item) => (
          <View key={item._id} style={styles.cartItemWrapper}>
            <View style={styles.imgWrapper}>
              <Image style={styles.img} source={{ uri: `${item?.thumbnail}` }} />
            </View>
            <View style={styles.contentWrapper}>
              <View style={styles.inforWrapper}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[styles.textTitle]}
                >
                  {item?.title}
                </Text>
                <Text style={[styles.text, styles.boldText]}>
                  {formatCurrency(item?.price * item?.quantity)}
                </Text>
              </View>

              <View style={styles.ctrlWrapper}>
                <TouchableOpacity onPress={() => increaseQuantity(item)}>
                  <FontAwesome name="plus-circle" size={30} color="#ee3131" />
                </TouchableOpacity>
                <Text style={[styles.text, styles.boldText]}>
                  {item?.quantity}
                </Text>
                <TouchableOpacity onPress={() => decreaseQuantity(item)}>
                  <FontAwesome name="minus-circle" size={30} color="#ee3131" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteItem(item?.product?._id, item?.color)}
                  style={styles.deleteBtn}
                >
                  <MaterialCommunityIcons
                    name="delete-circle"
                    size={30}
                    color="#ee3131"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  emptyCartContainer: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  cartIcon: {
    position: "relative",
    marginBottom: 20,
    marginTop: 70,
    
  },
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    //justifyContent: "center",
    //alignItems: "center",
  },
  headerContainer: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textHeader: {
    fontSize: 24,
    fontWeight: "bold",
  },
  logo: {
    width: 160,
    objectFit: "contain",
  },
  cartItemWrapper: {
    width: "95%",
    aspectRatio: 3 / 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch",
    padding: 10,
    borderWidth: 1,
    borderColor: "#a0a0a0",
    borderRadius: 16,
    marginBottom: 10,
    backgroundColor: "white",
    marginLeft: 10,
    marginTop: 10,
    marginRight: 20,
  },
  contentWrapper: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  textTitle: {
    fontSize: 16,
    maxWidth: 100, // Giới hạn chiều rộng tối đa của văn bản (đơn vị có thể là px, %, dp...)
    overflow: "hidden", // Ẩn phần văn bản thừa
    textOverflow: "ellipsis",
  },
  imgWrapper: {
    width: "29%",
    aspectRatio: 1 / 1,
    marginLeft: -10,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  img: {
    width: "100%",
    aspectRatio: 1 / 1,
    resizeMode: "contain",
  },
  inforWrapper: {
    width: "67%",

    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  ctrlWrapper: {
    width: "30%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  deleteBtn: {
    position: "absolute",
    right: -135,
  },
  totalPriceWrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
  },
  btn: {
    width: "100%",
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#ee3131",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 20,
  },
  boldText: {
    fontWeight: "bold",
  },
  warningIcon: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF0000",
    marginBottom: 10,
  },
  emptyMessage: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cartImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 20,
  },
  cartTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  container: {
    //marginTop: 55,
    flex: 1,
    backgroundColor: "white",
  },
  searchContainer: {
    backgroundColor: "white",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  cartContainer: {
    flex: 1, //
    alignItems: "center",
    marginBottom: -20,
  },
  cartHeader: {
    fontSize: 100,
  },
  icon: {
    marginRight: 10,
  },
  subTotalContainer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  totalContainer: {
    borderWidth: 1,
    borderColor: "#a0a0a0",
    borderRadius: 16,
    width: "95%",
    padding: 10,
    marginLeft: 10,
    marginTop: 20,
    marginBottom: 10,
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
    width: "100%",
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#ee3131",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 15,
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
    marginLeft: 10,
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
    marginLeft: 10,
  },
  quantityAdjust: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderColor: "#D0d0d0",
    // borderWidth: 1,
    // borderRadius: 3
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
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 7,
    borderColor: "#D0d0d0",
    borderWidth: 1,
    marginLeft: 5,
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
