import express, {Express, Request, Response} from "express";
import * as dotenv from 'dotenv';
import request from 'request'; // "Request" library
import cors from 'cors';
import querystring from 'querystring';
import cookieParser from 'cookie-parser';


const port = 8000;
const app = express();


dotenv.config();

// following from the official spotify example here: https://github.com/spotify/web-api-examples/blob/master/authentication/authorization_code/app.js 
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = "/options";
const stateKey = "idk-rn";

function generateRandomString(length: number) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

app.set('view engine','ejs');
app.use(express.static("public")).use(cors()).use(cookieParser())

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

  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  //your application requests authorization
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
    
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
