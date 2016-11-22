// Create the Elements.
let homePage = document.querySelector(".homePage");

// setup URLs for API calls.
let contentfulUrl = "https://cdn.contentful.com/spaces/ey04yid3tpau/entries?access_token=2abdc50fa88530996ceac4fb4ad6f7c3271cc33bb3f6a11721d8d169c0459fa7";

// Add Event Listeners. 
window.addEventListener('load', showStuff);


// Update page
// ----------------------------------------------

// Add Event Handler functions.
function showStuff (event) {
    event.preventDefault();
    // JSONify!!
    jQuery.getJSON(contentfulUrl, doStuff);
}
// update the articles on the page.
function doStuff(json) {
    console.log('Json dump: ',json);
    
    var items = json.items;
    var assets = json.includes.Asset;

    items.forEach(function(item){
        if (item.fields.albums) {
            var albums=item.fields.albums;
            console.log(item.fields.titleText);
            console.log(item.fields.leadText);
            var heroImageLink = getImageLink(item.fields.heroImage.sys.id);
            console.log("Hero image: ", "http:" + heroImageLink);
            albums.forEach(function(album){
                var albumId = album.sys.id;
                items.forEach(function(item){
                    // Find and print album details
                    if(item.sys.id === albumId){
                        console.log(" ");
                        console.log(" ");
                        console.log(item.fields.albumName);
                        console.log(item.fields.albumDate);
                        // console.log("cover image: ",item.fields.coverImage.sys.id);
                        var albumCoverLink = getImageLink(item.fields.coverImage.sys.id);
                        console.log("http:" + albumCoverLink);
                             
                        // Find and print picture details
                        var images = item.fields.images;
                        images.forEach(function(image){
                            items.forEach(function(item){
                                if (item.sys.id === image.sys.id){
                                    console.log(" ",item.fields.location);
                                    // Find id from sys then from fields as assets are found with fields.id
                                    // console.log(" Image id:",item.fields.photo.sys.id); 
                                    // Find the right image asset based on fields.id
                                    assets.forEach(function(asset){
                                        if (asset.sys.id === item.fields.photo.sys.id){
                                            console.log("http:" + asset.fields.file.url);

                                        }
                                    })                                   
                                }
                            })
                            // console.log("Place:", location);
                        })
                    }    
                })
            })
        }
    })

    // return link for an image from Asset object
    function getImageLink(imageId){
        assets.forEach(function(asset){
            if (asset.sys.id === imageId){
                return asset.fields.file.url;
            }
        })     
    }


    homePage.innerHTML = '';
    var templateFn = Handlebars.compile(homePageTemplate.innerHTML);
    homePage.innerHTML = templateFn(json);
    // console.log('Json dump: ',json);
    // console.log('Title text: ',json.items[0].fields.titleText);
    // console.log('image: ', 'http:' + json.includes.Asset[0].fields.file.url);
    // console.log('Lead text: ',json.items[0].fields.leadText);
}