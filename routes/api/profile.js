const express= require("express")
const router= express.Router(); 

//@route Get api/profiles
// @desc test route 
// @access Public 
router.get('/', (req, res)=>res.send('Profiles routes'))

module.exports=router;