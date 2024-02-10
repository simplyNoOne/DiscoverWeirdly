var profile;
var access_token;

 function onLoad(){
    var storageStr = localStorage.getItem('profile');
    profile = JSON.parse(storageStr);
    access_token = localStorage.getItem('access_token');
    console.log(profile);
    console.log(access_token);
    console.log(localStorage.getItem('refresh_token'));
    //console.log(profile.display_name);
    
 }
 
 onLoad();

 function validateNumberInput(input) {
    // Remove non-numeric characters using a regular expression
    input.value = input.value.replace(/[^0-9]/g, '');
}

async function createPlaylist(){
    const name = document.getElementById("nameTb").value;
    const description  = document.getElementById("descriptionTb").value;
    const isPublic = document.getElementById("visibility").checked;
    
      
    const playlistData = {
        name: name,
        description: description,
        public: isPublic
    };
    console.log(profile);
    console.log(access_token);
  

    const response = await fetch(`https://api.spotify.com/v1/users/${profile.id}/playlists`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(playlistData),
    });

    if(!response.ok){
        console.error('Error creating playlist:', response.status);
    }
    const data = await response.json();

    console.log('Playlist created:', data);

    return data.id;

        // .then(response => response.json())
        // .then(data => {
        //     console.log('Playlist created:', data);
        //     return data.id;
        // })
        // .catch(error => {
            
        // });

}

 async function make(){

    var playlistId = await createPlaylist();
    console.log(playlistId);

    const numberOfTracks = parseInt(document.getElementById("numberTb").value);
    const minReleaseDate = parseInt(document.getElementById("releaseDateMin").value);
    const maxReleaseDate = parseInt(document.getElementById("releaseDateMax").value);

    // Example: Get selected genres using checkboxes
    

    // Example: Get popularity range using sliders
    const minPopularity = parseInt(document.getElementById("popularityMin").value);
    const maxPopularity = parseInt(document.getElementById("popularityMax").value);
    var minDuration = parseInt(document.getElementById("durationMin").value);
    if(minDuration == 30)
        minDuration = 0;
    var maxDuration = parseInt(document.getElementById("durationMax").value);
    if(maxDuration == 600)
        maxDuration = 6000;

    // Example: Get selected lyrics option using checkboxes
    var minInstrumental = 0.55;
    var maxInstrumental = 0.45;
    if(document.getElementById("yes-lyrics").checked){
        minInstrumental = 0;
    }

    if(document.getElementById("no-lyrics").checked){
        maxInstrumental = 1;
    }

    let constraints = {
        minReleaseDate: minReleaseDate,
        maxReleaseDate: maxReleaseDate,
        minDuration: minDuration,
        maxDuration: maxDuration, 
        minPopularity: minPopularity, 
        maxPopularity: maxPopularity, 
        minInstrumental: minInstrumental, 
        maxInstrumental: maxInstrumental
    };

    if(maxInstrumental >= minInstrumental){
        var leftToAdd = numberOfTracks;
        while(leftToAdd > 0){
            let toAdd = Math.min(leftToAdd, 50);
            const added = await putSongsIntoPlaylist(playlistId, toAdd, constraints);
            leftToAdd -= added;
            console.log(added);
        }
        
    }else{
        console.log("select lyrics or no");
    }
    
   
 }

 async function putSongsIntoPlaylist(playlistId, numberOfTracks, constraints){
    const searchQuery = createSearchQuery(numberOfTracks, constraints);
    const tracks = await getSongsRecommedations(searchQuery);
    console.log(tracks);
    
    const tracksToAdd = [];
    var addedCount = 0;
    tracks.forEach(track => {
        let dateObject = new Date(track.album.release_date);
        let year = dateObject.getFullYear();
        if( addedCount < numberOfTracks && year >= constraints.minReleaseDate - 5 && year <= constraints.maxReleaseDate + 5){
            tracksToAdd.push(track.uri);
            addedCount += 1;
        }
            
    });

    console.log(addedCount);

    if(numberOfTracks - addedCount > 0){
        const additionalTracks = await getSongsSearch(numberOfTracks - addedCount, constraints.minReleaseDate, constraints.maxReleaseDate);
        console.log(additionalTracks);
        additionalTracks.forEach(track => {
            tracksToAdd.push(track.uri);
        });
    }
    

    const apiUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

    console.log(tracksToAdd);

    const requestBody = {
        uris: tracksToAdd
    };

    console.log(JSON.stringify(requestBody));

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log("Tracks added:", data);
    } catch (error) {
        console.error("Error adding tracks:", error);
    }

    return numberOfTracks;

 }

 function getGenres(separator){
    const selectedGenres = [];
    const genreCheckboxes = document.querySelectorAll('#genreSection input[type="checkbox"]:checked');
    genreCheckboxes.forEach(checkbox => {
        selectedGenres.push(checkbox.id);
    });
    const convertedList = selectedGenres.join(separator);
    console.log(convertedList);
    return convertedList;
 }

 function createSearchQuery(num, constraints){
    var searchQuery = new URLSearchParams();
    var possibleGenres = getGenres(",");
    searchQuery.append("seed_genres", possibleGenres);
    searchQuery.append("limit", num + 30);
    searchQuery.append("min_duration_ms", constraints.minDuration * 1000);
    searchQuery.append("max_duration_ms", constraints.maxDuration * 1000);
    searchQuery.append("min_popularity", constraints.minPopularity);
    searchQuery.append("max_popularity", constraints.maxPopularity);
    searchQuery.append("min_instrumentalness", constraints.minInstrumental);
    searchQuery.append("max_instrumentalness", constraints.maxInstrumental);


    return searchQuery.toString();
 }

 async function getSongsRecommedations(searchQuery){

    var url = `https://api.spotify.com/v1/recommendations?`;
    url += searchQuery;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      });
  
      const data = await response.json();
      console.log('Recommendations:', data);
      return data.tracks;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }

 }

 async function getSongsSearch(num, yearMin, yearMax){

    var url = `https://api.spotify.com/v1/search?`;

    var alphabet = "abcdefghijklmnopqrstuwvxyz";
    var query = alphabet[Math.floor(Math.random() * alphabet.length)];
    query +=" year:" + yearMin +"-" + yearMax;
    query += " genre:" + getGenres(",");

    var searchQuery = new URLSearchParams();
    searchQuery.append("q", query);
    searchQuery.append("type", "track");
    searchQuery.append("limit", num);

    console.log(searchQuery);

    url += searchQuery;

    try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
          },
        });
    
        const data = await response.json();
        console.log('Searches:', data);
        return data.tracks.items;
      } catch (error) {
        console.error('Error fetching searches:', error);
      }
  
 }