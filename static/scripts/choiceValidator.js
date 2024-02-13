
function validate(button){
    const genreCheckboxes = document.querySelectorAll('#genreSection input[type="checkbox"]:checked');
    const lyricsCheckboxes = document.querySelectorAll('#lyricsSection input[type="checkbox"]:checked');

    if(lyricsCheckboxes.length != 0){
        if(genreCheckboxes.length > 0 && genreCheckboxes.length < 6){
            if (button.classList.contains('wrongInput')){
                document.getElementById('genreSection').classList.remove('inputToCorrect');
                button.classList.remove('wrongInput');
                button.disabled = false;
                return;
            }
        }
        else if (!button.classList.contains('wrongInput')){
            document.getElementById('genreSection').classList.add('inputToCorrect');
            button.classList.add('wrongInput');
            button.disabled = true;
        }
    }else if (!button.classList.contains('wrongInput')){
        button.classList.add('wrongInput');
        button.disabled = true;  
    }
    

    

}