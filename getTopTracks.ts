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

export function runit(token: string){
  const topTracks = getTopTracks(token);
  
}