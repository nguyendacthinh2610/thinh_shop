const Order = require('../models/orderModel');
const Product = require('../models/productModel');

const isJson = (req) => req.is('json') || req.headers.accept?.includes('application/json');

// [GET] /orders - List all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    if (isJson(req)) return res.json(orders);
    res.render('order', { orders });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// [GET] /orders/create - Show create form
exports.showCreateOrder = (req, res) => {
  res.render('createOrder', { error: null });
};

// [POST] /orders/create - Add new order
exports.createOrder = async (req, res) => {
  try {
    const { customerName, productName, quantity, orderDate } = req.body;

    // Constraint: only products existing in system can be ordered
    const product = await Product.findOne({ productName: productName?.trim() });
    if (!product) {
      if (isJson(req)) return res.status(400).json({ error: 'Product does not exist in the system!' });
      return res.render('createOrder', { error: 'Product does not exist in the system!' });
    }

    // Automatically calculate total price
    const totalPrice = product.unitPrice * Number(quantity);
    const newOrder = await Order.create({
      customerName,
      productName: product.productName,
      quantity,
      orderDate: orderDate || new Date(),
      totalPrice
    });

    if (isJson(req)) return res.status(201).json({ success: true, order: newOrder });
    res.redirect('/orders');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// [GET] /orders/update/:orderId - Show update form
exports.showUpdateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.redirect('/orders');
    if (isJson(req)) return res.json(order);
    res.render('updateOrder', { order, error: null });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// [POST] /orders/update/:orderId - Update order
exports.updateOrder = async (req, res) => {
  try {
    const { customerName, productName, quantity, orderDate } = req.body;

    const product = await Product.findOne({ productName: productName?.trim() });
    if (!product) {
      const order = await Order.findById(req.params.orderId);
      if (isJson(req)) return res.status(400).json({ error: 'Product does not exist in the system!' });
      return res.render('updateOrder', { order, error: 'Product does not exist in the system!' });
    }

    const totalPrice = product.unitPrice * Number(quantity);
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { customerName, productName: product.productName, quantity, orderDate, totalPrice },
      { returnDocument: 'after' }
    );

    if (isJson(req)) return res.json({ success: true, order: updatedOrder });
    res.redirect('/orders');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// [GET / POST] /orders/delete/:orderId - Delete order
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.orderId);
    if (isJson(req)) return res.json({ success: true, message: 'Order deleted successfully' });
    res.redirect('/orders');
  } catch (err) {
    res.status(500).send(err.message);
  }
};
