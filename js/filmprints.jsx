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
    console.log('Title: ',json.items[4].fields.titleText);

    json.includes.Asset[0].fields.file.url = 'http:' + json.includes.Asset[0].fields.file.url 
    json.includes.Asset[1].fields.file.url = 'http:' + json.includes.Asset[1].fields.file.url 
    json.includes.Asset[2].fields.file.url = 'http:' + json.includes.Asset[2].fields.file.url 
    json.includes.Asset[3].fields.file.url = 'http:' + json.includes.Asset[3].fields.file.url 
    homePage.innerHTML = '';
    var templateFn = Handlebars.compile(homePageTemplate.innerHTML);
    homePage.innerHTML = templateFn(json);
    // console.log('Json dump: ',json);
    // console.log('Title text: ',json.items[0].fields.titleText);
    // console.log('image: ', 'http:' + json.includes.Asset[0].fields.file.url);
    // console.log('Lead text: ',json.items[0].fields.leadText);
}