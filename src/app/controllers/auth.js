const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const authConfig = require('../../config/auth');
const authMiddleware = require('../middlewares/auth');
const User = require('../models/User');

const router = express.Router();
router.use(authMiddleware);

router.post('/auth', async (req, res) => {

    const user = await User.findById(req.userId);
    res.send({auth:true , User: user});

});

module.exports = app => app.use('/att', router);