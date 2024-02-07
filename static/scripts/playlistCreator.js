

 function updateValue(valueId, value) {
     document.getElementById(valueId).innerText = value;
 }

 function onLoad(){
    var profileStr = localStorage.getItem('profile');
    var profile = JSON.parse(profileStr);
    console.log(profile);
    console.log(profile.display_name);
 }
 
 onLoad();


 function make(){
    const numberOfTracks = document.getElementById("numberTb").value;

    const minReleaseDate = document.getElementById("labelReleaseDateMin").value;
    const maxReleaseDate = document.getElementById("labelReleaseDateMax").value;

    // Example: Get selected genres using checkboxes
    const selectedGenres = [];
    const genreCheckboxes = document.querySelectorAll('#genreSection input[type="checkbox"]:checked');
    genreCheckboxes.forEach(checkbox => {
        selectedGenres.push(checkbox.id);
    });

    // Example: Get popularity range using sliders
    const minPopularity = document.getElementById("popularityMin").value;
    const maxPopularity = document.getElementById("popularityMax").value;

    // Example: Get selected lyrics option using checkboxes
    const includeLyrics = document.getElementById("lyrics1").checked;
 }