const express = require("express")
const router = express.Router()
const gravatar = require("gravatar")
const jwt = require("jsonwebtoken")
const { check, validationResult } = require("express-validator")

//@route Post api/users
// @desc test route 
// @access Public 

const User = require("../../model/user")

router.post('/', [
    check("name", "name is required").not().isEmpty(),
    check("email", "please enter a valid email").isEmail(),
    check("password", "Please enter 6 digit password").isLength({ min: 6 })
], 
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })

    const { name, email, password } = req.body;

    //check if user exist 
    try {
        let user = await User.findOne({ email })
        if (user)
            return res.status(400).json({ errors: [{ msg: 'User already exist' }] })

            //The user does not exist let's create hes avatar
        const avatar = await gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })
        //Creating the new user 
        user = new User({
            name,
            email,
            password,
            avatar,
        })
        // Implement bcrypt here . 

        await user.save();
        const payload = {
            user: {
                id: user.id
            }

        }

        
        jwt.sign(
            payload,
            "My big secret", {
            expiresIn: 360000
        },
            (err, token) => {
                if (err)
                   return console.log("something went wrong")
               return  res.json({ token })
            })


    } catch (error) {
        console.log("Server error " + error)
        return res.status(500).send("server error")

    }
 
})


module.exports = router;