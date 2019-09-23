/**
 * extend url params to find params in href
 * @param name
 * @returns {*}
 */
$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
        return null;
    }
    else{
        return results[1] || 0;
    }
};

/**
 * return url of liveweather station data
 * @param station
 * @returns {string}
 */
function dataUrl(station){
    return "//livespotting.com/weather/live/" + station + ".json";
}

/**
 * return a float with one digit after comma
 * @param floatNumber
 * @returns {number}
 */
function oneDigitFloat(floatNumber){
    return temperature = Math.round(parseFloat(floatNumber) * 10)/10;
}

/**
 * jsonp callback from dataurl
 * @param data
 */
var lscallback = function(data){
    $(".temperature p").text(oneDigitFloat(data.temperature) + " °C");
    $(".rain p").text(oneDigitFloat(data.rain) + " mm");
    $(".wind-direction p").text(data["winddirection"] + "° " + data["winddirection_txt"]);
    $(".wind p").text(data["windspeed-ms"] + " m/s");
};

/**
 * window interval to poll current weather data
 * @type {null|window.interval}
 */
var interval =  null;

/**
 * start the app
 */
$(document).ready(function(){
    var station = $.urlParam("station");
    // if station could be parsed, start the polling interval
    if (station){
        interval = setInterval(function(){
            $.ajax({
                url: dataUrl(station),
                dataType: "jsonp",
                success: function( response ){
                    //console.log("got data");
                }
            })
        }, 5000);
    }
});
