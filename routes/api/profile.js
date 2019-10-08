const express = require("express")
const router = express.Router();
const auth = require("../../middleware/auth")
const Profile = require("../../model/profile")
const User = require("../../model/user")
const { check, validationResult } = require("express-validator")


/*--------------------------------------------------------------------------------------------------- 
                                                 Routes                                             
--------------------------------------------------------------------------------------------------- */

//@route Get api/profiles/
//@desc Get  all  profiles
// @access Public 
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        return res.json(profiles)
    } catch (error) {
        console.log(` There is an error from server the error is ${error.message}`)
        return res.status().send("Server error")
    }

})

//@route Delete api/profiles/
// @desc Delete a profile and user 
// @access Private

router.delete("/me", auth, async (req, res)=>{
try {
    await Profile.findOneAndRemove({user:req.user.id})
    await User.findByIdAndRemove({_id:req.user.id})
    return res.json("User and profiles removed successfully")
    
} catch (error) {
    console.log("There is an error removing User/Profile error is below:\n" + error)
    return res.status(500).send("Server error")
}

})



//@route Get api/profiles/me
// @desc Get  current users profile 
// @access Private 
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
            .populate('user', ['name', 'avatar'])
        if (!profile)
            return res.status(400).send("There is no profile for this user")
        return res.json({ profile })
    } catch (error) {
        console.log("Here is the error " + error)
        return res.status(500).send("Server error");

    }

})

//@route Post api/profiles/
//@desc Create or update User Pofile 
//@access Private 

router.post('/', [auth,
    [
        check("status", "Status is required").not().isEmpty(),
        check("skills", "Skills is required").not().isEmpty()
    ]
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            res.status(400).json({ error: errors.array() })
        const {
            company,
            website,
            location,
            status,
            skills,
            bio,
            githubusername,
            youtube,
            twitter,
            facebook,
            linkedin,
            instagram

        } = req.body;

        //Building the profile object. 
        let profileFields = {}
        profileFields.user = req.user.id
        if (company) profileFields.company = company
        if (website) profileFields.wesite = website
        if (bio) profileFields.bio = bio
        if (status) profileFields.status = status
        if (githubusername) profileFields.githubusername = githubusername
        if (skills) profileFields.skills = skills.split(",").map(skill => skill.trim())
        //Build the social network 
        profileFields.social = {}
        if (youtube) profileFields.social.youtube = youtube
        if (youtube) profileFields.social.twitter = twitter
        if (youtube) profileFields.social.facebook = facebook
        if (youtube) profileFields.social.linkedin = linkedin
        if (youtube) profileFields.social.instagram = instagram

        try {
            let profile = await Profile.findOne({ user: req.user.id })
            if (profile) {// then update it 
                profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
                return res.json(profile)
            }
            // Creting new profile if none exist 
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);




        } catch (error) {

        }



    })

//@route Post api/profiles/experiences
//@desc Create or update User Pofile 
//@access Private 

router.post("/experiences", [auth,[
check("title", "Title is required and cannot be empty").not().isEmpty(),
check("company", "Company is required and cannot be empty").not().isEmpty(),
check("from", "From date is required and cannot be empty").not().isEmpty()
]
], async(req, res)=>{
    //console.log("\n\n\n\n\n\n\n\n\n\n We got in the route \n\n\n\n\n\n\n\n\n\n")
   const errors= validationResult(req); 
    
    if(!errors.isEmpty())
    return res.status(400).json({error:errors.array()})

try {

    
    let profile= await Profile.findOne({user:req.user.id})
    if(!profile)
    return res.status(400).send("User does not exist"); 
 
    const {title,company,from,to,current,description}= req.body
    const experiences={title,company,from,to,current,description}
    profile.experience.push(experiences);
    await profile.save();
    return res.json(profile)


} catch (error) {
   return res.status(500).send("server error \n the erro is: \n\n\ "+error) 
}
})


router.delete("/experience/:id",auth, async(req, res)=>{
    try {
        
        let profile= await Profile.findOne({user:req.user.id})
        if(!profile)
        return res.status(400).send("User does not exists");

        const exp=profile.experience.filter(experience=>{
            if(experience._id!=req.param.id)
            return experience
        })

        console.log(exp)
        profile.experience=exp;
        await profile.save();
        return res.json(profile)
    } catch (error) {
        return res.status(500).send("server errors")
    
    }
})


router.post("/education", [auth,[
    check("school","School is required").not().isEmpty,
    check("fieldofstudy","fieldofstudy is required").not().isEmpty,
    check("degree","degree is required").not().isEmpty,
    check("from","from is required").not().isEmpty,
]], async (req, res)=>{
const errors= validationResult(req)
if(errors)
return res.status(400).json({error:errors.array()})

try {
    let profile =await Profile.findOne({user:req.user.id})
    if(!profile)
    return res.status(400).json({error:[{msg:"User does not exist"}]})
    const{school,degree,fieldofstudy,from,to,current,description}=req.body
    const education = {school,degree,fieldofstudy,from,to,current,description}
    profile.education.push(education)
    await profile.save()
    res.json(profile)

} catch (error) {
    console.log("We encountered an error "+ error);
    res.status(500).send("Server error ")
}


router.delete("/education/:id",auth, async(req, res)=>{
    try {
        
        let profile= await Profile.findOne({user:req.user.id})
        if(!profile)
        return res.status(400).send("User does not exists");

        const ed=profile.education.filter(education=>{
            if(education.id!=req.param.id)
            return education
        })
        profile.education=ed;
        await profile.save();
        return res.json(profile)
    } catch (error) {
        return res.status(500).send("server errors")
    }
}) 



})
module.exports = router;