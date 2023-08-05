import express, {Express, Request, Response} from "express";
const port = 8000;

const app = express();

app.get("/",(req,res)=>{
    res.send("What's up playboy! lol you edited JS file!");
});
app.get("/hi",(req,res)=>{
    res.send("Really, a sopranos AND godfather reference?");
});

app.listen(port, () => {
    console.log(`now listening on port ${port}`);
})
