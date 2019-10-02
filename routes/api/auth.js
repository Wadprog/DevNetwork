const express= require("express")
const router= express.Router(); 
const auth= require("../../middleware/auth")
const jwt = require("jsonwebtoken")
const { check, validationResult } = require("express-validator")

const User= require("../../model/user")
//@route Get api/auth
// @desc test route 
// @access Public 
router.get('/', auth, async(req, res)=>{
    try {
        const user= await  User.findById(req.user.id)
        .select("-password")
        res.status(200).json(user)
    } catch (error) {
        console(error)
        res.status(500).send("server error")
    }

})






router.post('/', [
    check("email", "please enter a valid email").isEmail(),
    check("password", "is required").exists()
], 
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })

    const { email, password } = req.body;

    //check if user exist 
    try {
        let user = await User.findOne({ email })
        if (!user)
            return res.status(404).json({ errors: [{ msg: 'invalid cred' }] })

 
    
        // Implement bcrypt here . 

       if(user.password!=password)
       return res.status(400).json({msg:"invalid red"})
       
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

module.exports=router;