const express = require('express')
const mongoose = require('mongoose')
const router = require('express').Router()
const User = require('./modules/user')
const Task = require('./modules/task')
const app=express()
const authMiddleware = require('./routes/auth')
require('dotenv').config()
require('./Conn/conn')
const cors = require('cors')
const UserAPI = require('./routes/user')
const TaskAPI = require('./routes/task')
app.use(cors())
app.use(express.json())
app.use('/api',UserAPI)
app.use('/api/tasks',TaskAPI)

app.post('/api/tasks/create-task',authMiddleware,async(req,res)=>{
    try{
        console.log("inside post callback1")
        const {title,desc,due} = req.body
        console.log("inside post callback2")
        const {id}=req.headers
        console.log("inside post callback3")
        const newTask=new Task({title:title,desc:desc,due:due})
        console.log("inside post callback4")
        const saveTask = await newTask.save()
        console.log("inside post callback5")
        const taskId=saveTask._id
        console.log("inside post callback6")
        console.log(typeof taskId)
        console.log(typeof id)
        const userId = new mongoose.Types.ObjectId(id);
        console.log(typeof userId)
        await User.findByIdAndUpdate(userId, { $push: { tasks: taskId } });
        console.log("inside post callback7")
        res.status(200).json({message: "Task Created"})

    }catch(error){
        res.status(402).json({message:"Internal Server Error"})
    }
})

app.use('/',(req,res)=>{
    res.send("Hello from backend")
})


app.listen(3000,()=>{
    console.log("Server is running")
})
