const { Router } = require("express");
const router = Router();
const adminMiddleware = require("../middleware/admin");
const { Admin } = require("../db/index")

const jwt = require("jsonwebtoken");
const { secret } = require("../index")
//  console.log("secret: ", secret);

router.post('/signup', async (req, res) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        if (!username || !email || !password) {
            return res.status(400).json({ msg: 'Please provide all required fields' });
        }

        // Create the admin user
        await Admin.create({ username, email, password });
        
        console.log("Admin created successfully");
        return res.status(201).json({ msg: "Admin created successfully" });
        
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).json({ msg: "Server error: Could not create admin" });
    }
});



router.post('/signin' ,async (req, res) => {
    // Implement admin signup logic

    const email = req.body.email;
    const password = req.body.password;

    if( password==null || email==null){
        res.json({
            msg:" fill all the space correctly "
        })
    }
    
    const admin = await Admin.find({
        
        email:email,
        password:password
    })
    console.log(admin)
    console.log("Secret key:", secret);
    console.log(admin);
    if(admin.length>0){
        try {
            const token = jwt.sign({ email }, secret);
            // Add secret
            console.log(token)
            return res.json({
               token
            });
        } catch (error) {
            console.error("JWT Signing Error:", error);
            return res.status(500).json({
                msg: "Error in signing token"
            });
        }
    }
    else{
        res.status(411).json({
            msg:"incorrect email or passwrod"
        })
    }

    

});

module.exports = router;