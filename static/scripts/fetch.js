const clientId = "b4fa254dfb694db2bf20340740580af8"; // Replace with your client ID
const clientSecret = "f6e5aba8393f4fc385c6a91ce91599a5";
const params = new URLSearchParams(window.location.search);


function auth(){
    console.log("AUTH");
    console.log(code);


    console.log("kdsjahilkfdshdskafljhfdsakkjfdsalikdsafjokfdsakjdsfah");
    redirectToAuthCodeFlow(clientId);

}



async function load(){
    if(code != 'None'){
        console.log("kjdhalkadfshdkifhfdiklajhfdkldsaj")
        const tokens = await getTokens(clientId, code);
        var profile = await fetchProfile(tokens.access);
        console.log(profile);
        localStorage.setItem('profile', JSON.stringify(profile));
        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);
        localStorage.setItem('token_created_time', JSON.stringify(new Date()));
        
        
        console.log(profile.display_name);
        window.location.href = 'http://localhost:4321/profcallback/';
    }
    
}


load();

// async function redirectToAuthCodeFlow(clientId) {
//     // TODO: Redirect to Spotify authorization page

// }

async function getTokens(clientId, code) {
    const verifier = localStorage.getItem("verifier");

    console.log(code);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret)
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:4321/callback");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization" : "Basic " + btoa(clientId + ":" + clientSecret) },
        body: params
    });

    const responseJson = await result.json();
    console.log(responseJson);
    const { access_token } = responseJson;
    const { refresh_token } = responseJson;
    return {
        access: access_token,
        refresh: refresh_token
    };
}

async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);


    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:4321/callback");
    params.append("scope", "user-read-private playlist-modify-public playlist-modify-private");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}


//some spofity vodoo
function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}
