const express= require("express")
const router= express.Router(); 

//@route Get api/posts
// @desc test route 
// @access Public 
router.get('/', (req, res)=>res.send('Post routes'))

module.exports=router;