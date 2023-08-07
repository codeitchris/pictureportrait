import express, {Express, Request, Response} from "express";
const port = 8000;

const app = express();

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



app.listen(port, () => {
    console.log(`now listening on port ${port}`);
})
