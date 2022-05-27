const jwt = require("jsonwebtoken");
const JSW_SECRAT = "SunnyKumarSharma@123";

const fetchuser = (req, res, next) =>{
    //  Get the user from the jwt token and add to req object
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error: "Please authenticate using a valid token"});
    }
    try {
        const data = jwt.verify(token, JSW_SECRAT);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({error: "Please authenticate using a valid token"});

    }
   

}


module.exports = fetchuser;