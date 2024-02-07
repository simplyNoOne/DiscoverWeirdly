var client_id = 'b4fa254dfb694db2bf20340740580af8';
var client_secret = 'f6e5aba8393f4fc385c6a91ce91599a5';
var redirect_uri = 'http://localhost:4321/callback';

function requestAuth(){
    const params = new URLSearchParams();
    params.append("client_id", client_id);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:4321/callback");
    params.append("scope", "user-read-private user-read-email");
    // params.append("code_challenge_method", "S256");
    // params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;

}

requestAuth();