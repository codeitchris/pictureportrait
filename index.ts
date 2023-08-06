import express, {Express, Request, Response} from "express";
const port = 8000;

const app = express();

app.set('view engine','ejs');

app.get("/",(req,res)=>{
    res.send("test1");
});
app.get("/hi",(req,res)=>{
    res.send("test2");
});

app.listen(port, () => {
    console.log(`now listening on port ${port}`);
})
