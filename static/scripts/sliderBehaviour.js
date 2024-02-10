
var draggedSlider;

 function updateValue(valueId, slider, counterpartId, otherValueId, isMin) {
     document.getElementById(valueId).innerText = slider.value;
    

    if (counterpartId != null) {
        let minSlider, maxSlider;
        if(isMin){
            maxSlider = document.getElementById(counterpartId);
            minSlider = slider;
        }else{
            minSlider = document.getElementById(counterpartId);
            maxSlider = slider;
        }
        console.log("values", minSlider.value, ", ", maxSlider.value)
        let maxVal = parseInt(maxSlider.value), minVal = parseInt(minSlider.value) ;
        if(minVal >= maxVal){
            console.log("its wrong");
            if(slider == minSlider){
                maxSlider.value = minVal + 5;
                maxSlider.value = Math.min(parseInt(maxSlider.value), parseInt(maxSlider.max));
            }else{
                minSlider.value = maxVal - 5;
                minSlider.value = Math.max(parseInt(minSlider.value), parseInt(minSlider.min));
            }
        }
        document.getElementById(otherValueId).innerText = document.getElementById(counterpartId).value;
        console.log("values", minSlider.value, ", ", maxSlider.value);
    }
 }

 function mouseUp(){
    draggedSlider = null;
 }

 function mouseDown(slider){
    draggedSlider = slider;
 }