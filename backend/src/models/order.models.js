import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
  name: String,
  price: Number,
  quantity: Number,
  options: Object
}, { _id: false });

const addressSchema = new mongoose.Schema({
  fullName: String,
  mobile: String,
  pincode: String,
  addressLine: String,
  city: String,
  state: String,
  country: String,
  isDefault: Boolean
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  items: { type: [orderItemSchema], default: [] },
  subtotal: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 },
  estimatedTax: { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 },
  contactInfo: { type: Object, default: {} },
  shippingAddress: { type: addressSchema, default: {} },
  paymentMethod: { type: String, default: 'unknown' },
  status: { type: String, default: 'confirmed' }
}, {
  timestamps: true
});

const OrderModel = mongoose.model('Order', orderSchema);
export default OrderModel;
