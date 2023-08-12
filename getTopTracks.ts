import {MongoClient} from "mongodb";
import * as dotenv from 'dotenv';

dotenv.config();
const usr = process.env.MONGO_USR;
const pas = process.env.MONGO_PAS;



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



async function getToken(client: MongoClient, artist: string): Promise<string> {
  // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#findOne for the findOne() docs
  const result = await client.db("").collection("").findOne({ name: artist });

  if (result) {
      return result["token"];
  } else {
      return "";
  }
}

export async function runit(token: string){
  const topTracks: Object = await getTopTracks(token);
  const uri = ``; 
  
  const client = new MongoClient(uri);

  try{
    await client.connect();
  } catch(e){
    console.error(e);
  } finally{
    await client.close();
  }
  
  var arr: Array<string> = [];
  var notTrained: boolean = false;

  for( let i =0; i<5; i++) {
    var artist: string = Object.values(topTracks)[i]["artist"];
    var tok: string = await getToken(client,artist);
    if(tok == "") {
      notTrained = true;
      arr.push(artist);
    } else {
      arr.push(tok);
    }
  }

  //now we just need to hit endpoint and push an image to a folder and then show 
  //that on the  images tab.


}