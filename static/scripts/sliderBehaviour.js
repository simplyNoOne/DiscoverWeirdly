
var draggedSlider;

 function updateValue(valueId, slider, counterpartId, otherValueId, isMin, step = 1, funcToFormat = null) {   

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
                maxSlider.value = minVal + step;
                maxSlider.value = Math.min(parseInt(maxSlider.value), parseInt(maxSlider.max));
            }else{
                minSlider.value = maxVal - step;
                minSlider.value = Math.max(parseInt(minSlider.value), parseInt(minSlider.min));
            }
        }
        console.log("values", minSlider.value, ", ", maxSlider.value);

        if(!funcToFormat){
            document.getElementById(valueId).innerText = slider.value;
            document.getElementById(otherValueId).innerText = document.getElementById(counterpartId).value;
        }else{
            document.getElementById(valueId).innerText = funcToFormat(slider.value, slider.max, slider.min);
            document.getElementById(otherValueId).innerText = funcToFormat(document.getElementById(counterpartId).value, slider.max, slider.min);
        }
    }else{
        document.getElementById(valueId).innerText = slider.value;
    }
 }

 function describePopularity(value, max, min){
    const numValue = parseFloat(value);
    const numMax = parseInt(max);
    const percent = numValue/numMax;
    console.log("val ", numValue, " max ", numMax, " percent ", percent);
    if(percent < 0.2)
        return "Not at all";
    if(percent < 0.4)
        return "Some know it...";
    if(percent < 0.6)
        return "Mostly recognisable";
    if(percent < 0.8)
        return "Commonly known";
    return "Very popular";
 }

 function adjustDuration(value, max, min){
    if(value == min)
        return "<" + min + "s";
    if(value == max)
        return ">" + max + "s";
    return value + "s";
 }