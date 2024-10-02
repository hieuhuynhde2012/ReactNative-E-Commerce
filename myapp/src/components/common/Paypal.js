import React from "react";
import { View, Button, Alert } from "react-native";

const Paypal = ({ amount, setIsSucceed }) => {
  const handleSaveOrder = () => {
    // Gọi API để lưu đơn hàng ở đây
    // const response = await apiCreateOrder({ ...payload, status: "Succeed" });
    // if (response?.success) {
    //   setIsSucceed(true);
    //   Alert.alert("Congratulation!", "Order has been created successfully!");
    // }
  };

  const handlePayment = () => {
    // Thực hiện thanh toán PayPal ở đây
    // Giả sử paymentSuccess là kết quả thành công
    const paymentSuccess = true; // Thay thế bằng thực tế kiểm tra
    if (paymentSuccess) {
      handleSaveOrder();
    } else {
      Alert.alert("Payment failed", "Please try again.");
    }
  };

  return (
    <View style={{ maxWidth: 750, minHeight: 200, margin: "auto" }}>
      <Button title="Pay with PayPal" onPress={handlePayment} />
    </View>
  );
};

export default Paypal;
