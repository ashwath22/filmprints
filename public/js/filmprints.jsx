// Create the Elements.
console.log("here");
let heroSection = document.querySelector(".heroSection");
let albumGallery = document.querySelector(".albumGallery");
let albumTile = document.querySelector(".albumGallery");
let popUp = document.querySelector("#popUp");
let close = document.querySelector("a.closePopUp");
var popUpContainer = document.querySelector(".popUpContainer");


// setup URLs for API calls.
let contentfulUrl = "https://cdn.contentful.com/spaces/ey04yid3tpau/entries?access_token=2abdc50fa88530996ceac4fb4ad6f7c3271cc33bb3f6a11721d8d169c0459fa7";

// initialise fullPage

// Add Event Listeners. 
window.addEventListener('load', showStuff);
albumTile.addEventListener('click', showPopup);
close.addEventListener('click', closePopup);


var albums = 0;
var photos = 0;

var photoDump = [];

var filmprints = {
    titleText: null,
    leadText: null,
    heroImageUrl: null,
    album: []
}



// Update page
// ----------------------------------------------

// Add Event Handler functions.
function showStuff(event) {
    event.preventDefault();
    // JSONify!!
    jQuery.getJSON(contentfulUrl, doStuff);
}
// update the articles on the page.
function doStuff(json) {
    console.log('json dump: ',json);

    var items = json.items;
    var assets = json.includes.Asset;

    items.forEach(function(item){
        if (item.fields.albums) {
            var albums=item.fields.albums;
            
            assets.forEach(function(asset){
                if (asset.sys.id === item.fields.heroImage.sys.id){
                    filmprints.heroImageUrl = "http:" + asset.fields.file.url;
                }
            })

            filmprints.titleText = item.fields.titleText;
            filmprints.leadText = item.fields.leadText;
            
            albums.forEach(function(album){
                var albumId = album.sys.id;
                var tempAlbumCover= null;

                items.forEach(function(item){
                    // Find and print album details
                    if(item.sys.id === albumId){
                        assets.forEach(function(asset){
                            if (asset.sys.id === item.fields.coverImage.sys.id){
                                tempAlbumCover = "http:" + asset.fields.file.url;
                            }
                        })
                             
                        // Find and print picture details
                        var images = item.fields.images;
                        images.forEach(function(image){
                        var tempLocation = null;
                        var tempLink = null;
                            items.forEach(function(item){
                                if (item.sys.id === image.sys.id){
                                    tempLocation = item.fields.location;
                                    // Find id from sys then from fields as assets are found with fields.id
                                    // Find the right image asset based on fields.id
                                    assets.forEach(function(asset){
                                        if (asset.sys.id === item.fields.photo.sys.id){
                                            tempLink = "http:" + asset.fields.file.url;
                                        }
                                    })                                   
                                }
                            })
                            photoDump.push({
                                "location": tempLocation,
                                "link": tempLink
                            })
                        })

                        filmprints.album.push(
                            {
                                "name": item.fields.albumName, 
                                "date": item.fields.albumDate,
                                "coverImage": tempAlbumCover,
                                "photo": photoDump,
                                "id": albumId
                            }
                        );

                        photoDump=[];

                        
                    }    
                })          
            })
        }
    
    })
    console.log("cleaned up JSON: ",filmprints);
    // return link for an image from Asset object
    
    function getImageLink(searchImageId) {
        assets.forEach(function(asset){
            if (asset.sys.id === searchImageId){
                console.log("asset.fields.file.url");
            }
        })     
    }

    // heroSection.innerHTML = '';
    var templateFn = Handlebars.compile(heroTemplate.innerHTML);
    heroSection.innerHTML = templateFn(filmprints);

    // albumGallery.innerHTML = '';
    var templateFn = Handlebars.compile(albumTemplate.innerHTML);
    albumGallery.innerHTML = templateFn(filmprints);

}

function showPopup(event) {
    popUp.classList.remove("loader", "hidden");
    // console.log("popup", filmprints);
    let target = event.target.closest("FIGURE");
    let searchId = target.id;

    filmprints.album.forEach(function(ALBUM){
        if (ALBUM.id === searchId){
            var templateFn = Handlebars.compile(albumContents.innerHTML);
            popUpContainer.innerHTML = templateFn(ALBUM);
        }
    })     
}

function closePopup(event) {
    event.preventDefault();
    popUp.classList.add("loader", "hidden");
}

