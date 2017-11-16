var hostURL = "https://dynamic.xkcd.com/api-0/jsonp/comic/";
var timeline = document.getElementById('timeline_id');
var currentComic = 0
function init(){
  startScrollListener();
  fetchNextComic(currentComic);
}
init();

function startScrollListener(){

  //detects when user reaches the end
  window.addEventListener("scroll", function(){
  var contentHeight = timeline.offsetHeight;
  var yOffset = window.pageYOffset;
  var y = yOffset + window.innerHeight;
  if(y >= contentHeight)
  {
      //load new content
      fetchNextComic(currentComic);
  }
  })
}

function fetchNextComic(comicNumber = 1){
  comicNumber +=1;
  currentComic = comicNumber
  json_url = hostURL + comicNumber;

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
  $('.materialboxed').materialbox();
}

function createNode(comic){
  newComicNode = $(document.getElementById('first_comic').cloneNode(true))
  newComicNode.find(".comicURL")[0].href = "https://xkcd.com/" + comic.num
  newComicNode.find(".comicURL")[0].innerHTML = "#" + comic.num + ". " + comic.title;
  newComicNode.find(".comic_image")[0].src = comic.img
  return newComicNode;
}
