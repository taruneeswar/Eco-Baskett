require('dotenv').config();
const connectDB = require('../config/db');
const Product = require('../models/Product');
const mongoose = require('mongoose');

const products = [
  { name: 'Organic Apples', description: 'Fresh organic apples', price: 179, image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=60', category: 'Fruits' },
  { name: 'Bananas', description: 'Ripe bananas, 1kg', price: 59, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=60', category: 'Fruits' },
  { name: 'Strawberries', description: 'Fresh strawberries, 500g', price: 249, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=60', category: 'Fruits' },

  { name: 'Brown Rice', description: 'Whole grain brown rice 1kg', price: 119, image: 'https://smart-groceries.com/wp-content/uploads/2021/09/istockphoto-173589620-612x612-1.jpg', category: 'Grains' },
  { name: 'Quinoa', description: 'High-protein quinoa 500g', price: 229, image: 'https://domf5oio6qrcr.cloudfront.net/medialibrary/6051/1f97d87a-788b-41b3-a82d-9d621d648dac.jpg', category: 'Grains' },
  { name: 'Whole Wheat Bread', description: 'Freshly baked loaf', price: 79, image: 'https://images.getrecipekit.com/20230728144103-md-100-whole-wheat-bread-11-1-of-1-scaled.jpg?aspect_ratio=4:3&quality=90&', category: 'Bakery' },

  { name: 'Almond Milk', description: 'Unsweetened 1L', price: 189, image: 'https://www.thespruceeats.com/thmb/v8plZHZqVN9J-LtrHOy02MDT9s8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-150639392-5863e0903df78ce2c3bd2860.jpg', category: 'Dairy Alternatives' },
  { name: 'Greek Yogurt', description: 'Plain, low-fat 500g', price: 149, image: 'https://media.post.rvohealth.io/wp-content/uploads/sites/3/2020/02/323169_2200-732x549.jpg', category: 'Dairy' },
  { name: 'Free-range Eggs', description: 'Pack of 12', price: 199, image: 'https://farmmadefoods.com/cdn/shop/files/6-2_ef74341e-5308-4ff0-a0bf-64cb1ae731f7.png?v=1695897081', category: 'Eggs' },

  { name: 'Broccoli', description: 'Fresh broccoli head', price: 49, image: 'https://www.verywellhealth.com/thmb/lT-kFU5nZuCHkCmHsOAHiDwzmQI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1445669257-f933e7d2109b4e809b4764204c8baa94.jpg', category: 'Vegetables' },
  { name: 'Spinach', description: 'Washed spinach 250g', price: 39, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=60', category: 'Vegetables' },
  { name: 'Tomatoes', description: 'Vine-ripened tomatoes 1kg', price: 69, image: 'https://images-prod.healthline.com/hlcmsresource/images/AN_images/tomatoes-1296x728-feature.jpg', category: 'Vegetables' },

  { name: 'Potatoes', description: 'Fresh potatoes 1kg', price: 45, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=60', category: 'Vegetables' },
  { name: 'Onions', description: 'Red onions 1kg', price: 55, image: 'https://en-chatelaine.mblycdn.com/ench/resized/2018/08/1600x900/types-of-onions.jpg', category: 'Vegetables' },
  { name: 'Cucumbers', description: 'Crisp cucumbers 500g', price: 35, image: 'https://swanhose.com/cdn/shop/articles/watering-cucumbers_800x.jpg?v=1752073278', category: 'Vegetables' },

  { name: 'Masoor Dal', description: 'Red lentils 1kg', price: 139, image: 'https://gonefarmers.com/cdn/shop/products/image_cc51f8bf-501f-4ae7-a546-3a579299ca9d_580x.jpg?v=1596652176', category: 'Pulses' },
  { name: 'Chana Dal', description: 'Split chickpeas 1kg', price: 129, image: 'https://vibrantliving.in/cdn/shop/files/ChanaDalSplit.jpg?v=1731059251&width=2048', category: 'Pulses' },
  { name: 'Olive Oil', description: 'Extra virgin 1L', price: 799, image: 'https://www.greendna.in/cdn/shop/products/oliveoil_1200x1200.jpg?v=1738823916', category: 'Oil' },
  { name: 'Honey', description: 'Raw organic 500g', price: 349, image: 'https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/04/honey-1296x728-header.jpg?w=1155&h=1528', category: 'Pantry' },

  // Additional Dairy
  { name: 'Cow Milk', description: 'Fresh cow milk 1L', price: 75, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=60', category: 'Dairy' },
  { name: 'Paneer', description: 'Fresh paneer 200g', price: 119, image: 'https://img.freepik.com/premium-photo/homemade-indian-paneer-cheese-wooden-bowl_114420-599.jpg', category: 'Dairy' },
  { name: 'Butter', description: 'Unsalted butter 500g', price: 279, image: 'https://www.foodie.com/img/gallery/the-best-grocery-store-butter-brand-is-rich-and-creamy/intro-1741793695.jpg', category: 'Dairy' },
  { name: 'Cheese', description: 'Cheddar cheese 200g', price: 199, image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=60', category: 'Dairy' },
  { name: 'Ghee', description: 'Pure cow ghee 500ml', price: 499, image: 'https://m.media-amazon.com/images/I/51cAnoCvWkL._AC_UF894,1000_QL80_.jpg', category: 'Dairy' },
  { name: 'Curd', description: 'Fresh dahi 500g', price: 60, image: 'https://tiimg.tistatic.com/fp/2/007/729/1-kilograms-original-taste-smooth-natural-healthy-delicious-fresh-curd-058.jpg', category: 'Dairy' },
];

(async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Seeded products:', products.length);
  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
})();
