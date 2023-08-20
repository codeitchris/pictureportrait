import * as dotenv from 'dotenv';

dotenv.config();

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

// Call for top like 15 artists
// Loop through and try to find at most 5 artists that have been trained on
// If we get five, run it
// If we don't find the most popular artists that are present in the top 15 to fill the gap
// Run it with those names
const artistTokenMap = new Map<string, string>();
const styles: Array<string> = ["photo of", "picture of", "painting of", "portrait of", "image of"];
const actions: Array<string> = ["dancing","smiling","laughing","playing pool","talking","playing cards","having cofee"];
var notTrained: boolean = false;

async function getPrompt(topTracks: Object): Promise<string> {

  let numStyles = getRandomInt(0,styles.length);
  let numActions = getRandomInt(0,actions.length);

  let style = styles[numStyles];
  let action = actions[numActions];

  var arr: Array<string> = [];

    for(let i =0;i<15;i++) {
      var artist: string = Object.values(topTracks)[i]["artist"];

      if(artistTokenMap.has(artist)) {
        arr.push(artistTokenMap.get(artist)||"")
        //useless, silly tyescript rule ugh
      } else {
        notTrained = true;
        arr.push(artist + "(musician)");
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

    return ("A " + style + " " + allPeople + " " + action);
}

export async function runit(token: string){
  const topTracks: Object = await getTopTracks(token);
  
  let prompt: string = await getPrompt(topTracks);

  //hit endpoint
  // remember to deal with what happens if notTrained is true. m

}