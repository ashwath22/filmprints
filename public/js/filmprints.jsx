let heroSection = document.querySelector(".heroSection");
let albumGallery = document.querySelector(".albumGallery");
let albumImages = document.querySelector("#albumImages");

let fullPage = document.querySelector("#fullpage");
let photoContainer = document.querySelector(".photoContainer");

var contentfulUrl = "https://cdn.contentful.com/spaces/ey04yid3tpau/entries?access_token=2abdc50fa88530996ceac4fb4ad6f7c3271cc33bb3f6a11721d8d169c0459fa7";

var albums = 0;
var photos = 0;

var photoDump = [];

var filmprints = {
    titleText: null,
    leadText: null,
    heroImageUrl: null,
    album: []
}

function loadHomeContent(doSomething) {
    jQuery.getJSON(contentfulUrl, function(json) {
        cleanJson(json);
        showHome();
    });
}

function loadAlbumContent(doSomething) {
    jQuery.getJSON(contentfulUrl, function(json) {
        cleanJson(json);
        showAlbum();
    });
}

function cleanJson(json) {
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
    
    });
}

function showHome(json) {
    let maxCount = 0;
    filmprints.album.forEach( function(singleAlbum, index) {
        if (singleAlbum.photo.length > maxCount) {
            maxCount = singleAlbum.photo.length;
        }
    });

    var templateFn = Handlebars.compile(heroTemplate.innerHTML);
    heroSection.innerHTML = templateFn(filmprints);

    var templateFn = Handlebars.compile(albumTemplate.innerHTML);
    albumGallery.innerHTML = templateFn(filmprints);

    loadFullpage();
}

function goToAlbum(albumTile) {
    window.open("/album?id=" + albumTile.id, "_self");
}

function showAlbum() {
    let albumId = getURLParameter("id");
    filmprints.album.forEach(function(singleAlbum){
        if (singleAlbum.id === albumId){
            var templateFn = Handlebars.compile(photoTemplate.innerHTML);
            photoContainer.innerHTML = templateFn(singleAlbum);
        }
    });
    loadFullpage();
}

function loadFullpage() {
    $(document).ready(function() {
        $('#fullpage').fullpage({
            scrollOverflow: true
        });
    });
}

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

