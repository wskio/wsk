var radiusCircle;

var mapInit = function(){
  var initialLocation;
  var siberia = new google.maps.LatLng(60, 105);
  var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
  var browserSupportFlag =  new Boolean();

  var myOptions = {
    draggable: false,
    panControl: false,
    disableDoubleClickZoom: true,
    scrollwheel: false,
    disableDefaultUI: true,
    zoom: 19,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);

  // Try W3C Geolocation (Preferred)
  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      myPosition.lat = position.coords.latitude;
      myPosition.lon = position.coords.longitude;
      initialLocation = new google.maps.LatLng(myPosition.lat,myPosition.lon);
      map.setCenter(initialLocation);
      var imageBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(initialLocation),
      new google.maps.LatLng(initialLocation));
      var marker = new google.maps.Marker({
        position: initialLocation,
        title: 'Click to zoom'
      });
      var radiusOptions = {
        strokeColor: '#419DD5',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: 'rgba(175, 227, 243, 0.71)',
        fillOpacity: 0.35,
        map: map,
        center: initialLocation,
        radius: 50,
      };
      radiusCircle = new google.maps.Circle(radiusOptions);
      marker.setMap(map);
      getAllPosts();

    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });
  }
  // Browser doesn't support Geolocation
  else {
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag);
  }

  var handleNoGeolocation = function(errorFlag) {
    if (errorFlag == true) {
      alert("Geolocation service failed.");
      initialLocation = newyork;
    } else {
      alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
      initialLocation = siberia;
    }
    map.setCenter(initialLocation);
  };


  // var mapOptions = {
  //   center: new google.maps.LatLng(-34.397, 150.644),
  //   zoom: 12
  // };
  // var map = new google.maps.Map(document.getElementById("map-canvas"),
  //     mapOptions);
  // adds marker at position defined below
  google.maps.event.addDomListener(window, 'load', "initialize");
  // marker.setMap(map);
}

function setMarkers(map, locations) {
  // Add markers to the map

  // Marker sizes are expressed as a Size of X,Y
  // where the origin of the image (0,0) is located
  // in the top left of the image.

  // Origins, anchor positions and coordinates of the marker
  // increase in the X direction to the right and in
  // the Y direction down.
  var image = {
    url: 'client/img/redcircle.png',
    // This marker is 20 pixels wide by 32 pixels tall.
    size: new google.maps.Size(50, 50),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0,0),
    // The anchor for this image is the base of the flagpole at 25,25.
    anchor: new google.maps.Point(25, 25)
  };
  // Shapes define the clickable region of the icon.
  // The type defines an HTML &lt;area&gt; element 'poly' which
  // traces out a polygon as a series of X,Y points. The final
  // coordinate closes the poly by connecting to the first
  // coordinate.
  var shape = {
      coord: [1, 1, 1, 20, 18, 20, 18 , 1],
      type: 'poly'
  };
  for (var i = 0; i < locations.length; i++) {
    console.log('running through location: ' + locations[i])
    var blip = locations[i];
      var myLatLng = new google.maps.LatLng(blip[0], blip[1]);
      var marker = new google.maps.Marker({
          position: myLatLng,
          animation: google.maps.Animation.DROP,
          map: map,
          icon: image,
          shape: shape,
          title: 'place',
          zIndex: 0
      });
  }
}
var postsNumber = undefined;
var firstRun = false;

var getAllPosts = function(){
  geo.onPointsNearLoc([myPosition.lat, myPosition.lon], radiusCircle.radius * .001, function(arr){
    postsNumber = postsNumber || arr.length;

    console.log(arr.length);
    var messagePositions = [];
    $('.messageContainer').remove();
    for (var i = arr.length - postsNumber; i < arr.length; i++) {
      displayMessage(arr[i].text);
      messagePositions.push(arr[i].position);
    };
    postsNumber++;
    setMarkers(map, messagePositions);
  });
}
