 const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const methodOverride = require("method-override");

const authController = require("./controllers/auth");
const foodsController = require("./controllers/foods");
const usersController = require("./controllers/users");

const isSignedIn = require("./middleware/is-signed-in");
const passUserToView = require("./middleware/pass-user-to-view");

const app = express();

// -------------------- DATABASE --------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/cookbook")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// -------------------- VIEW ENGINE --------------------
app.set("view engine", "ejs");

// -------------------- MIDDLEWARE --------------------
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "cookbook-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// pass logged-in user to all views
app.use(passUserToView);

// -------------------- ROUTES --------------------

// Home Page
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// Authentication routes (Sign In / Sign Up)
app.use("/auth", authController);

// Protect routes after login
app.use(isSignedIn);

// Pantry routes
app.use("/users/:userId/foods", foodsController);

// Community routes
app.use("/users", usersController);

// -------------------- SERVER --------------------
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});