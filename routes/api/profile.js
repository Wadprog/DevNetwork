const express= require("express")
const router= express.Router(); 
const auth=require("../../middleware/auth")
const Profile = require("../../model/profile")
const User= require("../../model/user")
//@route Get api/profiles/me
// @desc Get  current users profile 
// @access Private 
router.get('/me',auth, async (req, res)=>{
    try {
       const profile= await Profile.findOne({user:req.user.id})
       .populate('user',['name','avatar'])
       if(!profile)
       return res.status(400).send("There is no profile for this user")
       return res.json({profile})
    } catch (error) {
        console.log("Here is the error "+ error)
        return res.status(500).send("Server error");
        
    }

})

module.exports=router;