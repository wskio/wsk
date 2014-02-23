var radiusCircle;
var map;

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
    disableDefaultUI: false,
    zoom: 17,
     mapTypeControlOptions: {
       mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
     }
    //mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var styledMap = new google.maps.StyledMapType(styles,
    {name: "Styled Map"});

  var styles = [
    {
      stylers: [
        { color: "rgb(86, 94, 94)" },
        { saturation: 100 }
      ]
    },
    {
     featureType: "road.freeway",
      stylers: [
        { color: "rgb(86, 94, 94)"},
        { saturation: 100 }
      ]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { lightness: 100 },
        { visibility: "simplified" }
      ]
    },{
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];

  map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');

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

      user = new google.maps.Marker({
        position: initialLocation,
        title: 'Click to zoom',
        map: map,
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 5,
          fillColor: 'rgb(96, 137, 170)',
          strokeColor: 'rgb(96, 137, 170)'
        },
        animation: google.maps.Animation.BOUNCE
      });
      var radiusOptions = {
        strokeColor: 'rgb(35, 178, 192)',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: 'rgba(104, 181, 188, 0.39)',
        fillOpacity: 0.35,
        map: map,
        center: initialLocation,
        radius: 80,
      };
      radiusCircle = new google.maps.Circle(radiusOptions);
      user.setMap(map);
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
  google.maps.event.addDomListener(window, 'load', "initialize");
}

var allMarkers = [];
function setMarkers(map, friend) {
  // Add users to the map

  // Marker sizes are expressed as a Size of X,Y
  // where the origin of the image (0,0) is located
  // in the top left of the image.

  // Origins, anchor positions and coordinates of the user
  // increase in the X direction to the right and in
  // the Y direction down.
  var image = {
    url: 'client/img/redcircle.png',
    // This user is 20 pixels wide by 32 pixels tall.
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
  var blip = friend.position;
      var myLatLng = new google.maps.LatLng(blip[0], blip[1]);
      var user = new google.maps.Marker({
          position: myLatLng,
          animation: google.maps.Animation.DROP,
          map: map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 9,
            strokeColor: friend.color,
            strokeOpacity: 50,
            strokeWeight: 3,
            fillColor: friend.color,
          },
          title: 'place',
          zIndex: 0
      });
      allMarkers.push(user);
  // }
}
var postsNumber = 0;
var removeTracker = 0;
var firstRunComplete = false;

var messagePositions = [];
var getAllPosts = function(){
  geo.onPointsNearLoc([myPosition.lat, myPosition.lon], radiusCircle.radius * .001, function(arr){

    arr.sort(function(a,b){return a.time - b.time});
    if(firstRunComplete===false){
      if(arr.length>=7){
        for(var i = arr.length-7; i<arr.length; i++) {
          setMarkers(map, arr[i]);
          displayMessage(arr[i].text, arr[i].color);
          messagePositions.push(arr[i].position);
        }
        firstRunComplete = true;
      } else {
        for(var i = 0; i<arr.length; i++) {
          setMarkers(map, arr[i]);
          displayMessage(arr[i].text, arr[i].color);
          messagePositions.push(arr[i].position);
        }
        firstRunComplete = true;
      }

    } else {
      if(messagePositions.length>7){

        allMarkers[removeTracker].setMap(null);
        setMarkers(map, arr[arr.length-1]);
        displayMessage(arr[arr.length-1].text, arr[arr.length-1].color);
        messagePositions.push(arr[arr.length-1].position);
        removeTracker++;

      } else {

        setMarkers(map, arr[arr.length-1]);
        displayMessage(arr[arr.length-1].text, arr[arr.length-1].color);
        messagePositions.push(arr[arr.length-1].position);

      }
    }
  });
  geo.offPointsNearLoc([myPosition.lat, myPosition.lon], radiusCircle.radius * .001, function(){
    console.log('a node has left the radius');
  });
};

var updateMap = function(){
  getLocation();
  myLoc = new google.maps.LatLng(myPosition.lat,myPosition.lon);
  map.setCenter(myLoc);
  user.setPosition(myLoc);
  radiusCircle.setCenter(myLoc);
}

setInterval(updateMap,10000);
