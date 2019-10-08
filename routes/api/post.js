const express = require("express")
const router = express.Router();
const auth = require("../../middleware/auth")
const { check, validationResult } = require("express-validator")


const User = require("../../model/user")
const Profile = require("../../model/profile")
const Post = require("../../model/post")

//@route Get api/posts
// @desc test route 
// @access Private 
router.post('/', [auth,
    [check('text', "text is required").not().isEmpty]
],

    async (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(500).json({ error: errors.array() })

        try {

            const user = await User.findById(req.user.id).select('-password')

            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            })
            const post = await newPost.save();

        } catch (error) {
            return res.status(500).send("Server error ")
        }

    })

module.exports = router;