const mongoose = require("mongoose");
const express = require("express");
const UserSchema = require("../Model/Userschema");
const ProviderSchema = require("../Model/ProviderSchema");
const Job = require("../Model/jobSchema");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const verifyToken = require("../authMiddleware");
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// USER REGISTRATION
router.post(
  "/userregister",
  upload.single("profileImage"), // Middleware to handle single file upload with field name 'profileImage'
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("username", "Enter a valid username").isLength({ min: 5 }),
    body("password", "Enter a valid password").isLength({ min: 8 }),
    body("number", "Enter a 10-digit number").isLength({ min: 10, max: 10 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let profileImageUrl = ""; // Initialize profile image URL

    if (req.file) {
      // If file was uploaded, set the profile image URL to the path where it's stored
      profileImageUrl = req.file.path;
    }

    let user = await UserSchema.findOne({
      email: req.body.email,
      number: req.body.number,
    });
    if (user) {
      return res
        .status(400)
        .json({ error: "User with this detail already exists" });
    }
    try {
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await UserSchema.create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: secPass,
        number: req.body.number,
        profileImage: profileImageUrl,
      });
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.KEY,
        { expiresIn: "24h" }
      );
      return res.status(200).json({ token: token });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Other routes...

router.post(
  "/userlogin",
  [
    body("username", "Enter a valid username").isLength({ min: 5 }),
    body("password", "Enter a valid password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { username, password } = req.body;
      const getuser = await UserSchema.findOne({ username });
      if (!getuser) {
        return res.status(401).json({ error: "Wrong details" });
      }
      const secpass = await bcrypt.compare(password, getuser.password);
      if (!secpass) {
        return res.status(400).json({ error: "Incorrect password" });
      }
      const data = {
        user: {
          id: getuser._id,
        },
      };
      const authToken = jwt.sign(data, process.env.KEY);
      return res.status(200).json({ token: authToken });
    } catch (error) {
     
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);



//Provider-data

router.post("/providerregister", async (req, res) => {
  try {
    let user = await ProviderSchema.findOne({
      email: req.body.email,
      number: req.body.number,
    });
    if (user) {
      return res
        .status(400)
        .json({ error: "User with this detail already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await ProviderSchema.create({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      number: req.body.number,
      companyname: req.body.companyname,
    });

    const token = jwt.sign(
      { id: newUser._id },
      process.env.KEY,
      { expiresIn: "24h" } 
    );

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/providerlogin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const getuser = await ProviderSchema.findOne({ username });
    if (!getuser) {
      return res.status(401).json({ error: "Wrong details" });
    }
    const secpass = await bcrypt.compare(password, getuser.password);
    if (!secpass) {
      return res.status(400).json({ error: "Incorrect password" });
    }
    const data = {
      user: {
        id: getuser._id,
      },
    };
    const authToken = jwt.sign(data, process.env.KEY);
    return res.status(200).json({ token: authToken });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

//JOB
//Enter job Details

router.post("/addjob", verifyToken, async (req, res) => {
  const userid = req.user.id;
  const provideruser = await ProviderSchema.findById(userid);
  if (provideruser) {
    try {
      const {
        jobtype,
        joblocation,
        jobmode,
        jobtitle,
        techskill,
        jobdescription,
        jobduration,
        jobcompany,
        joblink,
      } = req.body;

      if (
        !jobtype ||
        !joblocation ||
        !jobmode ||
        !jobtitle ||
        !techskill ||
        !jobdescription ||
        !jobduration ||
        !joblink ||
        !jobcompany
      ) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const jobdetail = await Job.create({
        jobtype,
        joblocation,
        jobmode,
        jobtitle,
        techskill,
        jobdescription,
        jobduration,
        jobcompany,
        joblink,
      });
      res.status(200).json({ jobdetail });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

router.post("/getalljob", verifyToken, async (req, res) => {
  try {
    const userid = req.user.id;
    const getuser = await UserSchema.findById(userid);
    if (getuser) {
      const { jobtitle } = req.body;
      if (jobtitle === "") {
        const getall = await Job.find();
        if (getall) {
          res.status(201).json({ "ALL-JOb DATA": getall });
        } else {
          res.status(401).json("NO JOB AVAILABLE");
        }
      } else {
        const getallwithgivendetails = await Job.find({
          jobtitle: { $regex: jobtitle, $options: "i" },
        });
        if (getallwithgivendetails) {
          res.status(201).json({ "ALL-JOb DATA": getallwithgivendetails });
        } else {
          res.status(401).json("NO JOB AVAILABLE");
        }
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.patch("/updatejob/:id", async (req, res) => {
//   const { id } = req.params;
//   const {
//     jobtype,
//     joblocation,
//     jobmode,
//     jobtitle,
//     techskill,
//     jobdescription,
//     jobduration,
//     joblink,
//   } = req.body;
//   try {
//     const updatejob = await Job.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     res.status(200).json(updatejob);
//   } catch {
//     res.status(401).json("Failed To Update");
//   }
// });

// router.delete("/deletejob/:id", verifyToken, async (req, res) => {
//   const { id } = req.params;
//   try {
//     const deljob = await Job.findByIdAndDelete(id);
//     res.status(200).json(deljob);
//   } catch {
//     res.status(400).json("NOT DELETE");
//   }
// });

router.get("/userprofile", verifyToken, async (req, res) => {
  try {
    const userid = req.user.id;
    const getuser = await UserSchema.findById(userid);
    if (getuser) {
      res.status(200).json({ user: getuser }); //
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/providerprofile" , verifyToken , async (req , res) =>{
  try{
    const providerid = req.user.id;
    const getuser = await ProviderSchema.findById(providerid);
    if(getuser){
      res.status(200).json({provider : getuser});
    }else{
      res.status(404).json({error : "User not found"});
    }
  }catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
})

module.exports = router;
