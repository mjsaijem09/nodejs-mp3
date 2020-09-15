//----------------------------------------------- audio script -----------------------------------------------\\
var playing = false;
var currentPlayingElm;
$(".select-play").click(function(e) {
    var audio = $(this).closest('.select-play').find('.myMusic')[0];
    var imgID = $(this).closest('.select-play').find('img')[0].id;

//////////////////////////////////////////////////////////////////////////////////
    if (audio !== currentPlayingElm) {                                          //
        if (currentPlayingElm)                                                  //
        currentPlayingElm.pause();                                              //
        currentPlayingElm = audio;                                              //
        currentPlayingElm.currentTime = 0;                                      //
    }                                                                           //
// Every time the .select-play is clicked it checks if the                      //
// currentPlayingElm is the same as audio. If not, then if the                  //
// currentPlayingElm is not empty (for example when it's the first time)        //
// it stops music from it. Then the currentPlayingElm is set to audio           //
// which will play the music. and then when loading next you'll need to         //
// swap it to the next one. //////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////
    var playlist = 0;                                                           //
    var loadNext = function() {                                                 //
        playlist++;                                                             //
        let myElement = $('.myMusic')[playlist];                                //
        currentPlayingElm = myElement;                                          //
        myElement.onended = loadNext;                                           //
        myElement.play();                                                       //
    };                                                                          //
// Playlist will serve as array count of myElement. If myElement si ended       //
// playlist will increment by 1 and store it in myElement array and loop all    //
// the music. ////////////////////////////////////////////////////////////////////

var toggle_pauseStyleClass = document.getElementById(e.target.id);
    toggle_pauseStyleClass.classList.toggle("pause-style");

if(playing){
    audio.pause();
    playing = false;
    document.getElementById(imgID).src = '/img/select-play.png';
}else{
    playing = true;
    document.getElementById(imgID).src  = '/img/pause-outline.png';
}

audio.play();
audio.onended = loadNext; // If music ended fire loadNext function
});

//------------------------------------------------ Modal ------------------------------------------------\\
function openModal() {
    var element = document.getElementById("modal");
    element.classList.remove("hide-modal");
}

function cancel() {
    var element = document.getElementById("modal");
    element.classList.add("hide-modal");
}
//-------------------------------------------- Select File --------------------------------------------\\
// Add the following code if you want the name of the file appear on select
$(".custom-file-input").on("change", function() {
var fileName = $(this).val().split("\\").pop();
$(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});
//------------------------------------------- Image Preview -------------------------------------------\\
var loadFile = function(event) {
    var logo = document.getElementById('output');
    logo.src = URL.createObjectURL(event.target.files[0]);
};