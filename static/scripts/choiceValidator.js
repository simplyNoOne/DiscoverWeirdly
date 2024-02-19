
function validate(self, buttonName){
    const button = document.getElementById(buttonName);
    const genreCheckboxes = document.querySelectorAll('#genreSection input[type="checkbox"]:checked');
    const lyricsCheckboxes = document.querySelectorAll('#lyricsSection input[type="checkbox"]:checked');
    const titleTextbox = document.getElementById('nameTb');
    

    let count = 0;
    if(lyricsCheckboxes.length != 0){
        count++;
        if(document.getElementById('lyricsSection').classList.contains('inputToCorrect')){
            document.getElementById('lyricsSection').classList.remove('inputToCorrect');
        }
    }else{
        if(self == button){
            if(!document.getElementById('lyricsSection').classList.contains('inputToCorrect')){
                document.getElementById('lyricsSection').classList.add('inputToCorrect');
            }
        }
    }
    if(genreCheckboxes.length > 0 && genreCheckboxes.length < 6){
        count++;
        if(document.getElementById('genreSection').classList.contains('inputToCorrect')){
            document.getElementById('genreSection').classList.remove('inputToCorrect');
        }
    }
    else{
        if(self == button){
            if(!document.getElementById('genreSection').classList.contains('inputToCorrect')){
                document.getElementById('genreSection').classList.add('inputToCorrect');
            }
        }
    }
    if(titleTextbox.value != ''){
        count++;
        if(document.getElementById('nameSelection').classList.contains('inputToCorrect')){
            document.getElementById('nameSelection').classList.remove('inputToCorrect');
        }
    }else{
        if(self == button){
            if(!document.getElementById('nameSelection').classList.contains('inputToCorrect')){
                document.getElementById('nameSelection').classList.add('inputToCorrect');
            } 
        }
    }
    if(count == 3){
        if (button.classList.contains('wrongInput')){
            button.classList.remove('wrongInput');
            button.disabled = false;  
        }
    }else{
        if (!button.classList.contains('wrongInput')){
            button.classList.add('wrongInput');
            button.disabled = true;  
        }
    }


    

}