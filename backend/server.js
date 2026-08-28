require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const groupRoutes = require('./routes/groupRoutes')
const expenseRoutes = require('./routes/expenseRoutes')


const app = express();

app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("connected");
    })
    .catch((err) => {
        console.log("MongoDb connection error" , err);
    });

app.get('/' , (req , res) => {
    res.send("Api is running");
});

app.use('/api/auth' , authRoutes)
app.use('/api/groups' , groupRoutes)
app.use('/api/expenses' , expenseRoutes)


app.listen(process.env.PORT , () =>{
    console.log(`server running on port ${process.env.PORT}`)
})