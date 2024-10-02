import React from "react";
import { Dimensions } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

const Congrat = () => {
  const { width, height } = Dimensions.get("window");

  return (
    <ConfettiCannon
      count={200} // Số lượng confetti
      origin={{ x: width / 2, y: 0 }} // Vị trí bắt đầu
      fadeOut={true} // Tự động mờ dần
      autoStart={true} // Bắt đầu tự động
      height={height} // Chiều cao của màn hình
      width={width} // Chiều rộng của màn hình
    />
  );
};

export default Congrat;
