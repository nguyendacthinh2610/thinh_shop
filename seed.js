require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/productModel');
const Order = require('./models/orderModel');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/online_shop';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Sample Products
    const sampleProducts = [
      {
        productName: 'Wireless Mouse',
        category: 'Electronics',
        stockStatus: 'in_stock',
        unitPrice: 250000,
        tags: ['bestseller', 'wireless', 'accessory']
      },
      {
        productName: 'Mechanical Keyboard',
        category: 'Electronics',
        stockStatus: 'in_stock',
        unitPrice: 750000,
        tags: ['gaming', 'rgb']
      },
      {
        productName: 'USB-C Cable',
        category: 'Accessories',
        stockStatus: 'in_stock',
        unitPrice: 90000,
        tags: ['cable', 'fast-charge']
      }
    ];

    for (const prod of sampleProducts) {
      const exists = await Product.findOne({ productName: prod.productName });
      if (!exists) {
        await Product.create(prod);
        console.log(`Inserted product: ${prod.productName}`);
      }
    }

    // Sample Order
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      await Order.create({
        customerName: 'Nguyen Thi Lan',
        productName: 'Wireless Mouse',
        quantity: 2,
        orderDate: new Date('2024-10-17T00:00:00Z'),
        totalPrice: 500000
      });
      console.log('Inserted sample order for Nguyen Thi Lan');
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
