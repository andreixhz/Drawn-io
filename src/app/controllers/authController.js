const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const authConfig = require('../../config/auth');

const User = require('../models/User');

const router = express.Router();

const generateToken = (params = {}) => jwt.sign(params, authConfig.secret, {expiresIn: 986400,});

router.post('/register', async (req, res) => {

    const {username} = req.body;

    try{

        if(await User.findOne({username}))
            return res.status(200).send({log: 'Username_already_exists'})


        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({log: 'logged', user , token: generateToken({id: user.id})});
    } catch (err){
        return res.status(200).send({log: 'Registration_failed', err});
    }

});

router.post('/newToken', async (req,res) => {

    const {_id} = req.body;
    const user = await User.findOne({_id}).select('+password');
    if(!user)
        return res.status(400).send({log: 'User not found'});

    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({log: 'Invalid password'});

    user.password = undefined;
    
    res.send({log: 'logged', user, token: generateToken({id: user.id})});


});

router.post('/authenticate', async (req,res)=>{

    const {email, password} = req.body;
    const user = await User.findOne({email}).select('+password')

    if(!user)
        return res.status(200).send({log: 'User_not_found'});

    if(!await bcrypt.compare(password, user.password))
        return res.status(200).send({log: 'Invalid_password'});
    
    user.password = undefined;

    res.send({log: 'logged', user, token: generateToken({id: user.id})});

});

module.exports = app => app.use('/auth', router);