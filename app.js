//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const wheekyData = require(__dirname + "/data/wheekies.json");
const foodData = require(__dirname + "/data/food.json");
const Item = require(__dirname + "/mongoose/items.js");

const port = 3000;
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

app.set("view engine", "ejs");

///////////    MONGOOSE CONNECTION
mongoose.connect("mongodb+srv://agArt:<password>@udemycluster.oihtb.mongodb.net/wheekyShopping?retryWrites=true&w=majority");

app.get("/", (req, res) => {
  res.render("main");
});

app.get("/bios", (req, res) => {
  res.render("bios", {
    wheekies: wheekyData
  });
});

app.get("/info", (req, res) => {
  res.render("info");
});

app.get("/shopping", async (req, res) => {
  Item.find({}, async (err, foundList) => {
    res.render("shopping", {
      menu: foodData,
      shoppingItems: foundList
    });
  });
});

app.post("/shopping", async (req, res) => {
  const itemName = req.body.foodList;
  console.log(itemName);
  const item = new Item({
    name: itemName
  });
  await item.save().then( () => {
    res.redirect("/shopping");
  });
});

app.post("/", async (req, res) => {
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });
  await item.save().then(() => {
    res.redirect("/shopping");
  });
});

app.post("/delete", (req, res) => {
  const checkedId = req.body.checkbox;
  Item.findByIdAndDelete(checkedId, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
    }
    res.redirect("shopping");
  });
});


//////////////////////////////////////////////////
app.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});
