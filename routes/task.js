const router = require('express').Router()
const Task=require('../modules/task')
const User = require('../modules/user')
const authMiddleware = require('./auth')
const mongoose = require('mongoose')


router.get('/get-all-tasks',authMiddleware,async(req,res)=>{
    try{
        const {id} = req.headers
        const userData = await User.findById(id).populate({
            path:"tasks",
            options:{sort: {createdAt: -1}}
    })
    if (!userData) {
        return res.status(404).json({ message: "User not found" })
    }
        res.status(200).json({data: userData})
    }catch(error){
        res.status(400).json({message:"Internal Server Error"})
    }
})


router.delete('/delete-task/:id',authMiddleware,async(req,res)=>{
    try{
        const {id} = req.params
        const userId = req.headers.id
        await Task.findByIdAndDelete(id)
        await User.findByIdAndUpdate(userId,{ $pull :{tasks: id }})      
        res.status(200).json({message: "task deleted successfully"})
    }catch(error){
        res.status(400).json({message:"Internal Server Error"})
    }
})

router.put('/update-task/:id',authMiddleware,async(req,res)=>{
    try{
        const {id} = req.params
        const {title,desc,due}=req.body
        await Task.findByIdAndUpdate(id,{ title : title , desc : desc , due : due})    
        res.status(200).json({message: "task updated successfully"})
    }catch(error){
        res.status(400).json({message:"Internal Server Error"})
    }
})

router.put('/update-imp-task/:id',authMiddleware,async(req,res)=>{
    try{
        const {id} = req.params
        const TaskData = await Task.findById(id)
        const ImpTask = TaskData.isImportant
        await Task.findByIdAndUpdate(id,{isImportant: !ImpTask})
        
        res.status(200).json({message: "task updated successfully"})
    }catch(error){
        res.status(400).json({message:"Internal Server Error"})
    }
})

router.put('/update-complete-task/:id',authMiddleware,async(req,res)=>{
    try{
        const {id} = req.params
        const TaskData = await Task.findById(id)
        const CompleteTask = TaskData.isCompleted
        await Task.findByIdAndUpdate(id,{isCompleted: !CompleteTask})
        
        res.status(200).json({message: "task updated successfully"})
    }catch(error){
        res.status(400).json({message:"Internal Server Error"})
    }
})

router.get('/get-imp-tasks',authMiddleware,async(req,res)=>{
    try{
        const {id} = req.headers
        const Data = await User.findById(id).populate({
            path:"tasks",
            match:{isImportant: true},
            options:{sort: {createdAt: -1}}
    })
    const ImpTaskData = Data.tasks
    res.status(200).json({data: ImpTaskData})
    }catch(error){
        res.status(400).json({message:"Internal Server Error"})
    }
})

router.get('/get-complete-tasks',authMiddleware,async(req,res)=>{
    try{
        const {id} = req.headers
        const Data = await User.findById(id).populate({
            path:"tasks",
            match:{isCompleted: true},
            options: { sort: {createdAt: -1} }
    })
    const CompTaskData = Data.tasks
    res.status(200).json({data: CompTaskData})
    }catch(error){
        res.status(400).json({message:"Internal Server Error"})
    }
})

router.get('/get-incomplete-tasks',authMiddleware,async(req,res)=>{
    try{
        const {id} = req.headers
        const Data = await User.findById(id).populate({
            path:"tasks",
            match:{isCompleted: false},
            options: { sort: {createdAt: -1} }
    })
    const CompTaskData = Data.tasks
    res.status(200).json({data: CompTaskData})
    }catch(error){
        res.status(400).json({message:"Internal Server Error"})
    }
})


router.get('/get-overdue-tasks', authMiddleware, async (req, res) => {
    try {
        const {id}= req.headers
        const currentDate = new Date()

        const Data = await User.findById(id).populate({
            path: "tasks",
            match: { due: { $lt: currentDate } },
            options: { sort: { due: 1 } }
        })
        
        res.status(200).json({ data: Data.tasks })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
})


module.exports = router;