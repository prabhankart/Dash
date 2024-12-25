const express = require("express");
const cors = require("cors");

require("./db/config"); // Ensure DB connection logic is correctly set up
const User = require("./db/User"); // Ensure you're using the correct model
const Product = require("./db/Product");
const app = express();

const connectDB = require("./db/config");
connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  console.log("RCBIANS");
  res.send("Hello Rcbians");
});

app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  res.send(result);
});

app.post("/login", async (req, res) => {
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      res.send(user);
    } else {
      res.send({ result: "No User FOUND !!!" });
    }
  } else {
    res.send({ result: "No User FOUND !!!" });
  }
});


app.post("/add-product", async (req, res) => {
  let product = new Product(req.body);
  let result = await product.save();
  res.send(result);
});
app.get("/products",async(req,res)=>{
  const products = await Product.find();
  if(products.length > 0){
    res.send(products)
  }else{
    res.send({result:"No Product Found !!!!"})
  }
})

app.delete("/product/:id",async(req,res)=>{
  let result = await Product.deleteOne({_id:req.params.id});
  res.send(result)
})
app.get("/product/:id", async(req,res)=>{
  let result = await Product.findOne({_id:req.params.id});
  if(result){
    res.send(result)
  }else{
    res.send( {result: "No Record Found..."} )
  }
})
// Protected route to update a product by ID
app.put("/product/:id",  async (req, res) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  res.send(result);
});
// Protected search route
app.get("/search/:key", async (req, res) => {
  let result = await Product.find({
    $or: [
      { name: { $regex: req.params.key, $options: "i" } },
      { company: { $regex: req.params.key, $options: "i" } },
      { category: { $regex: req.params.key, $options: "i" } },
    ],
  });
  res.send(result);
});


app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
