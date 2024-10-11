const express = require("express")
const app = express()
const bodyParser = require("body-parser");
const zod = require("zod")


const jwt = require("jsonwebtoken");
const jwtPassword = "123456";

const cors = require("cors"); // Import the cors package
app.use(cors()); // Enable CORS for all routes


const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://GeekyPratham:RG1hdLUwX1dBrTb7@cluster0.wfhhz.mongodb.net/SignUp");



app.use(bodyParser.json());
app.use(express.json());


// Mongoose Schema
const User = mongoose.model(
    'User', {
        name: String,
        email: String,
        age: String,
        password: String
    }
);

// function to validate input zod

function validateInput(obj){
    const schema = zod.object({
        name:zod.string(),
        email:zod.string().email,
        age:zod.string.max(3),
        password:zod.string().min(8)
    })
    const response = schema.safeParse(obj);
    console.log(response);
}


// getting the elements from the body in form of object

app.post('/signup', (req, res) => {
    const { name, email, age, password } = req.body;

    try{
        validateInput(req.body);
        // Here, you would typically save the user data to a database
        console.log('Signup request received:', req.body);

        // Send a response back to the frontend
        res.json({ message: 'Signup successful!', user: { name, email } });
    }
    catch(err){
        msg:"invalid input";
        res.json({
            msg:"invalid Input"
        })
    }

    
});



app.listen(4000)