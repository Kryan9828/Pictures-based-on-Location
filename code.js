// Removing begining documentation with out altering html file
let title = document.querySelector("h1")
title.innerText = "Photos from your location"
let uselessText = document.querySelector("h3")
document.body.removeChild(uselessText)

// code for JS in Wild Program
let options = {
    enableHighAccuracy: true,
    maximumAge:0
}

const fallballLocation = {latitude:48.8575, longitude:2.2982} // Paris
let photoArray = []
let currentPhotoIndex = 0

function assembleImageSourceURL(photoObj){
    return `https://farm${photoObj.farm}.staticflickr.com/`+
    `${photoObj.server}/` +
    `${photoObj.id}_${photoObj.secret}.jpg`
}


function showPhotos(data){
    let photoArray = data.photos.photo
    let startButton = document.createElement("button")
    startButton.innerText = "Start Looking at photos"
    document.body.append(startButton)

    startButton.addEventListener("click", function(){
        
        let imgPhoto = document.createElement("img")
        if(currentPhotoIndex >= 5){
            currentPhotoIndex = 0
        } else {
        imgPhoto.src = assembleImageSourceURL(photoArray[currentPhotoIndex])
        document.body.append(imgPhoto)
        startButton.innerText = "Next Photo"
        currentPhotoIndex++
        }
    })
}
function processResponse(response){
    let responsePromoise = response.json()
    responsePromoise.then(showPhotos)
}

function requestPhoto(location){
    console.log(`Requesting photos near ${location.latitude}, ${location.longitude}.`)
    const apiKey = "84f5784e9f598e395aca2a94e1f1d40d"
    const urlSecondHalf = `&format=json&nojsoncallback=1`+
        `&method=flickr.photos.search`+
        `&safe_search=1`+
        `&per_page=5`+
        `&lat=${location.latitude}`+
        `&lon=${location.longitude}`+
        `&text=wildlife`
    const urlFirstHalf = "https://shrouded-mountain-15003.herokuapp.com"+
        "/https://api.flickr.com/services/rest/?api_key="
    const urlComplete = urlFirstHalf + apiKey + urlSecondHalf

    let fetchPromise = fetch(urlComplete)
    
    fetchPromise.then(processResponse)
}

function userCurrentLocation (pos){
    console.log("Using Actual Location")
    console.log(pos)
    requestPhoto(pos.coords)
}

function useFallbackLocation(){
    console.log("Using fallback location")
    requestPhoto(fallballLocation)
}

navigator.geolocation.getCurrentPosition(userCurrentLocation, useFallbackLocation, options)