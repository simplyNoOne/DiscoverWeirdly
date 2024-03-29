
const clientId = "b4fa254dfb694db2bf20340740580af8";


const getRefreshToken = async () => {

  // refresh token that has been previously stored
    const refreshToken = localStorage.getItem('refresh_token');
    const url = "https://accounts.spotify.com/api/token";
  
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId
      }),
    }
    const body = await fetch(url, payload);
    const response = await body.json();
  
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
  }

function onLoad(){
  const tokenMade = new Date(JSON.parse(localStorage.getItem('token_created_time')));
  const now = new Date();
  const diffMinutes = Math.floor((now - tokenMade) / (1000 * 60));
  console.log(tokenMade, now, diffMinutes);
  if(diffMinutes < 59){
    getRefreshToken();
  }else{
    console.log("token exp");
    window.location.href = 'http://localhost:4321/callback/';
  }
}

onLoad();
