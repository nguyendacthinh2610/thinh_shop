require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/orders', orderRoutes);
app.get('/', (req, res) => res.redirect('/orders'));

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
});
