const express = require('express');
const connectDB = require('./config/db');
const userRoute = require('./routes/userRoutes');
require("dotenv").config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 9000
const DB_URL = process.env.DB_URL

app.get("/", (req, res) => {
    res.send("This is home route");
});


app.use('/user', userRoute);

app.listen(PORT, async () => {
    try{
        await connectDB(DB_URL);
        console.log("Database connected successfully!");
        console.log(`Server is runnig at http://localhost:${PORT}`)
    }catch(err) {
        console.log(err);
    }
})

