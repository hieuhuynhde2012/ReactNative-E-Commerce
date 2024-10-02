import React, { memo } from "react";
import { View, Modal as RNModal, TouchableWithoutFeedback } from "react-native";
// import { useDispatch } from "react-redux";
// import { showModal } from "store/app/appSlice";

const Modal = ({ children, visible }) => {
  // const dispatch = useDispatch();

  return (
    <RNModal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={() => {
        // dispatch(showModal({ isShowModal: false, modalChildren: null }));
      }}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          // dispatch(showModal({ isShowModal: false, modalChildren: null }));
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          {children}
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

export default memo(Modal);
