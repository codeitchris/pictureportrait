import express, {Express, Request, Response} from "express";
import * as dotenv from 'dotenv';
import request from 'request'; // "Request" library
import cors from 'cors';
import querystring from 'querystring';
import cookieParser from 'cookie-parser';
import {runit} from "./getTopTracks";
import path from "path"

const port = 8000;
const app = express();


dotenv.config();

// following from the official spotify example here: https://github.com/spotify/web-api-examples/blob/master/authentication/authorization_code/app.js 
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = "http://localhost:8000/images";
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
//path.join(__dirname,"public")
app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/about",(req,res)=>{
    res.render("about");
});

app.get("/login",(req,res)=>{

  const state = generateRandomString(16);
  res.cookie(stateKey, state);
  if(client_id==null) {
    console.log("WHERE IS THE CLIENTE ID!??!?!?!");
  }
  //your application requests authorization
  var scope = 'user-top-read';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
    
});

app.get('/images', function(req, res) {
  
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
      console.log("error1")
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        const access_token = body.access_token,
            refresh_token = body.refresh_token;
          res.render("images")
        
      } else {
        
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
          console.log("error2")
      }
    });
    
  }

  
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

app.get("/chris",(req,res)=>{
    res.render("chris");
});




app.listen(port, () => {
    console.log(`now listening on port ${port}`);
})
