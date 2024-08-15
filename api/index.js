const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

// const { PORT, IP_ADDRESS } = require('@env');
// const PORT = process.env.PORT || 1400;
const PORT = 1400;
const IP_ADDRESS = '10.0.0.25';
// const IP_ADDRESS = '192.168.68.113'


const app = express();
const URI = "mongodb+srv://galA:gal318657632@cluster0.d2vz1zi.mongodb.net/ecommerceApp"

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log("Error connecting to MongoDB", err);
});



app.listen(PORT, () => {
  console.log(`Server is running at ${IP_ADDRESS}:${PORT}`);
});

const User = require("./models/user");
const Order = require("./models/order");
const Product = require("./models/product");
const Cart = require('./models/cart');


// app.get("/health", (req, res) => {res.send("hello")})
//---------- User Method ----------
// register new user
app.post("/user/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log(`req: ${email}`);
    if (!name || !email || !password) {
      console.log("undefined values");
      return res.status(400).json({ message: "Name, email, or password are missing" });
    }
    console.log(name, email, password);

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

    console.log("New User Registered:", newUser);

    // Build new cart for user
    const cart = new Cart({ user: newUser._id });
    await cart.save();
    console.log(`New cart for user created`);

    return res.status(201).json({ message: "Register successful", userId: newUser._id, email: newUser.email, name: newUser.name });
  } catch (error) {
    console.log("Error during registration:", error); // Debugging statement
    return res.status(500).json({ message: "Registration failed" });
  }
});

// login user
app.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.debug(`checking if user exists: ${email}, ${password}`)

    // Check if the user exist
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the password is correct
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    return res.status(200).json({ message: "Login successful", userId: user._id, email: user.email, name: user.name });


  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Login Failed' });
  }
});

// user edit username
app.post('/user/edit', async (req, res) => {
  console.log("try to edit user name");
  try {
    const { userId, newName } = req.body;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      console.log("user not found");
      return res.status(404).json({ message: "user not found" });
    }

    user.name = newName;
    await user.save();

    console.log("username edited successfully");
    return res.status(200).json({ message: "username edited successfully", data:user })
  } catch (error) {
    console.log("ERROR: ", error);
    return res.status(500).json({ message: 'Edit user failed' });
  }
})

//---------- Pokemon Stock Methods ----------
// Add new Pokemon to Products list
app.post('/Pokemon', async (req, res) => {
  try {
    console.log('Trying to add Pokemon');

    const {
      user,
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
      quantity } = req.body;



    if (!user || !name || !url || !img || !(0 <= gender <= 1) || !level || !abilities || !moves || !species || !stats || !types || !price || !quantity) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newPokemon = new Product({
      user,
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
      quantity
    });
    console.debug(`new Pokemon object: ${newPokemon}`);


    await newPokemon.save();
    console.log(`new Pokemon added: ${newPokemon}`);
    return res.status(201).json({ message: "Pokemon added successfully" });

  } catch (e) {
    console.log(`Error adding pokemon: ${e.message}`);
    return res.status(500).json({ message: 'Adding Pokemon Failed' });
  }
})


// Get all Available Pokemons in Store
app.get('/Pokemon', async (req, res) => {
  try {
    console.log("trying fetching Pokemons");
    // const products = await Product.find({});
    const products = await Product.find({}).populate('user', 'name'); // Only include the username field
    // console.log(products[0]);
    return res.status(200).json(products);
  } catch (error) {

    console.log(`Error fetching Pokemons: ${error.message}`);
    return res.status(500).json({ message: "Fetching products failed" });
  }
})

// get all Pokemons in stock of specific user seller
app.get('/Pokemon/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const products = await Product.find({ user: userId });

    return res.status(200).json({ data: products });
  } catch (error) {
    console.error('Error fetching products for user:', error);
    return res.status(500).json({ message: 'Failed to retrieve products' });
  }
});

// Update existing Pokemon product
app.put('/Pokemon/:productId', async (req, res) => {
  try {
    console.log('Trying to update Pokemon');

    const { productId } = req.params;
    const updateData = req.body;

    // Ensure required fields are present (adjust based on your requirements)
    const requiredFields = ['user', 'name', 'url', 'img', 'gender', 'level', 'isShiny', 'abilities', 'moves', 'species', 'stats', 'types', 'price', 'quantity'];
    const missingFields = requiredFields.filter(field => !(field in updateData));

    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    const updatedPokemon = await Product.findByIdAndUpdate(productId, updateData, { new: true });

    if (!updatedPokemon) {
      return res.status(404).json({ message: 'Pokemon not found' });
    }

    // Update all carts containing this product
    const carts = await Cart.find({ 'products.product': productId }).populate('products.product');

    for (const cart of carts) {
      // Update the product details in each cart
      for (const item of cart.products) {
        if (item.product._id.toString() === productId.toString()) {
          item.product = updatedPokemon;
        }
      }

      // Recalculate total price for the cart
      cart.totalPrice = cart.products.reduce((acc, item) => acc + (item.quantity * item.product.price), 0);

      await cart.save();
    }

    console.log(`Pokemon updated: ${updatedPokemon}`);
    return res.status(200).json({ message: 'Pokemon updated successfully', data: updatedPokemon });

  } catch (e) {
    console.log(Error (`updating Pokemon: ${e.message}`));
    return res.status(500).json({ message: 'Updating Pokemon Failed' });
  }
});

// Remove product from stock
app.post('/Pokemon/remove', async (req, res) => {
  try {
    const { productId } = req.body;
    console.debug(`req body = productId ${productId}`);

    if (!productId) {
      console.debug("missing product id, 404")
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const carts = await Cart.find({ 'products.product': productId });
    for(const cart of carts) {
      cart.products = cart.products.filter(item => item.product.toString() !== productId.toString());
      cart.totalPrice = cart.products.reduce((acc, item) => acc + (item.quantity * item.product.price), 0);

      await cart.save();
    }

    const product = await Product.findByIdAndDelete({_id: productId})
    if (!product) {
      console.debug("product not found, 404");
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log(`product found and deleted: ${product}`);



    return res.status(200).json({ message: 'Product removed from stock', success:true });
  } catch (error) {
    console.log('Error removing product from stock:', error);
    return res.status(500).json({ message: 'Failed to remove product from stock', success:false });
  }
});


//---------- Cart Methods ----------
// Add Pokemon to user's cart
app.post('/cart/add', async (req, res) => {
  try {
    console.log("Trying add to item to cart");
    const { userId, productId, quantity } = req.body;
    console.debug(`userId=${userId}, productId=${productId}, quantity=${quantity}`);
    if (!userId || !productId || !quantity || quantity < 0) {
      console.log("something missing...")
      return res.status(400).json({ message: 'Invalid product - missing fields' });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      console.log("no cart for user. creating a new cart.")
      cart = new Cart({ user: userId });
    }

    const product = await Product.findById(productId);
    if (!product) {
      console.log("product not found.");
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product already in cart. If  so - get its index and add quantity. Else - add the product to cart
    const productIndex = cart.products.findIndex((p => p.product.equals(productId)));
    if (productIndex > -1) {
      console.log("product already in cart. change quantity")
      cart.products[productIndex].quantity = quantity;
    } else {
      console.log("adding new product to cart")
      cart.products.push({ product: productId, quantity });
    }

    // Update total price
    console.debug("Updating total price");
    //cart.totalPrice = cart.totalPrice + product.price * quantity; //TODO: calc totalPrice of cart
    let totalPrice = 0;
    for (const item of cart.products) {
      const itemProduct = item.product.equals(productId) ? product : await Product.findById(item.product);
      totalPrice += itemProduct.price * item.quantity;
    }
    cart.totalPrice = totalPrice;
    console.debug(`total price = ${cart.totalPrice}`);

    console.debug("saving new cart with total price of " + cart.totalPrice)
    await cart.save();

    return res.status(201).json({ message: `${cart.products.length} products added successfully` });
  } catch (error) {
    console.log(`Error adding product to cart: ${error}`);
    return res.status(500).json({ message: `Failed to add product to cart` });

  }
})

// Get user's cart
app.get('/cart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Trying fetching cart for user ${userId}`);
    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'products.product',
      populate: {
        path: 'user',
        select: 'name'
      }
    })

    return res.status(200).json(cart);
  } catch (error) {
    console.log(`Error get cart: ${error}`);
    return res.status(500).json({ message: 'Failed to retrieve cart' })
  }
})

// Remove product from cart
app.post('/cart/remove', async (req, res) => {
  try {
    const { userId, productId, price } = req.body;
    console.debug(`req body = userID ${userId} and productId ${productId}`);

    if (!userId || !productId) {
      console.debug("missing something, 404")
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const cart = await Cart.findOne({ user: userId });
    console.log(`got cart ${cart}`);
    if (!cart) {
      console.log("no cart for user");
      return res.status(404).json({ message: 'Cart not found' });
    }

    const product = cart.products.find(p => p.product._id.equals(productId));
    console.log(`product found: ${product}`);
    cart.products = cart.products.filter(p => !p.product._id.equals(productId));

    console.log(cart.products);
    // Update total price
    cart.totalPrice -= price * product.quantity;
    console.log(`total price = ${cart.totalPrice}`);


    await cart.save();
    console.log("saved cart successfully");

    return res.status(200).json({ message: 'Product removed from cart', cart });
  } catch (error) {
    console.log('Error removing product from cart:', error);
    return res.status(500).json({ message: 'Failed to remove product from cart' });
  }
});


//---------- Checkout Methods ----------
// Checkout cart for user
app.post('/checkout', async (req, res) => {
  console.debug("Trying to checkout cart");
  try {
    const { userId, region, location, houseNum, cardOwner, cardNumber, expirationDate, cvv } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID required' });
    }
    if (!region || !location || !houseNum || !cardOwner || !cardNumber || !expirationDate || !cvv) {
      return res.status(400).json({ message: 'One or more parameters missing...' });
    }

    const cart = await Cart.findOne({ user: userId }).populate('products.product');
    console.debug(`got cart ${cart}`);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // build full products list and update stock
    const productsList = [];
    for (const cartItem of cart.products) {
      const stockProduct = await Product.findById(cartItem.product._id);
      if (stockProduct) {
        // Check stock and update quantities
        if (stockProduct.quantity >= cartItem.quantity) {
          stockProduct.quantity -= cartItem.quantity;

          // Check if the stock is zero after decrementing
          if (stockProduct.quantity === 0) {
            await Product.findByIdAndDelete(stockProduct._id);
            console.log(`Product ${stockProduct.name} removed from stock due to zero quantity`);
          } else {
            await stockProduct.save();
          }
        } else {
          return res.status(400).json({ message: `Not enough stock for ${stockProduct.name}` });
        }

        // Add the product with full details to the order's products list
        productsList.push({
          product: {
            _id: stockProduct._id,
            user: stockProduct.user,
            name: stockProduct.name,
            url: stockProduct.url,
            price: stockProduct.price,
            img: stockProduct.img,
            isShiny: stockProduct.isShiny,
            gender: stockProduct.gender,
            level: stockProduct.level,
            abilities: stockProduct.abilities,
            moves: stockProduct.moves,
            species: stockProduct.species,
            stats: stockProduct.stats,
            types: stockProduct.types,
            createdAt: stockProduct.createdAt
          },
          quantity: cartItem.quantity
        });
      }
    }

    // create a new order
    const order = new Order({
      user: userId,
      products: productsList,
      totalPrice: cart.totalPrice,
      shippingAddress: {
        region,
        location,
        houseNum,
      },
      paymentDetails: {
        cardOwner,
        cardNumber,
        expirationDate,
        cvv
      }
    });
    console.debug("made a new order item")
    await order.save();
    console.debug("saved new order!")

    // clear the cart
    cart.products = [];
    cart.totalPrice = 0;
    await cart.save();

    return res.status(200).json({ message: 'Checkout successful', success: true });
  } catch (error) {
    console.log('Error during checkout:', error);
    return res.status(500).json({ message: 'Checkout failed', success: false });
  }
});


app.get('/order/:userId', async (req, res) => {

  try {
    const { userId } = req.params;
    console.log(`Trying fetching order for user ${userId}`);
    const orders = await Order.find({ user: userId })

    return res.status(200).json({ data: orders });
  } catch (error) {
    console.log(`Error get orders: ${error}`);
    return res.status(500).json({ message: 'Failed to retrieve orders' })
  }
});


