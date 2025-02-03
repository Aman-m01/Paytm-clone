const app = require("./app");
const connectDB = require("./config/connectDB");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
    console.log("Server is running on port 3000");
})
