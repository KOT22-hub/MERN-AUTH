const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const cookieparse = require('cookie-parser');
const app = express();
const authroute = require('./route/auth.route');
const { userRouter } = require('./route/userRoute');
const port = process.env.PORT;
const url = process.env.URL
app.use(express.json());
const allowedOrigins = ['http://localhost:5173','http://localhost:3000']
app.use(cors({
    origin: allowedOrigins, // ✅ match your frontend
    credentials: true
  }));
  
app.use(cookieparse());
app.use('/api/auth/',authroute);
app.use('/api/user/',userRouter)
const mongoose = require('mongoose');

mongoose.connect(url).then(()=>{
    console.log('connected to database successfully')
}).catch((error)=>{
    console.log({message:error.message})
})
app.get('/',(req,res)=>{
    res.send("hello from server")
})


app.listen(port,()=>{
    console.log(`port is listening at http://localhost:${port}`);
})