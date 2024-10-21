const mongoose = require("mongoose");
mongoose.connect(`${process.env.MONGODB_URL}`);

console.log(`${process.env.MONGODB_URL}`)


// Define schemas
const AdminSchema = new mongoose.Schema({
    // Schema definition here
    username: String,
    email:String,
    password: String,
    uploadPlaylist:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SongsPlaylist'
    }]
});





const Admin = mongoose.model('Admin', AdminSchema);



module.exports = {
    Admin,
    
}