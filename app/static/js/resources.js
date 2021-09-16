const ind_ref = 2
$(function(){
    $(".topbar div").each(function(index,element){
        if (index == ind_ref){
            element.classList.add('active')
        }
        else{
            element.classList.remove('active')
        }
        console.log(index,element.classList)
    })

})

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: !The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

var map, infoWindow;
var im = 'http://www.robotwoods.com/dev/misc/bluecircle.png';
var initMap = () => {
    map = new google.maps.Map(document.getElementById('map'), {
        //center: {lat: 43.6532, lng: 79.3832},
        center: {lat: 40.813078, lng: -73.046388},
        zoom: 12
    });
    infoWindow = new google.maps.InfoWindow;
    // Try HTML5 geolocation.
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function (position) {

            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            var userMarker = new google.maps.Marker({
                position: pos,
                map: map,
                icon: im
            });
            infoWindow.setPosition(pos);
            map.setCenter(pos);
        }, function () {
            console.log("callback error");
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        console.log("callback False");
        handleLocationError(false, infoWindow, map.getCenter());
    }


}
// import {markEventOnMap} from './utils.js'
window.onload=()=>{
    initMap()
    var geocoder = new google.maps.Geocoder();
    function getdata(){
        $.ajax({
            url:'/hosinfo',
            dataType: "json",
            type: "GET",
            success:function (response) {
                if (response['isSuccess']) {
                    let hospitals = response['data']
                    for (let item of hospitals){
                         markEventOnMap(geocoder, map, item['name'], item['address'])
                     }
                //     console.log(response['username'])
                //     localStorage.token = response['z-token']
                //     $.cookie("z-token", localStorage.token);
                //     location.href="/manage"
                //     // window.location.replace('/manage');
                // } else {

                //     toastshow(response,true)
                }
            }
            
        })
    }
    getdata()
    
    
}

const markEventOnMap = (geocoder, map, title, address, ) => {
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