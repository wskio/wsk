//var x = document.getElementById("demo");

var myPosition = {lat: null, lon: null};

var options = {'enableHighAccuracy': true, 'timeout':10000, 'maximumAge':0};

var displayError = function(error){
  console.log(error);
};

var showPosition = function(position){
  myPosition.lat = position.coords.latitude;
  myPosition.lon = position.coords.longitude;
  console.log(myPosition.lat, myPosition.lon);
};

var getLocation = function(){
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition, displayError, options);
  }
  else{
    alert('this browser does not support geolocation!');
  }
};