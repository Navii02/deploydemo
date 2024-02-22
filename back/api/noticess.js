const express = require("express");
const path = require("path");

const app = express();

app.get("/images", (req, res) => {
    // Read the list of image files from the "images" folder and send it as a response
    const imageFiles = fs.readdirSync(path.join(__dirname, "uploads"));
    res.json(imageFiles);
  });
  app.use(express.static(path.join(__dirname, "uploads", )));
module.exports =app  