const dotenv = require('dotenv')
dotenv.config()
console.log(`${process.env.MONGODB_URL}`)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const secret = process.env.secret; 
// module.exports = { secret };

const app = express();
const PORT = 8080;

// Use CORS middleware at the top, so it applies to all routes
app.use(cors())
// const cors = require("cors");

app.use(cors());



// Middleware for parsing request bodies
app.use(bodyParser.json());

// Import your routes
const adminRouter = require('./routes/admin');


// Use routes
app.use('/admin', adminRouter);


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
