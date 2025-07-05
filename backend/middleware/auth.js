const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET||'your secret key';

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({error : 'access token required'});
    }
    jwt.verify(token, JWT_SECRET, (err, user)=>{
        if(err){
            return res.status(403).json({error: 'invalid token'});
        }
        req.user = user;
        next();

    });
}

module.exports = authenticateToken;