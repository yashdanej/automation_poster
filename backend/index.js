const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const userRouter = require("./routes/userRouter");

app.use("/api/v1", userRouter.router);

const connect = async () => {
    try{
        await mongoose.connect("mongodb+srv://yashdanej2004:ixEoKnALhDom9zSQ@cluster0.acpm1rg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log("Conected to backend")
    }catch (error){
        throw error;
    }
}

app.listen(PORT, () => {
    connect();
    console.log("Server started");
});