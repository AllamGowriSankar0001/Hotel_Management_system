const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/userModel');
const authorizeRoles = require('../middleware/authorizeRoles');
const verifyToken = require('../middleware/verifytoken');

// Get all users
router.get('/allusers', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
});
// Get users by role
router.get('/role/:role',verifyToken, async (req, res) => {
    try {
        const users = await User.find({ role: req.params.role });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user by ID
router.get('/user/:id',verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Create a new user
router.post('/createuser',verifyToken,authorizeRoles("admin"), async (req, res) => {
    const { name, email, phone, password, role } = req.body || {};
    const finduser = await User.findOne({ phone: phone });
    if (finduser) {
        return res.status(400).json({ message: 'User with this phone already exists' });
    }
    if (!name || !phone || !role ||  !password) {
        return res.status(400).json({ message: 'Name, phone, role, and password are required' });
    }

    try {
        const rolePre = role.toUpperCase().substring(0, 3);
        const count = await User.countDocuments({role:role});
        const userId = `${rolePre}${String(count+1).padStart(3,'0')}`
        const hashpassword = await bcrypt.hash(password,10);
        const newUser = await User.create({
            id: userId, 
            name,
            email,
            phone,
            password: hashpassword,
            role: role
        });
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// Update user by ID
router.put('/updateuser/:id',verifyToken, async (req, res) => {
    const { name, email, phone } = req.body;
    try {
        const user = await User.findOne({ id: req.params.id });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;

        await user.save();
        res.status(200).json({ message: 'User updated', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// update user password
router.put('/updatepassword/:id',verifyToken,async(req,res)=>{
    const {newPassword} = req.body || {};
    if(!newPassword){
        return res.status(400).json({message:'New Password is required'});
    }
    try{
        const user = await User.findOne({id:req.params.id});
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        const hashpassword = await bcrypt.hash(newPassword,10);
        user.password = hashpassword;
        await user.save();
        res.status(200).json({message:'Password updated successfully'});
    }catch(err){
        res.status(500).json({message:err.message});
    }

});
// User login
router.post('/login', async(req,res)=>{
    const {id,password} = req.body || {};
    if(!id || !password){
        return res.status(400).json({message:'ID and Password are required'});
    }
    try{
        const user = await User.findOne({id:id});
        if(!user){
            return res.status(400).json({message:'Unregistered User' });
        }   
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:'Invalid ID or Password'});
        }
        const token = jwt.sign({id:user.id,role:user.role},process.env.JWT_SECRET,{expiresIn:'2h'});
        res.status(200).json({message:'Login Successful',user:user,token:token});
    }catch(err){
        res.status(500).json({message:err.message});
    }
});
// Verify token endpoint
router.get('/verify', verifyToken, async (req, res) => {
    try {
        // req.user is set by verifyToken middleware
        res.status(200).json({ message: 'Token valid', user: req.user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Delete user by ID
router.delete('/deleteuser/:id',verifyToken,async(req,res)=>{
    const userId = req.params.id;
    try{
        const deleteuser = await User.findOneAndDelete({id:userId});
        if(!deleteuser){
            return res.status(404).json({message:'User not found'});
        }
        res.status(200).json({message:'User deleted successfully',user:deleteuser});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});
module.exports = router;
