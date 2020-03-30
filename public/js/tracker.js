let map;
let markers = new Map();

var iconBase = "http://maps.google.com/mapfiles/kml/shapes/";

var icons = {
  me: {
    icon: iconBase + "woman.png"
  },
  saviour: {
    icon: iconBase + "police.png"
  },
  safeHouse: {
    icon: iconBase + "ranger_station.png"
  }
};



document.addEventListener("DOMContentLoaded", () => {
  const options = {
    enableHighAccuracy: true,
    maximumAge: 0
  };
const socket = io("/");

  setInterval(() => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: long } = pos.coords;

        socket.emit("updateLocation", { lat, long });
      },
      err => {
        console.error(err);
      },
      options
    );
    socket.emit("getLocations");
  }, 2000);

  
  socket.on("currentLocations", locations => {
    markers.forEach((marker, id) => {
      marker.setMap(null);
      markers.delete(id);
    });

    locations.forEach(([id, position]) => {
      if (position.lat && position.long) {
        if (id === socket.id) {
          icon = icons.me.icon;
        } else {
          icon = icons.saviour.icon;
        }
        const marker = new google.maps.Marker({
          position: new google.maps.LatLng(position.lat, position.long),
          map,
          icon: icon
        });
        markers.set(id, marker);
        console.log(markers)
      }
    });
  });

    
});

function initMap() {
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude: lat, longitude: long } = pos.coords;
      map = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(lat, long),
        zoom: 2
      });
      var features = [
        {
          position: new google.maps.LatLng(18.6080504, 73.78007459999999),
          type: "safeHouse"
        },
        {
          position: new google.maps.LatLng(18.6050504, 73.78407459999999),
          type: "safeHouse"
        },
        {
          position: new google.maps.LatLng(18.6060504, 73.78207459999999),
          type: "saviour"
        },
        {
          position: new google.maps.LatLng(18.6070504, 73.78107459999999),
          type: "saviour"
        },
        {
            position: new google.maps.LatLng(18.6170504, 73.78407459999999),
            type: "saviour"
          },
          {
            position: new google.maps.LatLng(18.6100504, 73.78407059999999),
            type: "safeHouse"
          },
          {
            position: new google.maps.LatLng(18.6970504, 73.78107459999999),
            type: "saviour"
          },
      ];
      for (let i = 0; i < features.length; i++) {
        const marker = new google.maps.Marker({
          position: features[i].position,
          icon: icons[features[i].type].icon,
          map: map
        });
      }
    },
    err => {
      console.error(err);
    }
  );
}
