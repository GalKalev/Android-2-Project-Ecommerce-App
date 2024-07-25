const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const { PORT, IP_ADDRESS } = require('@env');

const app = express();
const URI = "mongodb+srv://galA:gal318657632@cluster0.d2vz1zi.mongodb.net/ecommerceApp"

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//TODO: username: galA and password: gal318657632 to env
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log("Error connecting to MongoDB", err);
});



app.listen(1400, () => {
  console.log(`Server is running at ${IP_ADDRESS}:${PORT}`);
});

const User = require("./models/user");
const Order = require("./models/order");
const Product = require("./models/product");
const Pokemon = require('./models/pokemon');
const Cart = require('./models/cart');

// app.get("/health", (req, res) => {res.send("hello")})
//---------- Register Method ----------
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log(`req: ${email}`);
    if (!name || !email || !password) {
      console.log("undefined values");
      return res.status(400).json({ message: "Name, email, or password are missing" });
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

    return res.status(201).json({
      message:
          "Registration successful. Please check your email for verification.",
    });
  } catch (error) {
    console.log("Error during registration:", error); // Debugging statement
    return res.status(500).json({ message: "Registration failed" });
  }
});


// ---------- Login Method ----------
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

    return res.status(201).json({ message: "Login successful" });


  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Login Failed' });
  }
});


//---------- Pokemon Stock Methods ----------
// Add new Pokemon to Products list
app.post('/Pokemon', async (req, res) => {
  try {
    console.log('addPokemon');

    const {userId} = req.body;
    console.log(`userId = ${userId}`)

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

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


    if (!name || !url || !img || !gender || !level || !isShiny || !abilities || !moves || !species || !stats || !types || !price || !amount) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newPokemon = new Pokemon({
      user: userId,
      name,
      url,
      price,
      image: img,
      quantity: amount,
      details: {
        isShiny,
        abilities,
        moves,
        species,
        stats,
        types,
      },
      gender,
      level
    });


    await newPokemon.save();
    console.log(`new Pokemon added: ${newPokemon}`);
    return res.status(201).json({ message: "Pokemon added successfully" });

  } catch (e) {
    console.log(`Error adding pokemon: ${e.message}`);
    return res.status(500).json({ message: 'Adding Pokemon Failed' });
  }
})

// Get all Available Pokemons in Store
app.get('/Pokemon',async (req,res)=>{
  try{
    console.debug("trying fetching Pokemons");
    const products = await Product.find({});
    return res.status(200).json(products);
  } catch (error){

    console.log(`Error fetching Pokemons: ${error.message}`);
    return res.status(500).json({message:"Fetching products failed"});
  }
})


//---------- Cart Methods ----------
// Add Pokemon to user's cart
app.post('/cart/add', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || !quantity || quantity < 0) {
      return res.status(400).json({ message: 'Invalid product - missing fields' });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product already in cart. If  so - get its index and add quantity. Else - add the product to cart
    const productIndex = cart.products.findIndex((p => p.product.equals(productId)));
    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    // Update total price
    cart.totalPrice = cart.products.reduce((prevTotal, item) => {
      const product = cart.products.find(p => p.product.equals(item.product));
      return prevTotal + (product ? product.price * item.quantity : 0);
    }, 0);

    await cart.save();

    res.status(201).json({ message: `${cart.products.length} products added successfully` });
  } catch (error) {
    console.log(`Error adding product to cart: ${error}`);
    res.status(500).json({message:`Failed to add product to cart`});

  }
})

// Get user's cart
app.get('/cart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ user: userId }).populate('products.product');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    console.log(`Error get cart: ${error}`);
    return res.status(500).json({ message: 'Failed to retrieve cart' })
  }
})

// Remove product from cart
app.post('/cart/remove', async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.products = cart.products.filter(p => !p.product.equals(productId));

    // Update total price
    cart.totalPrice = cart.products.reduce((total, item) => {
      const product = cart.products.find(p => p.product.equals(item.product));
      return total + (product ? product.price * item.quantity : 0);
    }, 0);

    await cart.save();

    return res.status(200).json({ message: 'Product removed from cart', cart });
  } catch (error) {
    console.log('Error removing product from cart:', error);
    return res.status(500).json({ message: 'Failed to remove product from cart' });
  }
});


//---------- Checkout Methods ----------
// Checkout cart for user
app.post('checkout', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'User ID required' });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    //TODO: Handle checkout logic (create order, payment details, remove from stock...)

    // Clear the cart
    cart.products = [];
    cart.totalPrice = 0;
    await cart.save();

    return res.status(200).json({ message: 'Checkout successful' });
  } catch (error) {
    console.log('Error during checkout:', error);
    return res.status(500).json({ message: 'Checkout failed' });

  }
})

