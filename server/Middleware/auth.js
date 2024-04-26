const dbSeq = require("../Config/index");
dbSeq.sequelize.sync();

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const users = require("../Models/users");
dotenv.config({ path: "./.env" });


//Authentication Middleware using JWT
exports.authenticate = (req, res, next) => {
    const token = req.header("Authorization");
    console.log("Unextracted Token: " + token);
  
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const extractedToken = token.split(" ")[1];
    console.log("Actual Token: " + extractedToken);
  
    try {
      //verify and validate our token
      const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid Token" });
    }
  };

  exports.adminCheck = async(req,res,next)=>{
    try {
      console.log("citizenID: ",req.userId)
      const userAdmin = await dbSeq.users.findOne({attributes:{exclude:['password']},where:{citizenID:req.userId}})
      
      console.log("userAdmin: ",userAdmin.dataValues)
      if(userAdmin.dataValues.role !== 'admin'){
        res.status(403).send('Admin access denied!!')
      }else{
        next();
      }
    } catch (err) {
      console.log(err)
      res.status(403).send('Admin access denied!!')
    }
  }

  exports.inspectorCheck = async(req,res,next)=>{
    try {
      console.log("citizenID: ",req.userId)
      const userInspector = await dbSeq.users.findOne({attributes:{exclude:['password']},where:{citizenID:req.userId}})
      
      console.log("userInspector: ",userInspector.dataValues)
      if(userInspector.dataValues.role !== 'inspector'){
        res.status(403).send('Inspector access denied!!')
      }else{
        next();
      }
    } catch (err) {
      console.log(err)
      res.status(403).send('Inspector access denied!!')
    }
  }

  exports.superiorCheck = async(req,res,next)=>{
    try {
      console.log("citizenID: ",req.userId)
      const userSuperior = await dbSeq.users.findOne({attributes:{exclude:['password']},where:{citizenID:req.userId}})
      
      console.log("userSuperior: ",userSuperior.dataValues)
      if(userSuperior.dataValues.role !== 'superior'){
        res.status(403).send('Superior access denied!!')
      }else{
        next();
      }
    } catch (err) {
      console.log(err)
      res.status(403).send('Superior access denied!!')
    }
  }

