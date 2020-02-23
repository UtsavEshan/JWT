const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation} = require('../validation');
const {loginValidation} = require('../validation');

router.get('/register', (req,res)=>{
    res.render('register');
});

//=======================================================================================
router.post('/register', async (req,res)=>{
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message)

        //Checking if the user is already there
        const emailExist = await User.findOne({email: req.body.email});
        if(emailExist) return res.status(400).send('Email already exists');

//? HASH THE PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

//?create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.send({user: user._id})
    }catch(err){
        res.status(400).send(err);
    }
});

//================================================================
router.get('/login', (req,res)=>{
    res.render('login');
})

router.post('/login', async (req,res)=>{
     const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(400).send('Email or Password is wrong');
        //PASSWORD IS CORRECT
            const validPass = await bcrypt.compare(req.body.password, user.password);
            if(!validPass) return res.status(400).send('Invalid password')
            // Create JWT and assgin
            const token = jwt.sign({_id: user._id}, 'work')
            console.log(token)
            res.cookie('auth-token', token,{maxAge:30000, httpOnly: true}).render('logged');
})

module.exports = router;