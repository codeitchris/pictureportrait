import express, {Express, Request, Response} from "express";
import * as dotenv from 'dotenv';
const port = 8000;

const app = express();

dotenv.config();


app.set('view engine','ejs');
app.use(express.static("public"))

app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/about",(req,res)=>{
    res.render("about");
});

app.get("/loading",(req,res)=>{
    res.render("loading");
});

app.get("/images",(req,res)=>{
    res.render("finalpage");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/configure",(req,res)=>{
    res.render("options");
});
app.get("/chris",(req,res)=>{
    res.render("chris");
});




app.listen(port, () => {
    console.log(`now listening on port ${port}`);
})
