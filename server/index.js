import express from "express";
import connectDB from "./config/db.js";
import userRoute from "./routes/user.js";
import cors from "cors";
import { authenticateToken } from "./middleware/auth.js";
import path from "path";
import { fileURLToPath } from 'url';

// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json()); // Parses JSON requests
app.use(cors());

// Default route
app.use("/api/users", userRoute);

app.get('/user', authenticateToken, async(req, res) => {
    // console.log('body',req.user);
    // console.log('body' , req.user);
    try{
        const userData=await collection.findOne({_id:req.user.user._id});
        // console.log('data',userData);
        if(userData){
            return res.status(200).json({success:true,user:userData})
        }else{
            console.log('userdata failed');
        }
    }catch(e){
        console.log('/user not working',e.message);
        return res.status(400).json({success:false})
    }
})

app.use(express.static(path.resolve(__dirname, "client", "build")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

connectDB(process.env.USERNAME, process.env.PASSWORD); // Connection to DB

const PORT = process.env.PORT || 1000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));