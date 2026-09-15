require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http')
const cors = require('cors')
const {Server} = require('socket.io')
const authRoutes = require('./routes/authRoutes')
const groupRoutes = require('./routes/groupRoutes')
const expenseRoutes = require('./routes/expenseRoutes')
const settlementRoutes = require('./routes/settlementRoutes')


const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://split-ease-ten.vercel.app'  
]

app.use(cors({
  origin: function (origin, callback) {

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))

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
app.use('/api/settlements' , settlementRoutes)

const server = http.createServer(app)
const io = new Server(server , {
    cors : {
        origin : allowedOrigins
    }
})

app.set('io',io)

io.on('connection' , (socket) =>{
    console.log('A user connected : ' , socket.id)

    socket.on('joinGroup' , (groupId) =>{
        socket.join(groupId)
        console.log(`Socket ${socket.id} joined group ${groupId}`)
    })

    socket.on('disconnect', () =>{
        console.log('User disconnected : ', socket.id)
    })
})

server.listen(process.env.PORT , () =>{
    console.log(`Server running on port ${process.env.PORT}`)
})