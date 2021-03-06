var hostURL = "https://dynamic.xkcd.com/api-0/jsonp/comic/";
var timeline = document.getElementById('timeline_id');
var currentComic = 0
var activeCalls = 0;
function init(){
  startScrollListener();
  fetchNextComic();
}
init();

function startScrollListener(){
  //detects when user reaches the end
  window.addEventListener("scroll", function(){
  var contentHeight = timeline.offsetHeight;
  var yOffset = window.pageYOffset;
  var y = yOffset + window.innerHeight;
  if(y >= contentHeight && activeCalls < 3)
  {
      //load new content
      activeCalls += 1
      fetchNextComic();
  }
  })
}

function fetchNextComic(comicNumber = -1){
  if (comicNumber == -1){
    comicNumber = currentComic + 1  // if no comic is specified fetch the next one
  }
  currentComic = comicNumber
  sendAJAXReq(hostURL + comicNumber);
}

function sendAJAXReq(json_url){
  $.ajax({
    url: json_url,
    type: "GET",
    dataType: 'jsonp', // Notice! JSONP <-- P (lowercase)
    processData: true,
    data: {},
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "origin, content-type, accept"
    },
    success: function(data) {
        extractDataFromJson(data)
        activeCalls -= 1;
    },
    error: function(error){
      setTimeout(sendAJAXReq,3000,json_url)
    }
});
}

function extractDataFromJson(data){
  newComic ={}
  newComic.img = data.img
  newComic.title = data.title
  newComic.num = data.num
  addToTimeliene(newComic)
}

function addToTimeliene(comic){
  createNode(comic).appendTo(".timeline");
}

function createNode(comic){
  newComicNode = $(document.getElementById('first_comic').cloneNode(true))
  newComicNode.find(".comicURL")[0].href = "https://xkcd.com/" + comic.num
  newComicNode.find(".comicURL")[0].innerHTML = "#" + comic.num + ". " + comic.title;
  newComicNode.find(".comic_image")[0].src = comic.img
  newComicNode.find(".comic_image")[0].alt = comic.title
  return newComicNode;
}

function setcomic(){
  comicSetElem = document.getElementById('comicSet');
  _comicnumber = parseInt(comicSetElem.value);
  if ( isNaN(_comicnumber) || _comicnumber<1 || _comicnumber>9999){
    comicSetElem.value = currentComic;
  }else{
    currentComic = _comicnumber;
  }
}
