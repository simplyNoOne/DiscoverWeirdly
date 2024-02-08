var profile;
var access_token;

 function updateValue(valueId, value) {
     document.getElementById(valueId).innerText = value;
 }

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
    const minReleaseDate = parseInt(document.getElementById("labelReleaseDateMin").value);
    const maxReleaseDate = parseInt(document.getElementById("labelReleaseDateMax").value);

    // Example: Get selected genres using checkboxes
    

    // Example: Get popularity range using sliders
    const minPopularity = parseInt(document.getElementById("popularityMin").value);
    const maxPopularity = parseInt(document.getElementById("popularityMax").value);

    // Example: Get selected lyrics option using checkboxes
    var minInstrumental = 0.55;
    var maxInstrumental = 0.45;
    if(document.getElementById("yes-lyrics").checked){
        minInstrumental = 0;
    }

    if(document.getElementById("no-lyrics").checked){
        maxInstrumental = 1;
    }

    if(maxInstrumental >= minInstrumental){
        var leftToAdd = numberOfTracks;
        while(leftToAdd > 0){
            let toAdd = Math.min(leftToAdd, 50);
            const added = await putSongsIntoPlaylist(playlistId, toAdd, minReleaseDate, maxReleaseDate, minPopularity, maxPopularity, minInstrumental, maxInstrumental);
            leftToAdd -= added;
            console.log(added);
        }
        
    }else{
        console.log("select lyrics or no");
    }
    
   
 }

 async function putSongsIntoPlaylist(playlistId, numberOfTracks, minReleaseDate, maxReleaseDate, minPopularity, maxPopularity, minInst, maxInst){
    const searchQuery = createSearchQuery(numberOfTracks, minPopularity, maxPopularity, minInst, maxInst);
    const tracks = await getSongs(searchQuery);
    console.log(tracks);
    
    const tracksToAdd = [];
    var addedCount = 0;
    tracks.forEach(track => {
        let dateObject = new Date(track.album.release_date);
        let year = dateObject.getFullYear();
        if(year >= minReleaseDate && year <= maxReleaseDate){
            tracksToAdd.push(track.uri);
            addedCount += 1;
        }
            
    });

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

    return addedCount;

 }

 function getGenres(){
    const selectedGenres = [];
    const genreCheckboxes = document.querySelectorAll('#genreSection input[type="checkbox"]:checked');
    genreCheckboxes.forEach(checkbox => {
        selectedGenres.push(checkbox.id);
    });
    const convertedList = selectedGenres.join(",");
    console.log(convertedList);
    return convertedList;
 }

 function createSearchQuery(num, minPop, maxPop, minInst, maxInst){
    var searchQuery = new URLSearchParams();
    var possibleGenres = getGenres();
    searchQuery.append("seed_genres", possibleGenres);
    searchQuery.append("limit", num);
    searchQuery.append("min_popularity", minPop);
    searchQuery.append("max_popularity", maxPop);
    searchQuery.append("min_instrumentalness", minInst);
    searchQuery.append("max_instrumentalness", maxInst);


    return searchQuery.toString();
 }

 async function getSongs(searchQuery){

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