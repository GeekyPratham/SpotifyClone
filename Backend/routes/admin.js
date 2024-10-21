const { Router } = require("express");
const router = Router();
const adminMiddleware = require("../middleware/admin");
const { Admin,SongsList } = require("../db/index")

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

router.post('/courses', adminMiddleware,async (req, res) => {
    // Implement course creation logic
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const imageLink = req.body.imageLink;
    //zod for input validation

    const newCourse =await Course.create({ 

        // if key and value are same then we can do this
        title,
        description,
        price,
        imageLink
    })
    // each time in the mongodb the table is filled in db the unique id is provided so it helps in tracking

    console.log("post")
    console.log(newCourse)
    res.json({
         message: 'Course created successfully', courseId:newCourse._id
    })
    
});

router.get('/courses', adminMiddleware,async (req, res) => {
    // Implement fetching all courses logic
    const response =await Course.find({}); // getting all course from database 
    console .log("get")
    console.log(response)
    res.json({
        course:response
    })
});

module.exports = router;