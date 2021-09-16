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
$(function(){

let oreserve = document.getElementById('reserve')
let ointro = document.getElementById('cardintro')
let ofm = document.getElementById('cardform')
oreserve.addEventListener('click',()=>{   
    ointro.classList.add('hide')
    ofm.classList.remove('hide')
})
    

const modifydate = ()=>{
    let odt = document.getElementById('datebox')
    let dates = odt.querySelectorAll('.day')
    let hash = []
    let html = ''
    for (let odate of dates){
        let text = odate.innerText.split(' ')[0].slice(5)
        odate.innerText=text
        // console.log(text.split('-')[0]+text.split('-')[1])
        if (hash.indexOf(Number(text.split('-')[0]+text.split('-')[1]))==-1){
            hash.push(Number(text.split('-')[0]+text.split('-')[1]))
            console.log(hash)
        }
        else{
            odate.style.display = 'none'
        }

        // console.log(odate.innerText)
        
    }

}
const bindvac=()=>{
    const otype = document.getElementById('typebox')
    const types = otype.querySelectorAll('span')
    const otpinput = document.getElementById('vactype')
    otype.addEventListener('click',(e)=>{
        if (e.target.tagName == 'SPAN'){
            e.target.classList.toggle('active')
            for (let i of types){
                if (i != e.target){
                    i.classList.remove('active')
                }
            }
            otpinput.value = e.target.dataset.tp
        
        }
    })

}
const binddate=()=>{
    odat = document.getElementById('datebox')
    odatip = document.getElementById('dateboxput')
    other = odat.querySelectorAll('.day')
    
    ot = document.getElementById('tpbox')
    otip = document.getElementById('timebox')
    other2= ot.querySelectorAll('.detialItem')
    odat.addEventListener('click',(e)=>{
        // console.log(e.target.tagName)
        if(e.target.tagName=='DIV' && e.target.id !='datebox'){
            
            e.target.classList.toggle('active')
            odatip.value = e.target.dataset.time
            for(i of other){
                if(i!=e.target){
                    i.classList.remove('active')
                }
            }

        }

    })
    ot.addEventListener('click',(e)=>{
        if(e.target.tagName == 'SPAN'){
            e.target.classList.toggle('active')
            otip.value = e.target.innerText
            for (let k of other2){
                if (k!=e.target){
                    k.classList.remove('active')
                }
            }
        }
    })



}
const bindsubmit=()=>{
    const subm = document.getElementById('back')
    subm.addEventListener('click',()=>{
        ointro.classList.remove('hide')
    ofm.classList.add('hide')

    })
}
modifydate()
    bindvac()
    binddate()
    bindsubmit()

 
}

)
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