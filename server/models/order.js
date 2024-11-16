const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
      color: String,
      price: Number,
      thumbnail: String,
      title: String,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    name: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: String,
      required: true,
    },
    houseNo: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    landmark: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Cancelled",
    enum: [ "Succeed", "Cancelled"],
  },
  total: {
    type: Number,
  },
  orderBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
}, {timestamps: true});

//Export the model
module.exports = mongoose.model("ORDER", orderSchema);
