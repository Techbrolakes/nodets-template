import express from "express"
import dotenv from "dotenv"
import 'module-alias/register';
import connectDB from "@config/conn";
import morgan from "morgan";
import cors from "cors";

const port = process.env.PORT || 5000
const app = express();

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
dotenv.config();



app.all("*", (req, res) => {
    return res.status(404).json({message: "Route not found"})  
})
 
/** start server only when we have valid connection */
connectDB().then(() => {
    try {
        app.listen(port, () => console.log(`Server listening & database connected on ${port}`));
    } catch (e) { 
        console.log('Cannot connect to the server')
    }
}).catch((e) => {
    console.log("Invalid database connection...! ", + e);
})