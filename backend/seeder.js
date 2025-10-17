import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Load env vars
dotenv.config();

// Load models
import Product from './models/product/productModel.js';
import Category from './models/product/categoryModel.js';
import Brand from './models/product/brandModel.js';
import Tag from './models/product/tagModel.js';
import User from './models/user/userModel.js';

// Connect to DB
connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await Category.deleteMany();
    await Brand.deleteMany();
    await Tag.deleteMany();

    console.log('Data cleared...');

    // --- Create Users, Categories, Brands, and Tags ---
    const users = await User.insertMany([
        { 
            firstName: 'Admin', lastName: 'User', username: 'adminuser', 
            email: 'admin@example.com', phoneNumber: '+919999999999', 
            password: 'password123', role: 'admin' 
        },
        { 
            firstName: 'John', lastName: 'Doe', username: 'johndoe', 
            email: 'dhiman@gmail.com', phoneNumber: '+918888888888', 
            password: 'dhiman123', role: 'user' 
        }
    ]);
    
    const adminUserId = users[0]._id;

    const categories = await Category.insertMany([
      { name: 'Electronics' },
      { name: 'Books' },
      { name: 'Clothing' },
      { name: 'Home & Kitchen' }
    ]);

    const brands = await Brand.insertMany([
      { name: 'Sony' },
      { name: 'Penguin Books' },
      { name: 'Nike' },
      { name: 'Prestige' }
    ]);

    const tags = await Tag.insertMany([
      { name: 'Gaming' },
      { name: 'Fiction' },
      { name: 'Sportswear' },
      { name: 'Appliances' },
      { name: 'Best Seller' }
    ]);

    // --- Map data for easy access ---
    const categoryMap = {
      'Electronics': categories[0]._id,
      'Books': categories[1]._id,
      'Clothing': categories[2]._id,
      'Home & Kitchen': categories[3]._id
    };

    const brandMap = {
      'Sony': brands[0]._id,
      'Penguin': brands[1]._id,
      'Nike': brands[2]._id,
      'Prestige': brands[3]._id
    };

    const tagMap = {
        'Gaming': tags[0]._id,
        'Fiction': tags[1]._id,
        'Sportswear': tags[2]._id,
        'Appliances': tags[3]._id,
        'Best Seller': tags[4]._id
    };

    // --- Sample Products ---
    const products = [
      {
        name: 'PlayStation 5',
        description: 'Next-gen gaming console with ultra-high-speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio.',
        price: 49999,
        images: [{ public_id: 'sample_id', url: 'https://i.imgur.com/1qiNTSs.png' }],
        category: categoryMap['Electronics'],
        brand: brandMap['Sony'],
        tags: [tagMap['Gaming'], tagMap['Best Seller']],
        stock: 15,
        user: adminUserId,
      },
      {
        name: 'The Alchemist',
        description: 'A classic novel by Paulo Coelho about a shepherd boy named Santiago who travels from his homeland in Spain to the Egyptian desert in search of a treasure.',
        price: 349,
        images: [{ public_id: 'sample_id_2', url: 'https://i.imgur.com/13acETV.jpeg' }],
        category: categoryMap['Books'],
        brand: brandMap['Penguin'],
        tags: [tagMap['Fiction'], tagMap['Best Seller']],
        stock: 100,
        user: adminUserId,
      },
      {
        name: 'Nike Air Max',
        description: 'Comfortable and stylish sneakers for everyday wear and athletic activities. Features the iconic Nike Air cushioning.',
        price: 8999,
        images: [{ public_id: 'sample_id_3', url: 'https://i.imgur.com/djljEmv.jpeg' }],
        category: categoryMap['Clothing'],
        brand: brandMap['Nike'],
        tags: [tagMap['Sportswear']],
        stock: 50,
        user: adminUserId,
      },
      {
        name: 'Prestige Induction Cooktop',
        description: 'An efficient and easy-to-use induction cooktop that makes cooking faster and safer. Perfect for modern kitchens.',
        price: 2499,
        images: [{ public_id: 'sample_id_4', url: 'https://i.imgur.com/a6w3PuI.jpeg' }],
        category: categoryMap['Home & Kitchen'],
        brand: brandMap['Prestige'],
        tags: [tagMap['Appliances']],
        stock: 75,
        user: adminUserId,
      }
    ];

    await Product.insertMany(products);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();
    await Brand.deleteMany();
    await Tag.deleteMany();
    await User.deleteMany();
    
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}