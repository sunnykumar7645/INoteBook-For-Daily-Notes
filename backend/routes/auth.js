const express = require("express");
const { body, validationResult, check } = require("express-validator");
const User = require("../Models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

//  jsw is basically use for keep authentication secure password.
// jsw secrat code or digital signature.
const JSW_SECRAT = "SunnyKumarSharma@123";
// const user = require('../Models/User');
//ROUTES 1: create a user using: /api/auth/createuser no login required
router.post(
  "/createuser",
  [
    body("name", "Enter the valid Name").isLength({ min: 5 }),
    body("email", "Enter the valid Email").isEmail(),
    body("password", "password should be atleast 5 charector").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //  if threr are errors return bad error and messaeg.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //  check wheather user/email exits already or not
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "sorry a user already exist with this email" });
      }
      // create a password hash to keep secure the password;
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      // create new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JSW_SECRAT);
      // console.log(jwtData);
      res.json({ authToken: authToken });

      // res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }

    // for handling run time errer like unique email
    // if there are errors , bad erroe with massage.
    // .then(user => res.json(user))
    // .catch(err=>{
    //   console.log(err);
    //   res.json({error: "please enter an unique email address", message: err.message});
    // });
    // console.log(req.body);
    // const user = User(req.body);
    // user.save();
    // res.send(req.body);
  }
);

//ROUTES 2: authenticate user using post : /api/auth/login/;

router.post(
  "/login",
  [
    body("email", "Enter the valid Email").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    //  if threr are errors return bad error and messaeg.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      // user validation check wheather user exits or not
      // findOne method is to unique identify
      let user = await User.findOne({ email });
      if (!user) {
        success = false
        return res
          .status(400)
          .json({ success, error: "please login with correct Credentials" });
      }
      // password validation wheather password is correct aor not
      const passwordCompare = await bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({success, error: "please login with correct Credentials" });
      }
      // it is different the above data and details.
      const data1 = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data1, JSW_SECRAT);
      // console.log(jwtData);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//  ROUTES 3: Get user loggedin user  details using: post method localhost:5000/api/auth/getuser  , user Login Required

router.post('/getuser', fetchuser, async (req, res)=>{

  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
      res.status(500).send("Internal server error");
  }

})

module.exports = router;
