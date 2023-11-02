const express = require("express");
require("./dataBase/config");
const users = require("./dataBase/User");
const product = require("./dataBase/Product");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/register", async (req, resp) => {
  console.log(req.body);
  let user = new users(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  resp.send(result);
});

app.post("/login", async (req, resp) => {
  if (req.body.password && req.body.email) {
    let user = await users.findOne(req.body).select("-password");
    if (user) {
      resp.send({ result: "success", message: "user found", data: { user } });
    } else {
      resp.send({ result: "failed", message: "No user found", data: { user } });
    }
  } else {
    resp.send({ result: "failed", message: "email and password mandotry" });
  }
});

app.post("/add-product", async (req, resp) => {
  let products = new product(req.body);
  let result = await products.save();
  resp.send(result);
});

app.delete("/products/:id", async (req, resp) => {
  let result = await product.deleteOne({ _id: req.params.id });
  resp.send(result);
});

app.get("/products", async (req, resp) => {
  const products = await product.find();
  if (products.length > 0) {
    resp.send(products);
  } else {
    resp.send({ result: "failed", message: "product not found!" });
  }
});

app.listen(1200);
