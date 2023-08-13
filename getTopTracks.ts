import {Collection, MongoClient} from "mongodb";
import * as dotenv from 'dotenv';

dotenv.config();
const usr = process.env.MONGO_USR;
const pas = process.env.MONGO_PAS;

interface keyable {
  [key: string]: any  
}

async function fetchWebApi(endpoint: string, method:string, token: string) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method
    });
    return await res.json();
  }
  
async function getTopTracks(token:string){
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return (await fetchWebApi(
    'v1/me/top/tracks?time_range=short_term&limit=5', 'GET', token)).items;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min:number, max:number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}


async function getPrompt(client: MongoClient, topTracks: Object, col: Collection): Promise<string> {
  var arr: Array<string> = [];
  var notTrained: boolean = false;

  const cursor = await col.find().limit(1);
  let style: string;
  let art: string;
  let action: string;
  let tokens: string;

  for await (const doc of cursor) {
    let styles: Array<string> = doc.styles;
    let arts: Array<string> = doc.arts;
    let actions: Array<string> = doc.actions;

    let numStyles = getRandomInt(0,styles.length);
    let numArts = getRandomInt(0,arts.length);
    let numActions = getRandomInt(0,actions.length);

    style = styles[numStyles];
    art = arts[numArts];
    action = actions[numActions];

    let tokens: keyable = doc.tokens;
    for(let i =0;i<5;i++) {
      var artist: string = Object.values(topTracks)[i]["artist"];
      let tok = tokens?.artist;
      if(tok == null) {
        notTrained = true;
        arr.push(artist);
      } else {
        arr.push(tok);
      }
    }

    let allPeople: string = "";
  
    for(let i =0; i<5;i++) {
      if(i == 4) {
        allPeople += ("and " + arr[i])
      } else {
        allPeople += arr[i];
      }
    }

    return ("A " + style + " " + art + " " + allPeople + " " + action);
    // hit endpoint with prompt
  }
  return "";
}

export async function runit(token: string){
  const topTracks: Object = await getTopTracks(token);
  const uri = ``; 
  
  const client = new MongoClient(uri);
  const col = client.db("portraitBackend").collection("allData");

  try{
    await client.connect();
  } catch(e){
    console.error(e);
  } finally{
    await client.close();
  }
  
  let prompt: string = await getPrompt(client,topTracks,col);
  if(prompt == "") {
    throw console.error();
  } else {
    // hit endpoint;
  }
}