const express = require('express');
const { register, login, profile, getProfile, currentUser, getUserById, getSignatureInspector, getSignatureFirstSuperior, getSignatureSecondSuperior, getSignatureDeputy, deleteUsers,  } = require('../Controllers/auth');
const { authenticate, adminCheck, inspectorCheck, superiorCheck } = require('../Middleware/auth');
const { signature } = require('../Middleware/signsignature');
const router = express.Router()

router.post("/register", signature, register);
router.post("/login", login );
router.put("/profile", signature, authenticate, profile);
router.get("/getProfile", authenticate, getProfile);
router.post("/currentUser",authenticate, currentUser);
router.post("/currentAdmin",authenticate,adminCheck, currentUser);
router.post("/currentInspector",authenticate,inspectorCheck, currentUser);
router.post("/currentSuperior",authenticate,superiorCheck, currentUser);
router.get("/getUserById/:citizenID", authenticate, getUserById);
router.get("/getSignatureInspector/:leaveID", authenticate, getSignatureInspector);
router.get("/getSignatureFirstSuperior/:leaveID", authenticate, getSignatureFirstSuperior);
router.get("/getSignatureSecondSuperior/:leaveID", authenticate, getSignatureSecondSuperior);
router.get("/getSignatureDeputy/:leaveID", authenticate, getSignatureDeputy);
router.delete("/deleteUsers/:citizenID",authenticate,deleteUsers)

module.exports = router