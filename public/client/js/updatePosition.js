//var x = document.getElementById("demo");

var myPosition = {lat: null, lon: null};

function getLocation(){
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition);
  }
  else{
    alert('this browser does not support geolocation!');
  }
}
function showPosition(position){
  myPosition.x = position.coords.latitude;
  myPosition.y = position.coords.longitude;
  console.log(myPosition.x);
}
setInterval(getLocation, 7000);
