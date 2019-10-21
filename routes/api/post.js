const express = require("express")

const auth = require("../../middleware/auth")
const { check, validationResult } = require("express-validator")

const User = require("../../model/user")
const Profile = require("../../model/profile")
const Post = require("../../model/post")

const router = express.Router();


//@route Get api/posts
// @desc Get all post in db 
// @access private 

router.get("/", auth, async (req, res) => {
    try {
        const post = await Post.find().sort({ date: -1 });
        return res.json(post);
    } catch (error) {
        console.log(`We encountered a server error creating a new post . Please see error\n ${error}`)
        return res.status(500).send(`Server error ${error}`)
    }
})

//@route Get api/posts/id
// @desc Get a post in db by id
// @access private 

router.get("/:id", auth, async (req, res) => {


    try {
        const post = await Post.findById(req.params.id)
        if (!post)
            return res.status(404).json({ msg: "Post not found" })
        res.json(post)
    } catch (error) {
        console.log(`We encountered a server error creating a new post . Please see error\n ${error}`)
        return res.status(500).send(`Server error ${error}`)
    }
})

//@route Delete api/posts/id
// @desc Delete a post in db by id
// @access private 

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        //Let see if the post exist 
        if (!post)
            return res.status(404).json({ msg: "Post not found" })

        //check if the user deleting the post is the one who made it

        if (post.user.toString() !== req.user.id)
            return res.status(401).json({ msg: "You are not authorise to delete that post" })

        post.remove();
        return res.json({ msg: 'Post removed' })

    } catch (error) {
        console.log(`We encountered a server error creating a new post . Please see error\n ${error}`)
        return res.status(500).send(`Server error ${error}`)
    }
})



//@route Post api/posts
//@desc Crete a new post route 
//@access private

router.post("/",
    [auth,
        [check('text', 'text is required').not().isEmpty()]],
    async (req, res) => {
        const error = validationResult(req)
        if (!error.isEmpty())
            return res.status(400).json({ error: error.array() })

        //If there is no errors we find the user
        const user = await User.findById(req.user.id).select('-password')
        //then we create the post , save it and return it 

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            user: user._id,
            avatar: user.avatar
        })
        try {
            const post = await newPost.save();
            res.json(post);
        } catch (error) {
            console.log(`We encountered a server error creating a new post . Please see error\n ${error}`)
            return res.status(500).send(`Server error ${error}`)
        }


    })





//@route Put api/posts/like/:id
// @desc Like a post  
// @access Private 

router.put('/like/:id', auth, async (req, res) => {
    try {

        let post = await Post.findById(req.params.id)
        if (!post)
            return res.status(404).json({ msg: 'Post not found ' })

        if (post.likes.filter(likes => likes.user.toString() == req.user.id).length > 0)
            return res.status(400).json({ msg: "Post already liked by this user" })

        post.likes.unshift({ user: req.user.id })
        await post.save()
        return res.json(post.likes)
    } catch (error) {
        console.log(`We encountered a server error creating a new post . Please see error\n ${error}`)
        return res.status(500).send(`Server error ${error}`)

    }
})

//@route Put api/posts/unlike/:id
// @desc Unlike a post  
// @access Private 

router.put("/unlike/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post)
            return res.status(404).json({ msg: 'Post not found' })

        //Check if the post was liked by this user 
        if (post.likes.filter(likes => likes.user.toString() == req.user.id).length == 0)
            return res.status(404).json({ msg: 'Post was not like by user before' })

        const removeIdex = post.likes.map(likes => likes.user.toString()).indexOf(req.user.id)
        post.likes.splice(removeIdex, 1)
        await post.save();
        res.json(post.likes)
    } catch (error) {
        console.log(`We encountered a server error creating a new post . Please see error\n ${error}`)
        return res.status(500).send(`Server error ${error}`)
    }
})

//@route Post api/posts/comment/
// @desc Add a new comment to  a post  
// @access Private 

router.post('/comment/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user)
            return res.status(400).json({ msg: 'User not found' })
        const post = await Post.findById(req.params.id)
        if (!post)
            return res.status(404).json({ msg: 'Post not found' })

        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        }

        post.comment.unshift(newComment);
        await post.save();

        res.json(post);

    } catch (error) {
        console.log(`We encountered a server error creating a new post . Please see error\n ${error}`)
        return res.status(500).send(`Server error ${error}`)
    }
})

//@route Post api/posts/comment/
// @desc Add a new comment to  a post  
// @access Private 

//missing route 

/*router.post('/', [auth,
    [check('text', "text is required").not().isEmpty]
],

    async (req, res) => {
        console.log("\n\n\n We made it to the route\n\n\n\n")

        // const errors = validationResult(req)
        //  if (!errors.isEmpty())
        //  return res.status(500).json({ error: errors.array() })

        try {

            const user = await User.findById(req.user.id).select('-password')

            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            })
            const post = await newPost.save();
            res.json(post)
        } catch (error) {
            return res.status(500).send("Server error ")
        }

    })*/

module.exports = router;