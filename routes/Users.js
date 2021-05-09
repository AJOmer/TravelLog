const router = require('express').Router()
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

// Registration
router.post('/register', [
    check('userName', 'Please enter your username').not().isEmpty(),
    check('email', 'Enter your email').isEmail(),
    check('password', 'Enter a password with 6 or more characters').isLength({ minLength: 6}),
    async(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array()})
        }

        // deconstruct req body to assign to new user
        const { userName, email, password} = req.body;
        try {
            //create new user
            let user = await User.findOne({ email });

            if(user){
                return res.status(400).json({ errors: [{ msg: 'User already exists'}]});
            }

            user = new User({
                userName,
                email,
                password
            });

            //generate new password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            
            // save user and send response
            await user.save();
            res.status(200).json(user._id);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Sever Error')
        }
    }
])

// Login
router.post('/login', [
    check('userName', 'Include a username').isLength({ minLength: 3}),
    check('password', "Password required").exists(), 
],
async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }

    // deconstruct object
    const { password, userName } = req.body;
    try {
        // See if user exists
        let user = await User.findOne({ userName });

        if(!user){
            return res.status(400).json({ errors: [{ msg: 'Invalid Login information'}]})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ errors: [{ msg: 'Invalid Login'}]})
        }
        res.status(200).json({ _id: user._id, userName: user.userName});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
})

module.exports = router;