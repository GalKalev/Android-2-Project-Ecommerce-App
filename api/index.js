
require('dotenv').config({ path: '../.env' })

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");


const app = express();
const PORT = 1400;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");


//! TO DO: username: galA and password: gal318657632 to env
mongoose.connect("mongodb+srv://galA:gal318657632@cluster0.d2vz1zi.mongodb.net/ecommerceApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log("Error connecting to MongoDB", err);
});



app.listen(PORT, () => {
  console.log(`Server is running at ${process.env.IP_ADDRESS}:${PORT}`);
});

const User = require("./models/user");
const Order = require("./models/order");
const Product = require("./models/product");
const Pokemon = require('./models/pokemon');

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log(`req: ${req.body.email}`);
    if (!name || !email || !password) {
      console.log("undefined values");
      return
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      console.log("Email already registered:", email); // Debugging statement
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create a new user
    const newUser = new User({ name: name, email: email, password: password });

    // Save the user to the database
    await newUser.save();

    // Debugging statement to verify data
    console.log("New User Registered:", newUser);

    res.status(201).json({
      message:
        "Registration successful. Please check your email for verification.",
    });
  } catch (error) {
    console.log("Error during registration:", error); // Debugging statement
    res.status(500).json({ message: "Registration failed" });
  }
});


// Endpoint for login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;


    // Check if the user exist
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the password is correct
    if (user.password !== password) {
      // TODO: check if the message is correct in terms of security.
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.status(201).json({ message: "Login successful" });


  } catch (error) {
    res.status(500).json({ message: 'Login Failed' });
    console.log(error);
  }
});

app.post('/addPokemon', async (req, res) => {
  try {
    // Saving the Pokemon to database to be sold
    // const { user } = req;
    console.log(user);
    const {
      name,
      url,
      img,
      gender,
      level,
      isShiny,
      abilities,
      moves,
      species,
      stats,
      types,
      price,
      amount } = req.body;
    const newPokemon = new Product({
      user: user,
      name: name,
      url: url,
      price: price,
      image: img,
      quantity: amount,
      details: {
        isShiny: isShiny,
        abilities: abilities,
        moves: moves,
        species: species,
        stats: stats,
        types: types,
      }
    });

    await newPokemon.save();
    console.log(`Received Pokemon: ${name}, ${url}, ${img}, ${gender}, ${level}, ${isShiny}, ${abilities}, ${moves}, ${species}, ${stats.hp}, ${types}, ${price}, ${amount}`);

    // const pokemon = new Pokemon(user)
    res.status(201).json({ message: "Pokemon added successfully" });

  } catch (e) {
    res.status(500).json({ message: 'Adding product Failed' });
    console.log(`Error adding pokemon: ${e.message}`);
  }
})




