const jwt = require('jsonwebtoken')

module.exports = (req,res,next)=> {
    if (req.headers.token) {
        try {
            let decoded = jwt.verify(req.headers.token, process.env.JWTSECRET)
            
            next()
        }
        catch(error) {
            res.status(400).json({
                msg: `invalid token`
            })
        }
    } else {
        res.status(400).json({
            msg: `please login and get token`
        })
    }
}