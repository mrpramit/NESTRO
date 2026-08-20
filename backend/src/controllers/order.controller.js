import OrderModel from "../models/order.models.js";
import { sendBadRequest, sendNotFound, sendServerError, sendSuccess } from "../utils/response.js";

const createOrder = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !payload.orderId) return sendBadRequest(res, 'Order data with orderId is required');

    const existing = await OrderModel.findOne({ orderId: payload.orderId });
    if (existing) return sendBadRequest(res, 'Order already exists');

    const order = await OrderModel.create({
      ...payload,
      userId: req.user._id,
    });
    return sendSuccess(res, 'Order created successfully', { order });
  } catch (error) {
    console.log(error);
    sendServerError(res, 'Internal Server Error');
  }
};

const getOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = {};
    if (userId) filter.userId = userId;
    const orders = await OrderModel.find(filter).sort({ createdAt: -1 });
    return sendSuccess(res, 'Orders fetched', { orders });
  } catch (error) {
    console.log(error);
    sendServerError(res, 'Internal Server Error');
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findById(id);
    if (!order) return sendNotFound(res, 'Order not found');
    return sendSuccess(res, 'Order fetched', { order });
  } catch (error) {
    console.log(error);
    sendServerError(res, 'Internal Server Error');
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) return sendNotFound(res, 'Order not found');

    if (["cancelled", "delivered", "completed"].includes(order.status)) {
      return sendBadRequest(res, `Order cannot be cancelled because it is ${order.status}`);
    }

    order.status = "cancelled";
    await order.save();
    return sendSuccess(res, 'Order cancelled successfully', { order });
  } catch (error) {
    console.log(error);
    sendServerError(res, 'Internal Server Error');
  }
};

export { createOrder, getOrders, getOrderById, cancelOrder };
