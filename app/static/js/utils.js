export const markEventOnMap = (geocoder, map, title, address, ) => {
    geocoder.geocode({'address': address}, (results, status) => {
        if (status === 'OK') {
            console.log(address)
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                title: title
            });
            var infowindow = new google.maps.InfoWindow();
            google.maps.event.addListener(marker, 'click', function() {
              infowindow.setContent('<div><strong>' + title + '</strong><br>' +
                address + '</div>');
              infowindow.open(map, this);
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}