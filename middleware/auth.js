const jwt = require('jsonwebtoken');
module.exports= function(req, res, next){
    const token= req.header('x-auth-token')

    if(!token)
    return res.status(401).json({msg:"No tken"})
    try {
        const decoded=jwt.verify(token,"My big secret" )
        req.user=decoded.user
        next()
    } catch (error) {
        res.status().json({msg:"Token not valid"})
    }

}