const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    return res.sendFile(__dirname + '/auth.html');
});

router.get('/app', async(req,res) => {
    return res.sendFile(__dirname + '/game.html');
});

router.get('/main.css', async(req, res) =>{
    return res.sendFile(__dirname + '/main.css');
});

router.get('/src/background.jpg', async (req, res) =>{
    return res.sendFile(__dirname + '/src/background.jpg');
});

router.get('/src/fonts/ScriptMTBold.ttf', async(req, res) => {
    return res.sendFile(__dirname + '/src/fonts/ScriptMTBold.ttf');
})


module.exports = app => app.use('/', router);