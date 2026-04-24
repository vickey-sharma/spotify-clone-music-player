
let songs = []; 

let allSongs = [];
let karaokeTracks = [];

let matchedSongIndex;

let currentSong = new Audio();
let extractedSongName;
let currentSongName;
let likedSongs = [];

let fullSongPathOfLikedSong;
let findLikedSongIndex;

let seekbarPreviousBtn = document.querySelector("#previous");
let seekbarNextBtn = document.querySelector("#next");

let seekbarPlayBtn = document.querySelector("#play");


let libraryDiv = document.querySelector(".yourLibrary");
let songOrderOfyourLibrary = document.querySelectorAll("#songOrder-library");
let loopListBtnOfyourLibrary = document.querySelector("#loopListBtn-library");
let repeatBtnOfyourLibrary = document.querySelector("#repeatBtn-library");
let shuffleBtnOfyourLibrary = document.querySelector("#shuffleBtn-library");

let likedDiv = document.querySelector(".likedSongs");
let songOrderOfyourLiked = document.querySelectorAll("#songOrder-liked");
let loopListBtnOfyourLiked = document.querySelector("#loopListBtn-liked");
let repeatBtnOfyourLiked = document.querySelector("#repeatBtn-liked");
let shuffleBtnOfyourLiked = document.querySelector("#shuffleBtn-liked");

const karaokeBtn = document.querySelector(".karaokeBtn");


let isLikedNavigating = false;
let isLibraryNavigating = false;

let likeBtnCliked = false;
let libraryBtnClicked = false;

let currentDiv;

let songInfo;

let lyricsOnScreenSongName;
let currentKaraokeTrackFullPath;

//in order to update UI OF library when songmode changed
let libraryLoaded = false;

// //WILL SET LOOP LIST BY DEFAULT
//  currentSong.onended = () => {
//seekbarNextBtn.click();
//// console.log("loopList set by default")

// };


// document.addEventListener('DOMContentLoaded', (event) => {
////  loopListBtnOfyourLiked.click();
// console.log(loopListBtnOfyourLiked)

// });



document.addEventListener("DOMContentLoaded", () => {

 const homeIcon = document.querySelector(".homeIcon");
 const karaokeBtn = document.querySelector(".karaokeBtn");

 karaokeBtn.classList.add("hidden");
 getKaraokeTracksFromFolder();
 
const songInfoWithLyrics = document.getElementById("songInfoWithLyrics");
songInfoWithLyrics.classList.add("hidden");

libraryDiv.classList.add("selectedbgLiked-Library");
// likedDiv.classList.add("selectedbgLiked-Library");

 if (homeIcon) { 
  homeIcon.addEventListener("click", () => {
window.location.href = "index.html";
  });
 }
});

//CONVERTING SECONDS TO MINUTES & SECONDS
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
 return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongsFromFolder(folder) {
  // console.log(folder);
  let reslts = await fetch(`./${folder}/info.json`);
  let data = await reslts.json();
  // console.log(data); //returns data from folder

  //getting data & storing in an array
  // songs = data.songs.map((song) => {
  songs = data.songs.map((song) => `./${folder}/${song}`);
localStorage.setItem("albumSongs", JSON.stringify(songs));
  // console.log("Songs array:", songs);
shuffleSongsArray = [...songs];

getYourLibraryData();

likedImgInCurrentLibrary(songs, likedSongs);
 
}



  
  function getYourLibraryData(){
 let songUL = document
 .querySelector(".songList")
 .getElementsByTagName("ul")[0];

  let cardContainer = document.querySelector(".cardContainer");
// console.log(songUL);
  
  

songUL.innerHTML = "";
//  console.log(songUL);
  for (const song of songs) {
 // console.log(song);

 let actualSongName = song.split("/")[3].split("-")[1].replace(".mp3", "");
 // console.log(actualSongName);
 let actualArtistName = song.split("/")[3].split("-")[0];
 // console.log(actualArtistName);

 songUL.innerHTML += `  <li>
 
  <img class="invert musicLogo" src="./src/img/music.svg" alt=""></img>
 
  <div class="info">
  
 <div class="songName">${actualSongName}</div>
 <div class="artist">${actualArtistName}</div>
  </div>
  <div class="playNow">
 <img class= "invert delete hidden" src="./src/img/delete.svg" alt="">
 <img class= "invert like" src="./src/img/like.svg" alt="">
  <img class="invert playPause" src="./src/img/play.svg" alt="">
  </div>
  </li>`;

  //  console.log(songUL);
  }
// likedImgInCurrentLibrary(songs, likedSongs);

  //USING ARRAY.FROM OR SPREAD OPERATOT BOTH WORKS

songInfo = Array.from(
 document.querySelector(".songList").getElementsByTagName("li")
  ); //DECLARED GLOBALLY
  // let songInfo = [
  //...document.querySelector(".songList").getElementsByTagName("li"),
  // ];
  // console.log(songInfo)
  songInfo.forEach((song) => {
 // console.log(song)

  song.getElementsByClassName("like")[0].addEventListener("click", (e)=>{

 e.stopPropagation();
//  console.log(e);
// console.log(e.currentTarget);
// console.log(e.target);
// console.log(song);

if((e.currentTarget).classList.contains("like")){
  // console.log("it does include like");
e.currentTarget.src = "./src/img/liked.svg"
song.getElementsByClassName("invert")[1].classList.remove("like");
song.getElementsByClassName("invert")[1].classList.add("liked");
//  console.log(song);
}else{
  console.log("it does not include like");
  e.currentTarget.src = "./src/img/like.svg"
song.getElementsByClassName("invert")[1].classList.remove("liked");
song.getElementsByClassName("invert")[1].classList.add("like");
}


let storedSongName = song.querySelector(".songName").innerText;
let storedArtistName = song.querySelector(".artist").innerText;
// console.log(song);


let fullSongPath = songs[0].split("-")[0] + "- " + storedSongName + ".mp3";
// console.log(fullSongPath);

let folderPath = "./songs/" + songs[0].split("/")[2];
// console.log(folderPath);

let likedSongIndex = songs.indexOf(fullSongPath);
// console.log(likedSongIndex);


const richerSongObject = {
 fullPath: fullSongPath,  
 artistName: storedArtistName,
 songName: storedSongName, 
 folderPath:  folderPath 
};
// console.log(richerSongObject);
// console.log(likedSongs);

const isAlreadyLiked = likedSongs.some(songObj => songObj.fullPath === richerSongObject.fullPath);
// console.log(isAlreadyLiked);

if(!isAlreadyLiked){
  likedSongs.push(richerSongObject);
localStorage.setItem('likedSongsList', JSON.stringify(likedSongs));
// console.log(likedSongs);
console.log("LIKED song ADDED");
} else{
  console.log("SONG ALREADY EXIST");
}
  });


 song.addEventListener("click", (e) => {
// console.log(song);

  const songName = song.querySelector(".songName").innerText.trim();
  // console.log(songName);

const artistName = song.querySelector(".artist").innerText;
//  console.log(artistName);
  
  const extractedSongNameFrmSongs = songs.map((s) => {
 // Returns the third element (index 2) of the split string
 return s.split("-")[1].replace(".mp3", "").trim(); 
});
// console.log(extractedSongNameFrmSongs);
// console.log(songName);
const clickedSongIndex = extractedSongNameFrmSongs.indexOf(songName);
// console.log(clickedSongIndex);

const songCoverImg = songs[clickedSongIndex].split("/")[2];
// console.log(songCoverImg);
  
showSyncedLyrics(songName, artistName, songCoverImg);
//  console.log(song);

let tempSongNameFrmSong = song.querySelector(".songName").innerText;
//  console.log(tempSongNameFrmSong);
//  console.log(extractedSongName);
 extractedSongName = localStorage.getItem("lastTrack") || songs[0]; 
  // console.log(extractedSongName);

 localStorage.getItem("")
let tempExteactedSongName = extractedSongName
  .split("-")[1]
  .replace(".mp3", "")
  .trim();
 //  console.log(tempExteactedSongName);

if (tempSongNameFrmSong == tempExteactedSongName) {
  //  console.log("executed");
  let playPauseBtnOnLeft = e.currentTarget.querySelector(".playPause");

  if (currentSong.paused) {
 // If the song is paused, play it and update UI to pause icon
 // console.log("If the song is paused");
 currentSong.play();
 playPauseBtnOnLeft.src = "./src/img/pause.svg";
 seekbarPlayBtn.src = "./src/img/pause.svg";

 // Ensure GIPHY/BG is added since we are playing
 e.currentTarget.classList.remove("pausedBG");
 e.currentTarget.classList.add("playingBG");
 e.currentTarget.querySelector(".musicLogo").src =
"./src/img/playingGiphy.gif";
 e.currentTarget
.querySelector(".musicLogo")
.classList.remove("invert");
 e.currentTarget
.querySelector(".musicLogo")
.classList.add("marginRight");
  } else {
 // If the song is playing, pause it and update UI to play icon
 // console.log("If the song is playing");
 currentSong.pause();
 playPauseBtnOnLeft.src = "./src/img/play.svg";
 seekbarPlayBtn.src = "./src/img/play.svg";

 // Ensure GIPHY/BG is removed since we are paused
 e.currentTarget.classList.remove("playingBG");
 e.currentTarget.classList.add("pausedBG");
 // e.currentTarget.querySelector(".musicLogo").src = "./src/img/music.svg";
 // e.currentTarget.querySelector(".musicLogo").classList.add("invert");
 // e.currentTarget.querySelector(".musicLogo").classList.remove("marginRight");
  }

  // Stop processing if we successfully toggled the currently playing song
  return;
}

//REMOVING BG & CHANGE playPause BTN ON SONGLIST OF LEFT
songInfo.forEach((item) => {
  if (item.classList.contains("playingBG")) {
 item.classList.remove("playingBG");
 // console.log("bg removed");

 // console.log(item);
 item.querySelector(".playPause").src = "./src/img/play.svg";

 //ADDING GIPHY & REMOVING SONG ICON
 item.querySelector(".musicLogo").src = "./src/img/music.svg";
 item.querySelector(".musicLogo").classList.add("invert");
 item.querySelector(".musicLogo").classList.remove("marginRight");
  }
});

//TO ADD BG & change playPause btn in sonlist of left
if (e.currentTarget) {
  e.currentTarget.classList.add("playingBG");
  // console.log(e.currentTarget);
  //  console.log((e.currentTarget).querySelector(".playPause").src);

  // ((e.currentTarget).querySelector(".playPause")).src = "./src/img/pause.svg";

  //ADDING GIPHY & REMOVING SONG ICON
  e.currentTarget.querySelector(".musicLogo").src =
 "./src/img/playingGiphy.gif";
  e.currentTarget.querySelector(".musicLogo").classList.remove("invert");
  e.currentTarget
 .querySelector(".musicLogo")
 .classList.add("marginRight");
}

let tempSongName = song.querySelector(".songName").innerText;
let tempArtistName = song.querySelector(".artist").innerText;
// console.log(songs)
// console.log(songs[0])

// Make sure you compare exact file names, ignoring folder
let match = songs.find((song) => {
  let fileName = song.split("/").pop(); // get only the filename
  return fileName === `${tempArtistName} - ${tempSongName}.mp3`;
});

if (match) {
  extractedSongName = match;
  playMusic(extractedSongName);
  // console.log(extractedSongName);
}
 });
  });
  }




async function whenClickedOnYourLibrary() {

////WILL SET LOOP LIST BY DEFAULT
// currentSong.onended = () => {
//seekbarNextBtn.click();
//// console.log("loopList set by default")
// };

 const yourLibrary = document.querySelector(".yourLibrary");
 const liked = document.querySelector(".likedSongs");
const songOrderOfLiked =liked.querySelector(".songOrder");

// const dropDownOfyourLibrary = yourLibrary.querySelector(".dropDown");
const songOrderOfyourLibrary = yourLibrary.querySelector(".songOrder");

// console.log(songOrder);
// let dropDown = liked.querySelector(".dropDown");

 yourLibrary.addEventListener("click", ()=>{

  // getYourLibraryData();

    if (!libraryLoaded) {     
    getYourLibraryData();
    libraryLoaded = true;
  }

  likedImgInCurrentLibrary(songs, likedSongs);
  // dropDown.classList.remove("hidden");
  songOrderOfLiked.classList.add("hidden");

  //  liked.classList.remove("selected");
// yourLibrary.classList.remove("selected");

// dropDownOfyourLibrary.classList.add("hidden");
songOrderOfyourLibrary.classList.remove("hidden");


libraryDiv.classList.add("selectedbgLiked-Library");
likedDiv.classList.remove("selectedbgLiked-Library");
swapDivs(currentDiv)
 })
}

function likedImgInCurrentLibrary(songs, likedSongs){
  // console.log(songs);
  // console.log(likedSongs);

const likedPathsSet = new Set(
  likedSongs.map(song => song.fullPath)
 );

 const commonPaths = songs.filter(songPath => 
  likedPathsSet.has(songPath)
 );
// console.log(commonPaths);


commonPaths.forEach((e)=>{
  let librarySongIndex = songs.indexOf(e);
// console.log(librarySongIndex);

let songUL = document
 .querySelector(".songList")
 .getElementsByTagName("li")[librarySongIndex];
 // console.log(songUL);

  

if(songUL){
 const likeClass = songUL.getElementsByClassName("like")[0];

if(likeClass){
  likeClass.src = "./src/img/liked.svg";

 likeClass.classList.add("liked");
likeClass.classList.remove("like");

}
}
  //  console.log(songUL)

})


 return commonPaths;

}





libraryDiv.addEventListener("click", ()=>{

currentDiv = "library";
likeBtnCliked = false;



// console.log(currentDiv);

 if(libraryBtnClicked === false){
  console.log("entered default loop")
  currentSong.onended = () => {
  // console.log(songs);
  // console.log(extractedSongName);
  let tempIndex =songs.indexOf(extractedSongName);
  // console.log(tempIndex);

  if(tempIndex+1 < songs.length &&  tempIndex >= 0){

  
  let nextSongIndex = Number(tempIndex+1);
  //  console.log(nextSongIndex);
  //  console.log(songs[nextSongIndex]);

  
currentSong.src = songs[nextSongIndex];
currentSong.play();
extractedSongName = songs[nextSongIndex];

play.src = "./src/img/pause.svg";

let actualSongName = extractedSongName
  .split("/")[3]
  .split("-")[1]
  .replace(".mp3", "");
// console.log(actualSongName);
let actualArtistName = extractedSongName.split("/")[3].split("-")[0];
// console.log(actualArtistName);
  
const songCoverImg = songs[nextSongIndex].split("/")[2];
// // console.log(songCoverImg);

showSyncedLyrics(actualSongName, actualArtistName, songCoverImg);

document.querySelector(
  ".songinfo"
).innerHTML = `${actualArtistName} - ${actualSongName}`;
document.querySelector(
  ".songtime"
).innerText = `${secondsToMinutesSeconds(
  currentSong.currentTime
)}/${secondsToMinutesSeconds(currentSong.duration)}`;

//removing and changing last song
// console.log(songInfo);
songInfo.forEach((song) => {
  // console.log(song);
  if (song.classList.contains("playingBG")) {
 song.classList.remove("playingBG");
 // console.log("bg removed");

 // console.log(item);
 song.querySelector(".playPause").src = "./src/img/play.svg";

 //ADDING GIPHY & REMOVING SONG ICON
 song.querySelector(".musicLogo").src = "./src/img/music.svg";
 song.querySelector(".musicLogo").classList.add("invert");
 song.querySelector(".musicLogo").classList.remove("marginRight");
  }
});

//TO ADD BG & change playPause btn in sonlist of left
let songUL = document
  .querySelector(".songList")
  .getElementsByTagName("li")[nextSongIndex];
// console.log(songUL);

if (songUL) {
  songUL.classList.add("playingBG");
  // console.log(songUL);
  // console.log((songUL).querySelector(".playPause").src);
  songUL.querySelector(".playPause").src = "./src/img/pause.svg";

  //ADDING GIPHY & REMOVING SONG ICON
  songUL.querySelector(".musicLogo").src = "./src/img/playingGiphy.gif";
  songUL.querySelector(".musicLogo").classList.remove("invert");
  songUL.querySelector(".musicLogo").classList.add("marginRight");
  // console.log(songUL);
}

return extractedSongName;
  // seekbarNextBtn.click(); // play next song
  }else{
 
  let nextSongIndex = Number(0);
console.log(nextSongIndex);
console.log(songs[nextSongIndex]);
currentSong.src = songs[nextSongIndex];
currentSong.play();
extractedSongName = songs[nextSongIndex];

play.src = "./src/img/pause.svg";

let actualSongName = extractedSongName
  .split("/")[3]
  .split("-")[1]
  .replace(".mp3", "");
// console.log(actualSongName);
let actualArtistName = extractedSongName.split("/")[3].split("-")[0];
// console.log(actualArtistName);

const songCoverImg = songs[nextSongIndex].split("/")[2];
// // console.log(songCoverImg);

showSyncedLyrics(actualSongName, actualArtistName, songCoverImg);

document.querySelector(
  ".songinfo"
).innerHTML = `${actualArtistName} - ${actualSongName}`;
document.querySelector(
  ".songtime"
).innerText = `${secondsToMinutesSeconds(
  currentSong.currentTime
)}/${secondsToMinutesSeconds(currentSong.duration)}`;

//removing and changing last song
// console.log(songInfo);
songInfo.forEach((song) => {
  // console.log(song);
  if (song.classList.contains("playingBG")) {
 song.classList.remove("playingBG");
 // console.log("bg removed");

 // console.log(item);
 song.querySelector(".playPause").src = "./src/img/play.svg";

 //ADDING GIPHY & REMOVING SONG ICON
 song.querySelector(".musicLogo").src = "./src/img/music.svg";
 song.querySelector(".musicLogo").classList.add("invert");
 song.querySelector(".musicLogo").classList.remove("marginRight");
  }
});

//TO ADD BG & change playPause btn in sonlist of left
let songUL = document
  .querySelector(".songList")
  .getElementsByTagName("li")[nextSongIndex];
// console.log(songUL);

if (songUL) {
  songUL.classList.add("playingBG");
  // console.log(songUL);
  // console.log((songUL).querySelector(".playPause").src);
  songUL.querySelector(".playPause").src = "./src/img/pause.svg";

  //ADDING GIPHY & REMOVING SONG ICON
  songUL.querySelector(".musicLogo").src = "./src/img/playingGiphy.gif";
  songUL.querySelector(".musicLogo").classList.remove("invert");
  songUL.querySelector(".musicLogo").classList.add("marginRight");
  // console.log(songUL);
}

return extractedSongName;
  // seekbarNextBtn.click(); // play next song
  }
};

console.log(" DEFAULT LOOP LIST mode active");
// console.log(extractedSongName)
 }




 whenClickedOnYourLibrary();



 



  
//SONGORDER FNX FOR LIBRARY ONLY
songOrderOfyourLibrary.forEach((button) => {
  button.addEventListener("click", (btn) => {



 // stop any running audio and clear previous end behavior
 currentSong.onended = null; //clears previous listener

libraryBtnClicked = true;

// let tempIndex =songs.indexOf(extractedSongName);
// // console.log(tempIndex);
// // console.log(extractedSongName);


// let songUL = document
//   .querySelector(".songList")
//   .getElementsByTagName("li")[tempIndex];
// console.log(songUL);

//   if (songUL) {
//   songUL.classList.remove("playingBG");
//   console.log(songUL);
// //   // console.log((songUL).querySelector(".playPause").src);
// //   songUL.querySelector(".playPause").src = "./src/img/pause.svg";

// //   //ADDING GIPHY & REMOVING SONG ICON
// //   songUL.querySelector(".musicLogo").src = "./src/img/playingGiphy.gif";
// //   songUL.querySelector(".musicLogo").classList.remove("invert");
// //   songUL.querySelector(".musicLogo").classList.add("marginRight");
// //   // console.log(songUL);
// //   console.log("entred UL");
//  }
//  console.log(songUL);


 if (btn.target.id === "loopListBtn-library") {
loopListBtnOfyourLibrary.classList.remove("deselect");
repeatBtnOfyourLibrary.classList.add("deselect");
shuffleBtnOfyourLibrary.classList.add("deselect");


currentSong.onended = () => {
  // console.log(songs);
  // console.log(extractedSongName);
  let tempIndex =songs.indexOf(extractedSongName);
  // console.log(tempIndex);



  if(tempIndex+1 < songs.length &&  tempIndex >= 0){

  
  let nextSongIndex = Number(tempIndex+1);
  //  console.log(nextSongIndex);
  //  console.log(songs[nextSongIndex]);
currentSong.src = songs[nextSongIndex];
currentSong.play();
extractedSongName = songs[nextSongIndex];

play.src = "./src/img/pause.svg";

let actualSongName = extractedSongName
  .split("/")[3]
  .split("-")[1]
  .replace(".mp3", "");
// console.log(actualSongName);
let actualArtistName = extractedSongName.split("/")[3].split("-")[0];
// console.log(actualArtistName);




const songCoverImg = songs[nextSongIndex].split("/")[2];
// console.log(songCoverImg);
  
showSyncedLyrics(actualSongName, actualArtistName, songCoverImg);


document.querySelector(
  ".songinfo"
).innerHTML = `${actualArtistName} - ${actualSongName}`;
document.querySelector(
  ".songtime"
).innerText = `${secondsToMinutesSeconds(
  currentSong.currentTime
)}/${secondsToMinutesSeconds(currentSong.duration)}`;

//removing and changing last song
// console.log(songInfo);
songInfo.forEach((song) => {
  // console.log(song);
  if (song.classList.contains("playingBG")) {
 song.classList.remove("playingBG");
 // console.log("bg removed");

 // console.log(item);
 song.querySelector(".playPause").src = "./src/img/play.svg";

 //ADDING GIPHY & REMOVING SONG ICON
 song.querySelector(".musicLogo").src = "./src/img/music.svg";
 song.querySelector(".musicLogo").classList.add("invert");
 song.querySelector(".musicLogo").classList.remove("marginRight");
  }
});

//TO ADD BG & change playPause btn in sonlist of left
let songUL = document
  .querySelector(".songList")
  .getElementsByTagName("li")[nextSongIndex];
// console.log(songUL);

if (songUL) {
  songUL.classList.add("playingBG");
  // console.log(songUL);
  // console.log((songUL).querySelector(".playPause").src);
  songUL.querySelector(".playPause").src = "./src/img/pause.svg";

  //ADDING GIPHY & REMOVING SONG ICON
  songUL.querySelector(".musicLogo").src = "./src/img/playingGiphy.gif";
  songUL.querySelector(".musicLogo").classList.remove("invert");
  songUL.querySelector(".musicLogo").classList.add("marginRight");
  // console.log(songUL);
}

return extractedSongName;
  // seekbarNextBtn.click(); // play next song
  }else{
 
  let nextSongIndex = Number(0);
console.log(nextSongIndex);
console.log(songs[nextSongIndex]);
currentSong.src = songs[nextSongIndex];
currentSong.play();
extractedSongName = songs[nextSongIndex];

play.src = "./src/img/pause.svg";

let actualSongName = extractedSongName
  .split("/")[3]
  .split("-")[1]
  .replace(".mp3", "");
// console.log(actualSongName);
let actualArtistName = extractedSongName.split("/")[3].split("-")[0];
// console.log(actualArtistName);


const songCoverImg = songs[nextSongIndex].split("/")[2];
// console.log(songCoverImg);
  
showSyncedLyrics(actualSongName, actualArtistName, songCoverImg);

document.querySelector(
  ".songinfo"
).innerHTML = `${actualArtistName} - ${actualSongName}`;
document.querySelector(
  ".songtime"
).innerText = `${secondsToMinutesSeconds(
  currentSong.currentTime
)}/${secondsToMinutesSeconds(currentSong.duration)}`;

//removing and changing last song
// console.log(songInfo);
songInfo.forEach((song) => {
  // console.log(song);
  if (song.classList.contains("playingBG")) {
 song.classList.remove("playingBG");
 // console.log("bg removed");

 // console.log(item);
 song.querySelector(".playPause").src = "./src/img/play.svg";

 //ADDING GIPHY & REMOVING SONG ICON
 song.querySelector(".musicLogo").src = "./src/img/music.svg";
 song.querySelector(".musicLogo").classList.add("invert");
 song.querySelector(".musicLogo").classList.remove("marginRight");
  }
});

//TO ADD BG & change playPause btn in sonlist of left
let songUL = document
  .querySelector(".songList")
  .getElementsByTagName("li")[nextSongIndex];
// console.log(songUL);

if (songUL) {
  songUL.classList.add("playingBG");
  // console.log(songUL);
  // console.log((songUL).querySelector(".playPause").src);
  songUL.querySelector(".playPause").src = "./src/img/pause.svg";

  //ADDING GIPHY & REMOVING SONG ICON
  songUL.querySelector(".musicLogo").src = "./src/img/playingGiphy.gif";
  songUL.querySelector(".musicLogo").classList.remove("invert");
  songUL.querySelector(".musicLogo").classList.add("marginRight");
  // console.log(songUL);
}

return extractedSongName;
  // seekbarNextBtn.click(); // play next song
  }
};

console.log("LOOP LIST mode active");
 }

 else if (btn.target.id === "repeatBtn-library") {
repeatBtnOfyourLibrary.classList.remove("deselect");
loopListBtnOfyourLibrary.classList.add("deselect");
shuffleBtnOfyourLibrary.classList.add("deselect");
 

  
  
  let repeatedIndex = songs.indexOf(extractedSongName)
//console.log(extractedSongName);
// console.log(songs.indexOf(extractedSongName));

  let actualSongName = (songs[repeatedIndex])
  .split("/")[3]
  .split("-")[1]
  .replace(".mp3", "");
// console.log(actualSongName);
let actualArtistName = (songs[repeatedIndex]).split("/")[3].split("-")[0];
// console.log(actualArtistName);

const songCoverImg = songs[repeatedIndex].split("/")[2];
// console.log(songCoverImg);
  
showSyncedLyrics(actualSongName, actualArtistName, songCoverImg);

 //TO ADD BG & change playPause btn in sonlist of left
let songUL = document
  .querySelector(".songList")
  .getElementsByTagName("li")[repeatedIndex];
console.log(songUL);

if (songUL) {
  songUL.classList.add("playingBG");
  // console.log(songUL);
  // console.log((songUL).querySelector(".playPause").src);
  songUL.querySelector(".playPause").src = "./src/img/pause.svg";

  //ADDING GIPHY & REMOVING SONG ICON
  songUL.querySelector(".musicLogo").src = "./src/img/playingGiphy.gif";
  songUL.querySelector(".musicLogo").classList.remove("invert");
  songUL.querySelector(".musicLogo").classList.add("marginRight");
  // console.log(songUL);
}

  

currentSong.onended = () => {
  currentSong.currentTime = 0;
  currentSong.play(); // repeat same song
 
};

console.log("REPEAT mode active");
 }

 else if (btn.target.id === "shuffleBtn-library") {
shuffleBtnOfyourLibrary.classList.remove("deselect");
loopListBtnOfyourLibrary.classList.add("deselect");
repeatBtnOfyourLibrary.classList.add("deselect");
 


currentSong.onended = () => {
  const randomIndex = Math.floor(Math.random() * songs.length);
  console.log(randomIndex)
console.log(`current song is shuffle mode is${songs[randomIndex]}`)
  currentSong.src = songs[randomIndex];
  currentSong.play();

  play.src = "./src/img/pause.svg";

  // console.log(songs[randomIndex]);
let actualSongName = (songs[randomIndex])
  .split("/")[3]
  .split("-")[1]
  .replace(".mp3", "");
// console.log(actualSongName);
let actualArtistName = (songs[randomIndex]).split("/")[3].split("-")[0];
// console.log(actualArtistName);


const songCoverImg = songs[randomIndex].split("/")[2];
// console.log(songCoverImg);
  
showSyncedLyrics(actualSongName, actualArtistName, songCoverImg);


  
document.querySelector(
  ".songinfo"
).innerHTML = `${actualArtistName} - ${actualSongName}`;
document.querySelector(
  ".songtime"
).innerText = `${secondsToMinutesSeconds(
  currentSong.currentTime
)}/${secondsToMinutesSeconds(currentSong.duration)}`;

//removing and changing last song
// console.log(songInfo);
songInfo.forEach((song) => {
  // console.log(song);
  if (song.classList.contains("playingBG")) {
 song.classList.remove("playingBG");
 // console.log("bg removed");

 // console.log(item);
 song.querySelector(".playPause").src = "./src/img/play.svg";

 //ADDING GIPHY & REMOVING SONG ICON
 song.querySelector(".musicLogo").src = "./src/img/music.svg";
 song.querySelector(".musicLogo").classList.add("invert");
 song.querySelector(".musicLogo").classList.remove("marginRight");
  }
});

//TO ADD BG & change playPause btn in sonlist of left
let songUL = document
  .querySelector(".songList")
  .getElementsByTagName("li")[randomIndex];
// console.log(songUL);

if (songUL) {
  songUL.classList.add("playingBG");
  // console.log(songUL);
  // console.log((songUL).querySelector(".playPause").src);
  songUL.querySelector(".playPause").src = "./src/img/pause.svg";

  //ADDING GIPHY & REMOVING SONG ICON
  songUL.querySelector(".musicLogo").src = "./src/img/playingGiphy.gif";
  songUL.querySelector(".musicLogo").classList.remove("invert");
  songUL.querySelector(".musicLogo").classList.add("marginRight");
  // console.log(songUL);
}
};

console.log("SHUFFLE mode active");
 }
  });
});
return currentDiv;
});





async function getLikedSongsData() {
  

 //OPENING LIKED SONGS
const liked = document.querySelector(".likedSongs");

const yourLibrary = document.querySelector(".yourLibrary")

let songOrderOfLiked =liked.querySelector(".songOrder");
// console.log(songOrder);
// let dropDown = liked.querySelector(".dropDown");

liked.addEventListener("click", ()=>{

  if(songOrderOfLiked.classList.contains("hidden")){

let songUL = document.querySelector(".songList ul");

// console.log(songUL);
  songUL.innerHTML = "";
  // console.log(songUL);
  

  // console.log("classlist hidden is in songOrder");
  // dropDown.classList.add("hidden");
  songOrderOfLiked.classList.remove("hidden");
  
  // liked.classList.add("selected")
  

// HIDING YOUR LIBRARY DATA
// yourLibrary.classList.remove("selected");
// yourLibrary.querySelector(".dropDown").classList.remove("hidden");
yourLibrary.querySelector(".songOrder").classList.add("hidden");



likedDiv.classList.add("selectedbgLiked-Library");
libraryDiv.classList.remove("selectedbgLiked-Library");
swapDivs(currentDiv);

// console.log(liked);
// console.log(yourLibrary);


 
for(let song of likedSongs ){
  // console.log(song.songName);
  //  console.log(song.artistName);


let songName = song.songName;
let artistName = song.artistName;
//  console.log(songName);
//  console.log(artistName);


 

songUL.innerHTML += `  <li>
 
  <img class="invert musicLogo" src="./src/img/music.svg" alt=""></img>
 
  <div class="info">
  
 <div class="songName">${songName}</div>
 <div class="artist">${artistName}</div>
  </div>
  <div class="playNow">
 <img class= "invert delete" src="./src/img/delete.svg" alt="">
 <img class= "invert liked" src="./src/img/liked.svg" alt="">
  <img class="invert playPause" src="./src/img/play.svg" alt="">
  </div>
  </li>`;
}

// console.log(songUL);

songUL = Array.from(
 document.querySelector(".songList").getElementsByTagName("li")
  ); //DECLARED GLOBALLY
  // let songInfo = [
  //...document.querySelector(".songList").getElementsByTagName("li"),
  // ];
  // console.log(songInfo)
  songUL.forEach((song) => {
 // console.log(song);


 song.addEventListener("click", ()=>{
const songName =  song.querySelector(".songName").innerText;
const artistName =  song.querySelector(".artist").innerText;
  // console.log(artistName);
  // console.log(likedSongs[0]);

findLikedSongIndex = likedSongs.findIndex(object=> object.songName === songName);
// console.log(findLikedSongIndex);
// console.log(likedSongs);
// console.log(likedSongs[findLikedSongIndex].artistName);


const songCoverImg = (likedSongs[findLikedSongIndex].fullPath).split("/")[2].trim();
// console.log(songCoverImg);
  
showSyncedLyrics(songName, artistName, songCoverImg);

fullSongPathOfLikedSong = likedSongs[findLikedSongIndex].fullPath;
// console.log(fullSongPathOfLikedSong);

currentSong.src = fullSongPathOfLikedSong;
// console.log(currentSong.src);


// const songCoverImg = songs[randomIndex].split("/")[2];
// // console.log(songCoverImg);
  
// showSyncedLyrics(actualSongName, actualArtistName, songCoverImg);


currentSong.play();
  play.src = "./src/img/pause.svg";

document.querySelector(
 ".songinfo"
      ).innerHTML = `${likedSongs[findLikedSongIndex].artistName} - ${likedSongs[findLikedSongIndex].songName}`;


//  if(songUL.classList.contains("playingBG")){
//console("it does")
//  };
let updatePrevSongUI = Array.from(
 document.querySelector(".songList").getElementsByTagName("li")
  );
  updatePrevSongUI.forEach((prevSong)=>{

  
  if (prevSong.classList.contains("playingBG")) {
 //  console.log(song);
 prevSong.classList.remove("playingBG");
 // console.log("bg removed");

 // console.log(item);
 prevSong.querySelector(".playPause").src = "./src/img/play.svg";

 //ADDING GIPHY & REMOVING SONG ICON
prevSong.querySelector(".musicLogo").src = "./src/img/music.svg";
prevSong.querySelector(".musicLogo").classList.add("invert");
 prevSong.querySelector(".musicLogo").classList.remove("marginRight");
  }
})


//TO ADD BG & change playPause btn in sonlist of left
let songUL = document
  .querySelector(".songList")
  .getElementsByTagName("li")[findLikedSongIndex];
// console.log(songUL);

if (songUL) {
  songUL.classList.add("playingBG");
  // console.log(songUL);
  // console.log((songUL).querySelector(".playPause").src);
  songUL.querySelector(".playPause").src = "./src/img/pause.svg";

  //ADDING GIPHY & REMOVING SONG ICON
  songUL.querySelector(".musicLogo").src = "./src/img/playingGiphy.gif";
  songUL.querySelector(".musicLogo").classList.remove("invert");
  songUL.querySelector(".musicLogo").classList.add("marginRight");
  // console.log(songUL);
}


 })
  })

  let deleteLikedBtn = Array.from(
 document.querySelector(".songList").getElementsByClassName("delete"));
 // console.log(deleteLikedBtn);

 deleteLikedBtn.forEach((del)=>{
del.addEventListener("click", (e)=>{
 
  // console.log(e.target.closest('li'));
  console.log(likedSongs);

  let songToBeDeleted = (e.target.closest('li')).getElementsByClassName("songName")[0].innerText;
  // console.log(songToBeDeleted);



  let deletingSongIndex = likedSongs.findIndex((songObject) => {
 // We return true when the object's property matches the text from the DOM
            return songObject.songName === songToBeDeleted;
});
console.log(deletingSongIndex);

if (deletingSongIndex !== -1) {
// Remove 1 element starting at the found index
likedSongs.splice(deletingSongIndex, 1);

// Remove the <li> from the HTML
e.target.closest('li').remove();
localStorage.setItem('likedSongsList', JSON.stringify(likedSongs));
console.log("Song deleted successfully!");
  }
 //  console.log(likedSongs);
 
})
 })

}  
})


}


likedDiv.addEventListener("click", ()=>{

libraryDiv.classList.remove(".selectedbgLiked-Library");
likedDiv.classList.add(".selectedbgLiked-Library");
 


  currentDiv = "liked";
  libraryBtnClicked =false;
  libraryLoaded = false;

  // console.log(currentDiv);

getLikedSongsData();


if(likeBtnCliked === false){
  currentSong.onended = () => {
// console.log(findLikedSongIndex);
  if(findLikedSongIndex < ((likedSongs.length)-1) && findLikedSongIndex >= 0 ){
  
//  console.log("entered if");



  findLikedSongIndex = Number(findLikedSongIndex+1);
 fullSongPathOfLikedSong = likedSongs[findLikedSongIndex].fullPath;
 // console.log(findLikedSongIndex);
 // console.log(fullSongPathOfLikedSong);
 


 const songCoverImg = (likedSongs[findLikedSongIndex].fullPath).split("/")[2].trim();
const artistName = likedSongs[findLikedSongIndex].artistName;
const songName = likedSongs[findLikedSongIndex].songName;
// console.log(songCoverImg);
// console.log(artistName);
// console.log(songName);
  
showSyncedLyrics(songName, artistName, songCoverImg);


  currentSong.src = fullSongPathOfLikedSong
  currentSong.play();
  // seekbarNextBtn.click(); // play next song
  
  document.querySelector(
 ".songinfo"
      ).innerHTML = `${likedSongs[findLikedSongIndex].artistName} - ${likedSongs[findLikedSongIndex].songName}`;


//  if(songUL.classList.contains("playingBG")){
//console("it does")
//  };
let updatePrevSongUI = Array.from(
 document.querySelector(".songList").getElementsByTagName("li")
  );
  updatePrevSongUI.forEach((prevSong)=>{

  
  if (prevSong.classList.contains("playingBG")) {
 //  console.log(song);
 prevSong.classList.remove("playingBG");
 // console.log("bg removed");

 // console.log(item);
 prevSong.querySelector(".playPause").src = "./src/img/play.svg";

 //ADDING GIPHY & REMOVING SONG ICON
prevSong.querySelector(".musicLogo").src = "./src/img/music.svg";
prevSong.querySelector(".musicLogo").classList.add("invert");
 prevSong.querySelector(".musicLogo").classList.remove("marginRight");
  }
})


//TO ADD BG & change playPause btn in sonlist of left
let songUL = document
  .querySelector(".songList")
  .getElementsByTagName("li")[findLikedSongIndex];
// console.log(songUL);

if (songUL) {
  songUL.classList.add("playingBG");
  // console.log(songUL);
  // console.log((songUL).querySelector(".playPause").src);
  songUL.querySelector(".playPause").src = "./src/img/pause.svg";

  //ADDING GIPHY & REMOVING SONG ICON
  songUL.querySelector(".musicLogo").src = "./src/img/playingGiphy.gif";
  songUL.querySelector(".musicLogo").classList.remove("invert");
  songUL.querySelector(".musicLogo").classList.add("marginRight");
  // console.log(songUL);
}

  }
  else{
 
  // console.log("entered else");
 



 findLikedSongIndex = 0;
 fullSongPathOfLikedSong = likedSongs[findLikedSongIndex].fullPath
 // console.log(findLikedSongIndex);
 // console.log(fullSongPathOfLikedSong)


  const songCoverImg = (likedSongs[findLikedSongIndex].fullPath).split("/")[2].trim();
const artistName = likedSongs[findLikedSongIndex].artistName;
const songName = likedSongs[findLikedSongIndex].songName;
// console.log(songCoverImg);
// console.log(artistName);
// console.log(songName);
  
showSyncedLyrics(songName, artistName, songCoverImg);


  currentSong.src = fullSongPathOfLikedSong
currentSong.play();
  // seekbarNextBtn.click(); // play next song

  document.querySelector(
 ".songinfo"
      ).innerHTML = `${likedSongs[findLikedSongIndex].artistName} - ${likedSongs[findLikedSongIndex].songName}`;


//  if(songUL.classList.contains("playingBG")){
//console("it does")
//  };
let updatePrevSongUI = Array.from(
 document.querySelector(".songList").getElementsByTagName("li")
  );
  updatePrevSongUI.forEach((prevSong)=>{

  
  if (prevSong.classList.contains("playingBG")) {
 //  console.log(song);
 prevSong.classList.remove("playingBG");
 // console.log("bg removed");

 // console.log(item);
 prevSong.querySelector(".playPause").src = "./src/img/play.svg";

 //ADDING GIPHY & REMOVING SONG ICON
prevSong.querySelector(".musicLogo").src = "./src/img/music.svg";
prevSong.querySelector(".musicLogo").classList.add("invert");
 prevSong.querySelector(".musicLogo").classList.remove("marginRight");
  }
})


//TO ADD BG & change playPause btn in sonlist of left
let songUL = document
  .querySelector(".songList")
  .getElementsByTagName("li")[findLikedSongIndex];
// console.log(songUL);

if (songUL) {
  songUL.classList.add("playingBG");
  // console.log(songUL);
  // console.log((songUL).querySelector(".playPause").src);
  songUL.querySelector(".playPause").src = "./src/img/pause.svg";

  //ADDING GIPHY & REMOVING SONG ICON
  songUL.querySelector(".musicLogo").src = "./src/img/playingGiphy.gif";
  songUL.querySelector(".musicLogo").classList.remove("invert");
  songUL.querySelector(".musicLogo").classList.add("marginRight");
  // console.log(songUL);
}
  
  }
 console.log("Default LOOP LIST mode active");
}
}

  



//SONGORDER FNX FOR LIKED ONLY
songOrderOfyourLiked.forEach((button) => {
  button.addEventListener("click", (btn) => {
 // stop any running audio and clear previous end behavior
 currentSong.onended = null; //clears previous listener

 likeBtnCliked = true;

  //console.log(fullSongPathOfLikedSong);
  //  console.log(findLikedSongIndex);
  //console.log(likedSongs.length);
  // console.log((likedSongs.length)-1);

 if (btn.target.id === "loopListBtn-liked") {
loopListBtnOfyourLiked.classList.remove("deselect");
repeatBtnOfyourLiked.classList.add("deselect");
shuffleBtnOfyourLiked.classList.add("deselect");


currentSong.onended = () => {

  if(findLikedSongIndex < ((likedSongs.length)-1) && findLikedSongIndex >= 0 ){
  
//  console.log("entered if");



  findLikedSongIndex = Number(findLikedSongIndex+1);
 fullSongPathOfLikedSong = likedSongs[findLikedSongIndex].fullPath;
 // console.log(findLikedSongIndex);
 // console.log(fullSongPathOfLikedSong);
 

  const songCoverImg = (likedSongs[findLikedSongIndex].fullPath).split("/")[2].trim();
const artistName = likedSongs[findLikedSongIndex].artistName;
const songName = likedSongs[findLikedSongIndex].songName;
// console.log(songCoverImg);
// console.log(artistName);
// console.log(songName);
  
showSyncedLyrics(songName, artistName, songCoverImg);


  currentSong.src = fullSongPathOfLikedSong
  currentSong.play();
  // seekbarNextBtn.click(); // play next song
  
  document.querySelector(
 ".songinfo"
      ).innerHTML = `${likedSongs[findLikedSongIndex].artistName} - ${likedSongs[findLikedSongIndex].songName}`;


//  if(songUL.classList.contains("playingBG")){
//console("it does")
//  };
let updatePrevSongUI = Array.from(
 document.querySelector(".songList").getElementsByTagName("li")
  );
  updatePrevSongUI.forEach((prevSong)=>{

  
  if (prevSong.classList.contains("playingBG")) {
 //  console.log(song);
 prevSong.classList.remove("playingBG");
 // console.log("bg removed");

 // console.log(item);
 prevSong.querySelector(".playPause").src = "./src/img/play.svg";

 //ADDING GIPHY & REMOVING SONG ICON
prevSong.querySelector(".musicLogo").src = "./src/img/music.svg";
prevSong.querySelector(".musicLogo").classList.add("invert");
 prevSong.querySelector(".musicLogo").classList.remove("marginRight");
  }
})


//TO ADD BG & change playPause btn in sonlist of left
let songUL = document
  .querySelector(".songList")
  .getElementsByTagName("li")[findLikedSongIndex];
// console.log(songUL);

if (songUL) {
  songUL.classList.add("playingBG");
  // console.log(songUL);
  // console.log((songUL).querySelector(".playPause").src);
  songUL.querySelector(".playPause").src = "./src/img/pause.svg";

  //ADDING GIPHY & REMOVING SONG ICON
  songUL.querySelector(".musicLogo").src = "./src/img/playingGiphy.gif";
  songUL.querySelector(".musicLogo").classList.remove("invert");
  songUL.querySelector(".musicLogo").classList.add("marginRight");
  // console.log(songUL);
}

  }
  else{
 
  // console.log("entered else");
 



 findLikedSongIndex = 0;
 fullSongPathOfLikedSong = likedSongs[findLikedSongIndex].fullPath
 // console.log(findLikedSongIndex);
 // console.log(fullSongPathOfLikedSong)


  const songCoverImg = (likedSongs[findLikedSongIndex].fullPath).split("/")[2].trim();
const artistName = likedSongs[findLikedSongIndex].artistName;
const songName = likedSongs[findLikedSongIndex].songName;
// console.log(songCoverImg);
// console.log(artistName);
// console.log(songName);
  
showSyncedLyrics(songName, artistName, songCoverImg);


  currentSong.src = fullSongPathOfLikedSong
currentSong.play();
  // seekbarNextBtn.click(); // play next song
  document.querySelector(
 ".songinfo"
      ).innerHTML = `${likedSongs[findLikedSongIndex].artistName} - ${likedSongs[findLikedSongIndex].songName}`;


//  if(songUL.classList.contains("playingBG")){
//console("it does")
//  };
let updatePrevSongUI = Array.from(
 document.querySelector(".songList").getElementsByTagName("li")
  );
  updatePrevSongUI.forEach((prevSong)=>{

  
  if (prevSong.classList.contains("playingBG")) {
 //  console.log(song);
 prevSong.classList.remove("playingBG");
 // console.log("bg removed");

 // console.log(item);
 prevSong.querySelector(".playPause").src = "./src/img/play.svg";

 //ADDING GIPHY & REMOVING SONG ICON
prevSong.querySelector(".musicLogo").src = "./src/img/music.svg";
prevSong.querySelector(".musicLogo").classList.add("invert");
 prevSong.querySelector(".musicLogo").classList.remove("marginRight");
  }
})


//TO ADD BG & change playPause btn in sonlist of left
let songUL = document
  .querySelector(".songList")
  .getElementsByTagName("li")[findLikedSongIndex];
// console.log(songUL);

if (songUL) {
  songUL.classList.add("playingBG");
  // console.log(songUL);
  // console.log((songUL).querySelector(".playPause").src);
  songUL.querySelector(".playPause").src = "./src/img/pause.svg";

  //ADDING GIPHY & REMOVING SONG ICON
  songUL.querySelector(".musicLogo").src = "./src/img/playingGiphy.gif";
  songUL.querySelector(".musicLogo").classList.remove("invert");
  songUL.querySelector(".musicLogo").classList.add("marginRight");
  // console.log(songUL);
}
  
  }

}  

console.log("LOOP LIST mode active");
 }

 else if (btn.target.id === "repeatBtn-liked") {
repeatBtnOfyourLiked.classList.remove("deselect");
loopListBtnOfyourLiked.classList.add("deselect");
shuffleBtnOfyourLiked.classList.add("deselect");

currentSong.onended = () => {

const songCoverImg = (likedSongs[findLikedSongIndex].fullPath).split("/")[2].trim();
const artistName = likedSongs[findLikedSongIndex].artistName;
const songName = likedSongs[findLikedSongIndex].songName;
// console.log(songCoverImg);
// console.log(artistName);
// console.log(songName);
  
showSyncedLyrics(songName, artistName, songCoverImg);

  currentSong.currentTime = 0;
  currentSong.play(); // repeat same song
};

console.log("REPEAT mode active");
 }

 else if (btn.target.id === "shuffleBtn-liked") {
shuffleBtnOfyourLiked.classList.remove("deselect");
loopListBtnOfyourLiked.classList.add("deselect");
repeatBtnOfyourLiked.classList.add("deselect");
 
currentSong.onended = () => {
  const randomIndex = Math.floor(Math.random() * likedSongs.length);
  // console.log(randomIndex)
  //  console.log(`current song is shuffle mode is${songs[randomIndex]}`)
  // console.log(likedSongs[randomIndex].fullPath);

const songCoverImg = (likedSongs[randomIndex].fullPath).split("/")[2].trim();
const artistName = likedSongs[randomIndex].artistName;
const songName = likedSongs[randomIndex].songName;
// console.log(songCoverImg);
// console.log(artistName);
// console.log(songName);
  
showSyncedLyrics(songName, artistName, songCoverImg);


  currentSong.src = likedSongs[randomIndex].fullPath;
  currentSong.play();

  play.src = "./src/img/pause.svg";

  // console.log(likedSongs[randomIndex]);
let actualSongName = (likedSongs[randomIndex].songName);
console.log(actualSongName);
let actualArtistName = (likedSongs[randomIndex].artistName)
console.log(actualArtistName);


  
document.querySelector(
  ".songinfo"
).innerHTML = `${actualArtistName} - ${actualSongName}`;
document.querySelector(
  ".songtime"
).innerText = `${secondsToMinutesSeconds(
  currentSong.currentTime
)}/${secondsToMinutesSeconds(currentSong.duration)}`;

  document.querySelector(
 ".songinfo"
      ).innerHTML = `${likedSongs[randomIndex].artistName} - ${likedSongs[randomIndex].songName}`;



let updatePrevSongUI = Array.from(
 document.querySelector(".songList").getElementsByTagName("li")
  );
  updatePrevSongUI.forEach((prevSong)=>{

  
  if (prevSong.classList.contains("playingBG")) {
 //  console.log(song);
 prevSong.classList.remove("playingBG");
 // console.log("bg removed");

 // console.log(item);
 prevSong.querySelector(".playPause").src = "./src/img/play.svg";

 //ADDING GIPHY & REMOVING SONG ICON
prevSong.querySelector(".musicLogo").src = "./src/img/music.svg";
prevSong.querySelector(".musicLogo").classList.add("invert");
 prevSong.querySelector(".musicLogo").classList.remove("marginRight");
  }
})


//TO ADD BG & change playPause btn in sonlist of left
let songUL = document
  .querySelector(".songList")
  .getElementsByTagName("li")[randomIndex];
// console.log(songUL);

if (songUL) {
  songUL.classList.add("playingBG");
  // console.log(songUL);
  // console.log((songUL).querySelector(".playPause").src);
  songUL.querySelector(".playPause").src = "./src/img/pause.svg";

  //ADDING GIPHY & REMOVING SONG ICON
  songUL.querySelector(".musicLogo").src = "./src/img/playingGiphy.gif";
  songUL.querySelector(".musicLogo").classList.remove("invert");
  songUL.querySelector(".musicLogo").classList.add("marginRight");
  // console.log(songUL);
}
};

console.log("SHUFFLE mode active");
 }
  });
});
return currentDiv;
})



function swapDivs(currentDiv) {
  const libraryLiked = document.getElementsByClassName("library-liked")[0];
 if (currentDiv === "library") {
  // Current: [Library, Liked]. Goal: [Liked, Library]
  // Move 'likedDiv' before 'libraryDiv'.
  libraryLiked.insertBefore(likedDiv, libraryDiv);
  console.log("Swapped to: Liked, Library");
 } else if(currentDiv === "liked") {
  // Current: [Liked, Library]. Goal: [Library, Liked]
  // Move 'libraryDiv' before 'likedDiv'.
  libraryLiked.insertBefore(libraryDiv, likedDiv);
  console.log("Swapped to: Library, Liked");
 }
}

//PLAYING SONG BY INDEX
function playSongByIndex(index) {
  if (index >= 0 && index < songs.length) {
 
 currentSong.src = songs[index];
 // console.log(songs[index]);
 console.log(`Playing: ${songs[index]}`);
 return currentSong;
  } else {
 console.log("Invalid Index");
  }
}

async function playMusic(track, pause = false) {
  // console.log(track);
  //  console.log(songs);

  localStorage.setItem("lastTrack", track);

  const songIndex = songs.findIndex((song) => {
 return song === track;
  });

  // console.log(songIndex);

  if (songIndex < songs.length && songIndex >= 0) {

 // currentSong.src = songs[songIndex];
 // currentSong.play();
 // // console.log(track);
 // seekbarPlayBtn.src = "./src/img/pause.svg";
 // play.src = "./src/img/pause.svg";


 currentSong.src = songs[songIndex];


// Only play if pause is false--SONG WONT START PLAYING AUTOMATICALLY
if (!pause) {
  currentSong.play();
  seekbarPlayBtn.src = "./src/img/pause.svg";
  play.src = "./src/img/pause.svg";
} else {
  // paused by default
  seekbarPlayBtn.src = "./src/img/play.svg";
  play.src = "./src/img/play.svg";
}


 let actualSongName = track.split("/")[3].split("-")[1].replace(".mp3", "");
 // console.log(actualSongName);
 let actualArtistName = track.split("/")[3].split("-")[0];
 // console.log(actualArtistName);

 document.querySelector(
".songinfo"
 ).innerHTML = `${actualArtistName} - ${actualSongName}`;
 document.querySelector(".songtime").innerText = `${secondsToMinutesSeconds(
currentSong.currentTime
 )}/${secondsToMinutesSeconds(currentSong.duration)}`;

 //removing and changing last song
 // console.log(songInfo);
 
 songInfo.forEach((song) => {
// console.log(song);
if (song.classList.contains("playingBG")) {
  song.classList.remove("playingBG");
  // console.log("bg removed");

  // console.log(item);
  song.querySelector(".playPause").src = "./src/img/play.svg";

  //ADDING GIPHY & REMOVING SONG ICON
  song.querySelector(".musicLogo").src = "./src/img/music.svg";
  song.querySelector(".musicLogo").classList.add("invert");
  song.querySelector(".musicLogo").classList.remove("marginRight");
}
 });

 //TO ADD BG & change playPause btn in sonlist of left
 let songUL = document.querySelector(".songList").getElementsByTagName("li")[
songIndex
 ];
 // console.log(songUL);

 if (songUL) {
songUL.classList.add("playingBG");
// console.log(songUL);
// console.log((songUL).querySelector(".playPause").src);
songUL.querySelector(".playPause").src = "./src/img/pause.svg";

//ADDING GIPHY & REMOVING SONG ICON
songUL.querySelector(".musicLogo").src = "./src/img/playingGiphy.gif";
songUL.querySelector(".musicLogo").classList.remove("invert");
songUL.querySelector(".musicLogo").classList.add("marginRight");
// console.log(songUL);
 }
  } else {
 console.log("Song not found");
  }
}





async function getAlbums() {
  //getting all the song folder for updating cover
  let songAlbum = Array.from(document.getElementsByClassName("card"));
  songAlbum.forEach((e) => {
 // console.log(e);
 e.addEventListener("click", async (item) => {
// console.log("album clicked");
// console.log(item.currentTarget)

//REMOVING BG FROM OLD ALBUM
songAlbum.forEach((card) => {
  if (card.classList.contains("playingBG")) {
 card.classList.remove("playingBG");

 // console.log(card).querySelector("..songPlayingGIF");
 card.querySelector(".songPlayingGIF").classList.add("hidden");
  }
});

//ADDING BG TO PLAYING ALBUM
if (item) {
  item.currentTarget.classList.add("playingBG");
  // console.log("bg added");

  item.currentTarget
 .querySelector(".songPlayingGIF")
 .classList.remove("hidden");
  //  console.log(item.currentTarget.querySelector(".songPlayingGIF"));
}

let albumName = item.currentTarget.dataset.folder;
// console.log(albumName);
let albumPath = `songs/${albumName}`;
console.log(albumPath);
localStorage.setItem("lastPlayedAlbumPath", albumPath);
await getSongsFromFolder(`${albumPath}`);
// console.log(songs);
getSongsList(albumPath);
// return songs;
 });
  });
}
getAlbums();







async function getSongsList(albumPath) {
  // console.log(albumPath);
// getLikedSongs();

  extractedSongName = localStorage.getItem("lastTrack") || songs[0]; 
  // console.log(extractedSongName);
  playMusic(extractedSongName, true);

  likedSongs = JSON.parse(localStorage.getItem('likedSongsList') || '[]')

  songs = JSON.parse(localStorage.getItem("albumSongs")) || [];
  // console.log(songs);

  await getAlbums();
  

  // TO PLAY AUDIO
  // let audio = playSongByIndex(2);
  //  audio.play();

  //TO KNOW DURARION
  // audio.addEventListener("loadeddata", () => {
  //let duration = audio.duration;
  //// console.log(duration);
  // });

 

  // PLAY BTN SEEKBAR
  seekbarPlayBtn.addEventListener("click", () => {
 if (currentSong.paused) {
let songIndex = songs.indexOf(extractedSongName);
// console.log(songIndex);

currentSong.play();
play.src = "./src/img/pause.svg";
// song.classList.add("playingBG");
//song.classList.remove("pausedBG");

//TO ADD BG & change playPause btn in sonlist of left
let songUL = document
  .querySelector(".songList")
  .getElementsByTagName("li")[songIndex];
// console.log(songUL);

if (songUL) {
  songUL.classList.add("playingBG");

  songUL.classList.add("playingBG");
  songUL.classList.remove("pausedBG");
  // console.log(songUL);
  // console.log((songUL).querySelector(".playPause").src);
  songUL.querySelector(".playPause").src = "./src/img/pause.svg";

  //ADDING GIPHY & REMOVING SONG ICON
  songUL.querySelector(".musicLogo").src = "./src/img/playingGiphy.gif";
  songUL.querySelector(".musicLogo").classList.remove("invert");
  songUL.querySelector(".musicLogo").classList.add("marginRight");
  // console.log(songUL);
}

extractedSongName = songs[songIndex];
// console.log(extractedSongName);
return extractedSongName
 } else {
let songIndex = songs.indexOf(extractedSongName);
currentSong.pause();
play.src = "./src/img/play.svg";

//removing and changing last song
// console.log(songInfo);
songInfo.forEach((song) => {
  // console.log(song);
  if (song.classList.contains("playingBG")) {
 song.classList.remove("playingBG");
 song.classList.add("pausedBG");
 // console.log("bg removed");

 // console.log(item);
 song.querySelector(".playPause").src = "./src/img/play.svg";

 //ADDING GIPHY & REMOVING SONG ICON
 // song.querySelector(".musicLogo").src = "./src/img/music.svg";
 // song.querySelector(".musicLogo").classList.add("invert");
 // song.querySelector(".musicLogo").classList.remove("marginRight");
  }
});
 extractedSongName = songs[songIndex];
// console.log(extractedSongName);
return extractedSongName
 }
  });


  //UPDATING SEEKBAR & SONG DURATION
  currentSong.addEventListener("timeupdate", () => {
 document.querySelector(".songtime").innerText = `${secondsToMinutesSeconds(
currentSong.currentTime
 )}/${secondsToMinutesSeconds(currentSong.duration)}`;

 document.querySelector(".circle").style.left =
(currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //SEEKBAR UPDATE OR SONG FORWARD
  document.querySelector(".seekbar").addEventListener("click", (e) => {
 let seekbarPercent =
(e.offsetX / e.target.getBoundingClientRect().width) * 100;
 document.querySelector(".circle").style.left = seekbarPercent + "%";

 currentSong.currentTime = (currentSong.duration * seekbarPercent) / 100;
 console.log(currentSong.currentTime);
  });

  //add evnt to volume
  document
 .querySelector(".range")
 .getElementsByTagName("input")[0]
 .addEventListener("change", (e) => {
// console.log(e, e.target, e.target.value);
currentSong.volume = parseInt(e.target.value) / 100;
 });


  //evnt listener on hamburger - for phone
  document.querySelector("#hamburger").addEventListener("click", () => {
  document.querySelector(".left").style.left = "0";

  document.body.classList.add('no-scroll');
  });

  //evnt listener on close btn - for phone
  document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-120%";

  document.body.classList.remove('no-scroll')
  });


 document.querySelector(".right").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-120%";

  document.body.classList.remove('no-scroll')
  });
  // //ENDS HERE

}



window.addEventListener("DOMContentLoaded", async () => {
  // Get saved album and track from localStorage
  const lastPlayedListOfSongs = localStorage.getItem("storedSongs");
//  console.log(lastPlayedAlbum);
  songs = JSON.parse(lastPlayedListOfSongs);
  // console.log(songs);

  const lastPlayedAlbumPath = localStorage.getItem("lastPlayedAlbumPath");
  // console.log(lastPlayedAlbumPath);



  const lastPlayedTrack = localStorage.getItem("lastTrack");
//  console.log(lastPlayedTrack);
  // If we have something stored
  if (lastPlayedAlbumPath && lastPlayedTrack) {
 // console.log("Restoring last played:", lastPlayedAlbum, lastPlayedTrack);

 // Load the songs of that album first

 await getSongsFromFolder(lastPlayedAlbumPath);


 // Then play or display that last song
 playMusic(lastPlayedTrack, true); // 'true' → load but don't autoplay

 

 let songAlbum = Array.from(document.getElementsByClassName("card"));
  songAlbum.forEach((e) => {
 // console.log(e.dataset.folder);

 const folderName = lastPlayedAlbumPath.split("/")[1];
 // console.log(folderName);
if(e.dataset.folder === folderName) {
 //  console.log(e.dataset.folder);

e.classList.add("playingBG");
  // console.log("bg added");

  e
 .querySelector(".songPlayingGIF")
 .classList.remove("hidden");
  //  console.log(e.querySelector(".songPlayingGIF"));

  }
  });



  }
  await getSongsList();
// await getLikedSongsData()

likedImgInCurrentLibrary(songs, likedSongs);
});


window.addEventListener("DOMContentLoaded",function(){

  
 currentDiv = "library";
// WILL SET LOOP LIST BY DEFAULT
 currentSong.onended = () => {
  seekbarNextBtn.click();
  // console.log("loopList set by default")

};
});

  

// let seekbarPreviousBtn = document.querySelector("#previous");
// let seekbarNextBtn = document.querySelector("#next");


seekbarPreviousBtn.addEventListener("click", async () => {
//   console.log(currentDiv);
 if(currentDiv === "library"){



//      console.log(` THE current div is ${currentDiv}`)
 
      //PREVIOUS BTN ON SEEKBAR
  
    // currentSong.src = null;
    // console.log(currentSong);
    // console.log(extractedSongName);
    //  console.log(currentSongName);
    // console.log(songs);

    if (isLibraryNavigating) {
 // If a navigation is already in progress, silently abort the new request.
 console.warn(`Library Navigation blocked: Already processing a request.`);
 return;
    }
    
    // Set lock and release it after 300ms (cooldown)
    isLibraryNavigating = true;
    setTimeout(() => {
 isLibraryNavigating = false;
    }, 300);


const recordBtn = document.querySelector(".recordBtn");

const recordBtnId =  recordBtn.getAttribute("id");
// console.log(recordBtnId);
if(recordBtnId === "startRec" || recordBtnId === "stopRec"){
  recordBtn.querySelector("p").textContent = "Start Rec";
 recordBtn.getAttribute("id");
 recordBtn.setAttribute("id", "disableRec");
}else{
  // console.log(recordBtnId);
}


    let songIndex = songs.indexOf(extractedSongName);
    // console.log(songIndex);

    if (songIndex > 0 && songIndex + 1 <= songs.length) {
      let tempIndex = songIndex - 1;
      // console.log(tempIndex);
      //  console.log(songs[tempIndex]);
  // console.log(currentSong);
 
      currentSong.src = songs[tempIndex];
 // console.log(currentSong);

      currentSong.play();
     

      let tempIndexSong = songs[tempIndex];

      extractedSongName = tempIndexSong;
      // console.log(currentSong);
      //  console.log(extractedSongName);

      play.src = "./src/img/pause.svg";

      let actualSongName = extractedSongName
 .split("/")[3]
 .split("-")[1]
 .replace(".mp3", "").trim();
      // console.log(actualSongName);
      let actualArtistName = extractedSongName.split("/")[3].split("-")[0].trim();
      // console.log(actualArtistName);



const songCoverImg = songs[tempIndex].split("/")[2];
// console.log(songCoverImg);
  
showSyncedLyrics(actualSongName, actualArtistName, songCoverImg);


      document.querySelector(
 ".songinfo"
      ).innerHTML = `${actualArtistName} - ${actualSongName}`;
      document.querySelector(
 ".songtime"
      ).innerText = `${secondsToMinutesSeconds(
 currentSong.currentTime
      )}/${secondsToMinutesSeconds(currentSong.duration)}`;

      //removing and changing last song
      // console.log(songInfo);
      songInfo.forEach((song) => {
 // console.log(song);
 if (song.classList.contains("playingBG")) {
   song.classList.remove("playingBG");
   // console.log("bg removed");

   // console.log(item);
   song.querySelector(".playPause").src = "./src/img/play.svg";

   //ADDING GIPHY & REMOVING SONG ICON
   song.querySelector(".musicLogo").src = "./src/img/music.svg";
   song.querySelector(".musicLogo").classList.add("invert");
   song.querySelector(".musicLogo").classList.remove("marginRight");
 }
      });

      //TO ADD BG & change playPause btn in sonlist of left
      let songUL = document
 .querySelector(".songList")
 .getElementsByTagName("li")[tempIndex];
      // console.log(songUL);

      if (songUL) {
 songUL.classList.add("playingBG");
 // console.log(songUL);
 // console.log((songUL).querySelector(".playPause").src);
 songUL.querySelector(".playPause").src = "./src/img/pause.svg";

 //ADDING GIPHY & REMOVING SONG ICON
 songUL.querySelector(".musicLogo").src = "./src/img/playingGiphy.gif";
 songUL.querySelector(".musicLogo").classList.remove("invert");
 songUL.querySelector(".musicLogo").classList.add("marginRight");
 // console.log(songUL);
      }

      return extractedSongName;
    } else {
      currentSong.src = songs[songs.length - 1];
      currentSong.play();
     
      //  console.log(currentSong);
      extractedSongName = songs[songs.length - 1];

      play.src = "./src/img/pause.svg";

      let actualSongName = extractedSongName
 .split("/")[3]
 .split("-")[1]
 .replace(".mp3", "");
      // console.log(actualSongName);
      let actualArtistName = extractedSongName.split("/")[3].split("-")[0];
      // console.log(actualArtistName);


const songCoverImg = songs[tempIndex].split("/")[2];
// console.log(songCoverImg);
  
showSyncedLyrics(actualSongName, actualArtistName, songCoverImg);


      document.querySelector(
 ".songinfo"
      ).innerHTML = `${actualArtistName} - ${actualSongName}`;
      document.querySelector(
 ".songtime"
      ).innerText = `${secondsToMinutesSeconds(
 currentSong.currentTime
      )}/${secondsToMinutesSeconds(currentSong.duration)}`;

      //removing and changing last song
      // console.log(songInfo);
      songInfo.forEach((song) => {
 // console.log(song);
 if (song.classList.contains("playingBG")) {
   song.classList.remove("playingBG");
   // console.log("bg removed");

   // console.log(item);
   song.querySelector(".playPause").src = "./src/img/play.svg";

   //ADDING GIPHY & REMOVING SONG ICON
   song.querySelector(".musicLogo").src = "./src/img/music.svg";
   song.querySelector(".musicLogo").classList.add("invert");
   song.querySelector(".musicLogo").classList.remove("marginRight");
 }
      });

      //TO ADD BG & change playPause btn in sonlist of left
      let songUL = document
 .querySelector(".songList")
 .getElementsByTagName("li")[songs.length - 1];
      // console.log(songUL);

      if (songUL) {
 songUL.classList.add("playingBG");
 // console.log(songUL);
 // console.log((songUL).querySelector(".playPause").src);
 songUL.querySelector(".playPause").src = "./src/img/pause.svg";

 //ADDING GIPHY & REMOVING SONG ICON
 songUL.querySelector(".musicLogo").src = "./src/img/playingGiphy.gif";
 songUL.querySelector(".musicLogo").classList.remove("invert");
 songUL.querySelector(".musicLogo").classList.add("marginRight");
 // console.log(songUL);
      }

      return extractedSongName;
    }
  
} else if(currentDiv === "liked"){


   //for LIKED SONGS DATA
//     console.log(`current div is ${currentDiv}`)

    // console.log(findLikedSongIndex);
    // console.log(fullSongPathOfLikedSong);


  // PREVIOUS BTN ON SEEKBAR
  
    
    // console.log(currentSong);
    // console.log(extractedSongName);
    //  console.log(currentSongName);
    // console.log(songs);
    //  currentSong.src = null;

    // let songIndex = songs.indexOf(extractedSongName);
    // console.log(songIndex);
    if (isLikedNavigating) {
 // If a navigation is already in progress, silently abort the new request.
 console.warn(`Liked Navigation blocked: Already processing a request.`);
 return;
    }
    
    // Set lock and release it after 300ms (cooldown)
    isLikedNavigating = true;
    setTimeout(() => {
 isLikedNavigating = false;
    }, 300);
    

const recordBtn = document.querySelector(".recordBtn");

const recordBtnId =  recordBtn.getAttribute("id");
// console.log(recordBtnId);
if(recordBtnId === "startRec" || recordBtnId === "stopRec"){
  recordBtn.querySelector("p").textContent = "Start Rec";
 recordBtn.getAttribute("id");
 recordBtn.setAttribute("id", "disableRec");
}else{
  // console.log(recordBtnId);
}


    if (findLikedSongIndex > 0 && findLikedSongIndex + 1 <= likedSongs.length) {
      let tempIndex = findLikedSongIndex - 1;
      //  console.log(tempIndex);
//  console.log(`PLAYING SONG IS ${likedSongs[tempIndex].fullPath}`);
// console.log(likedSongs[tempIndex]);

 
      currentSong.src = likedSongs[tempIndex].fullPath;
      
      currentSong.play();
     
// console.log(findLikedSongIndex);
      findLikedSongIndex = tempIndex
// console.log(findLikedSongIndex);
      fullSongPathOfLikedSong = likedSongs[tempIndex].fullPath;
      // console.log(currentSong);
      //  console.log(extractedSongName);

      play.src = "./src/img/pause.svg";

      let actualSongName = likedSongs[tempIndex].songName;
 let actualArtistName = likedSongs[tempIndex].artistName;


  const songCoverImg = (likedSongs[tempIndex].fullPath).split("/")[2].trim();
// console.log(songCoverImg);

  
showSyncedLyrics(actualSongName, actualArtistName, songCoverImg);




      document.querySelector(
 ".songinfo"
      ).innerHTML = `${actualArtistName} - ${actualSongName}`;
      document.querySelector(
 ".songtime"
      ).innerText = `${secondsToMinutesSeconds(
 currentSong.currentTime
      )}/${secondsToMinutesSeconds(currentSong.duration)}`;

 
let updatePrevSongUI = Array.from(
 document.querySelector(".songList").getElementsByTagName("li")
  );
  updatePrevSongUI.forEach((prevSong)=>{

  
  if (prevSong.classList.contains("playingBG")) {
 //  console.log(song);
 prevSong.classList.remove("playingBG");
 // console.log("bg removed");

 // console.log(item);
 prevSong.querySelector(".playPause").src = "./src/img/play.svg";

 //ADDING GIPHY & REMOVING SONG ICON
prevSong.querySelector(".musicLogo").src = "./src/img/music.svg";
prevSong.querySelector(".musicLogo").classList.add("invert");
 prevSong.querySelector(".musicLogo").classList.remove("marginRight");
  }
})

      //TO ADD BG & change playPause btn in sonlist of left
      let songUL = document
 .querySelector(".songList")
 .getElementsByTagName("li")[findLikedSongIndex];
      // console.log(songUL);

      if (songUL) {
 songUL.classList.add("playingBG");
 // console.log(songUL);
 // console.log((songUL).querySelector(".playPause").src);
 songUL.querySelector(".playPause").src = "./src/img/pause.svg";

 //ADDING GIPHY & REMOVING SONG ICON
 songUL.querySelector(".musicLogo").src = "./src/img/playingGiphy.gif";
 songUL.querySelector(".musicLogo").classList.remove("invert");
 songUL.querySelector(".musicLogo").classList.add("marginRight");
 // console.log(songUL);
      }

      return findLikedSongIndex;
    } else {
//       console.log(`PLAYING SONG  in liked div IS ${likedSongs[likedSongs.length - 1].fullPath}`);
      findLikedSongIndex = (likedSongs.length - 1)
//       console.log(findLikedSongIndex);
      currentSong.src = likedSongs[findLikedSongIndex].fullPath;
      currentSong.play();
      
      //  console.log(currentSong);
      
      fullSongPathOfLikedSong = likedSongs[likedSongs.length - 1].fullPath;

      play.src = "./src/img/pause.svg";

      let actualSongName = likedSongs[likedSongs.length - 1].songName;
      // console.log(actualSongName);
      let actualArtistName = likedSongs[likedSongs.length - 1].artistName;
      // console.log(actualArtistName);


  const songCoverImg = (likedSongs[likedSongs.length - 1].fullPath).split("/")[2].trim();
// console.log(songCoverImg);

  
showSyncedLyrics(actualSongName, actualArtistName, songCoverImg);


      document.querySelector(
 ".songinfo"
      ).innerHTML = `${actualArtistName} - ${actualSongName}`;
      document.querySelector(
 ".songtime"
      ).innerText = `${secondsToMinutesSeconds(
 currentSong.currentTime
      )}/${secondsToMinutesSeconds(currentSong.duration)}`;

      //removing and changing last song
      // console.log(songInfo);
let updatePrevSongUI = Array.from(
 document.querySelector(".songList").getElementsByTagName("li")
  );
  updatePrevSongUI.forEach((prevSong)=>{

  
  if (prevSong.classList.contains("playingBG")) {
 //  console.log(song);
 prevSong.classList.remove("playingBG");
 // console.log("bg removed");

 // console.log(item);
 prevSong.querySelector(".playPause").src = "./src/img/play.svg";

 //ADDING GIPHY & REMOVING SONG ICON
prevSong.querySelector(".musicLogo").src = "./src/img/music.svg";
prevSong.querySelector(".musicLogo").classList.add("invert");
 prevSong.querySelector(".musicLogo").classList.remove("marginRight");
  }
})

      //TO ADD BG & change playPause btn in sonlist of left
      let songUL = document
 .querySelector(".songList")
 .getElementsByTagName("li")[likedSongs.length - 1];
      // console.log(songUL);

      if (songUL) {
 songUL.classList.add("playingBG");
 // console.log(songUL);
 // console.log((songUL).querySelector(".playPause").src);
 songUL.querySelector(".playPause").src = "./src/img/pause.svg";

 //ADDING GIPHY & REMOVING SONG ICON
 songUL.querySelector(".musicLogo").src = "./src/img/playingGiphy.gif";
 songUL.querySelector(".musicLogo").classList.remove("invert");
 songUL.querySelector(".musicLogo").classList.add("marginRight");
 // console.log(songUL);
      }

      return findLikedSongIndex;
    }
  
 
}
 });
 
 seekbarNextBtn.addEventListener("click", async () => {
 if(currentDiv === "library"){
  //NEXT BTN ON SEEKBAR
  

    if (isLibraryNavigating) {
 // If a navigation is already in progress, silently abort the new request.
 console.warn(`Library Navigation blocked: Already processing a request.`);
 return;
    }
    
    // Set lock and release it after 300ms (cooldown)
    isLibraryNavigating = true;
    setTimeout(() => {
 isLibraryNavigating = false;
    }, 300);

const recordBtn = document.querySelector(".recordBtn");

const recordBtnId =  recordBtn.getAttribute("id");
// console.log(recordBtnId);
if(recordBtnId === "startRec" || recordBtnId === "stopRec"){
  recordBtn.querySelector("p").textContent = "Start Rec";
 recordBtn.getAttribute("id");
 recordBtn.setAttribute("id", "disableRec");
}else{
  // console.log(recordBtnId);
}

    // currentSong.src = null;
    let songIndex = songs.indexOf(extractedSongName);
    // console.log(songIndex);

    if (songIndex + 1 < songs.length && songIndex >= 0) {
      let tempIndex = songIndex + 1;
      // console.log(tempIndex)
      //   console.log(currentSong);
   
      currentSong.src = songs[tempIndex];
     
      currentSong.play();

      let tempIndexSong = songs[tempIndex];
      //  console.log(currentSong);
      extractedSongName = tempIndexSong;

      play.src = "./src/img/pause.svg";

      let actualSongName = extractedSongName
 .split("/")[3]
 .split("-")[1]
 .replace(".mp3", "");
      // console.log(actualSongName);
      let actualArtistName = extractedSongName.split("/")[3].split("-")[0];
      // console.log(actualArtistName);



const songCoverImg = songs[tempIndex].split("/")[2];
// console.log(songCoverImg);
  
showSyncedLyrics(actualSongName, actualArtistName, songCoverImg);


      document.querySelector(
 ".songinfo"
      ).innerHTML = `${actualArtistName} - ${actualSongName}`;
      document.querySelector(
 ".songtime"
      ).innerText = `${secondsToMinutesSeconds(
 currentSong.currentTime
      )}/${secondsToMinutesSeconds(currentSong.duration)}`;

      //removing and changing last song
      // console.log(songInfo);
      songInfo.forEach((song) => {
 // console.log(song);
 if (song.classList.contains("playingBG")) {
   song.classList.remove("playingBG");
   // console.log("bg removed");

   // console.log(item);
   song.querySelector(".playPause").src = "./src/img/play.svg";

   //ADDING GIPHY & REMOVING SONG ICON
   song.querySelector(".musicLogo").src = "./src/img/music.svg";
   song.querySelector(".musicLogo").classList.add("invert");
   song.querySelector(".musicLogo").classList.remove("marginRight");
 }
      });

      //TO ADD BG & change playPause btn in sonlist of left
      let songUL = document
 .querySelector(".songList")
 .getElementsByTagName("li")[tempIndex];
      // console.log(songUL);

      if (songUL) {
 songUL.classList.add("playingBG");
 // console.log(songUL);
 // console.log((songUL).querySelector(".playPause").src);
 songUL.querySelector(".playPause").src = "./src/img/pause.svg";

 //ADDING GIPHY & REMOVING SONG ICON
 songUL.querySelector(".musicLogo").src = "./src/img/playingGiphy.gif";
 songUL.querySelector(".musicLogo").classList.remove("invert");
 songUL.querySelector(".musicLogo").classList.add("marginRight");
 // console.log(songUL);
      }

      return extractedSongName;
    } else {
      currentSong.src = songs[0];
      currentSong.play();
     
      //  console.log(currentSong);
      extractedSongName = songs[0];

      play.src = "./src/img/pause.svg";

      let actualSongName = extractedSongName
 .split("/")[3]
 .split("-")[1]
 .replace(".mp3", "");
      // console.log(actualSongName);
      let actualArtistName = extractedSongName.split("/")[3].split("-")[0];
      // console.log(actualArtistName);



const songCoverImg = songs[0].split("/")[2];
// console.log(songCoverImg);
  
showSyncedLyrics(actualSongName, actualArtistName, songCoverImg);


      document.querySelector(
 ".songinfo"
      ).innerHTML = `${actualArtistName} - ${actualSongName}`;
      document.querySelector(
 ".songtime"
      ).innerText = `${secondsToMinutesSeconds(
 currentSong.currentTime
      )}/${secondsToMinutesSeconds(currentSong.duration)}`;

      //removing and changing last song
      // console.log(songInfo);
      songInfo.forEach((song) => {
 // console.log(song);
 if (song.classList.contains("playingBG")) {
   song.classList.remove("playingBG");
   // console.log("bg removed");

   // console.log(item);
   song.querySelector(".playPause").src = "./src/img/play.svg";

   //ADDING GIPHY & REMOVING SONG ICON
   song.querySelector(".musicLogo").src = "./src/img/music.svg";
   song.querySelector(".musicLogo").classList.add("invert");
   song.querySelector(".musicLogo").classList.remove("marginRight");
 }
      });

      //TO ADD BG & change playPause btn in sonlist of left
      let songUL = document
 .querySelector(".songList")
 .getElementsByTagName("li")[0];
      // console.log(songUL);

      if (songUL) {
 songUL.classList.add("playingBG");
 // console.log(songUL);
 // console.log((songUL).querySelector(".playPause").src);
 songUL.querySelector(".playPause").src = "./src/img/pause.svg";

 //ADDING GIPHY & REMOVING SONG ICON
 songUL.querySelector(".musicLogo").src = "./src/img/playingGiphy.gif";
 songUL.querySelector(".musicLogo").classList.remove("invert");
 songUL.querySelector(".musicLogo").classList.add("marginRight");
 // console.log(songUL);
      }

      return extractedSongName;
    }

 
} else if(currentDiv === "liked"){

      
 
    //  currentSong.src = null;
    // let songIndex = likedSongs.indexOf(extractedSongName);
    // console.log(songIndex);

    if (isLikedNavigating) {
 // If a navigation is already in progress, silently abort the new request.
 console.warn(`Liked Navigation blocked: Already processing a request.`);
 return;
    }
    
    // Set lock and release it after 300ms (cooldown)
    isLikedNavigating = true;
    setTimeout(() => {
 isLikedNavigating = false;
    }, 300);
    

const recordBtn = document.querySelector(".recordBtn");

const recordBtnId =  recordBtn.getAttribute("id");
// console.log(recordBtnId);
if(recordBtnId === "startRec" || recordBtnId === "stopRec"){
  recordBtn.querySelector("p").textContent = "Start Rec";
 recordBtn.getAttribute("id");
 recordBtn.setAttribute("id", "disableRec");
}else{
  // console.log(recordBtnId);
}



    if (findLikedSongIndex + 1 < likedSongs.length && findLikedSongIndex >= 0) {
//       console.log(findLikedSongIndex);
      findLikedSongIndex = findLikedSongIndex + 1;
    
//       console.log(findLikedSongIndex);
 // console.log(currentSong);
 // console.log(likedSongs[findLikedSongIndex].fullPath);
    
      currentSong.src = likedSongs[findLikedSongIndex].fullPath;
      // currentSong.load();
      currentSong.play();
      
     
      play.src = "./src/img/pause.svg";

      let actualSongName = likedSongs[findLikedSongIndex].songName
      
      // console.log(actualSongName);
      let actualArtistName = likedSongs[findLikedSongIndex].artistName
      // console.log(actualArtistName);



const songCoverImg = songs[findLikedSongIndex].split("/")[2];
// console.log(songCoverImg);
  
showSyncedLyrics(actualSongName, actualArtistName, songCoverImg);



      document.querySelector(
 ".songinfo"
      ).innerHTML = `${actualArtistName} - ${actualSongName}`;
      document.querySelector(
 ".songtime"
      ).innerText = `${secondsToMinutesSeconds(
 currentSong.currentTime
      )}/${secondsToMinutesSeconds(currentSong.duration)}`;

      //removing and changing last song
let updateNextSongUI = Array.from(
 document.querySelector(".songList").getElementsByTagName("li")
  );
  updateNextSongUI.forEach((nextSong)=>{

  
  if (nextSong.classList.contains("playingBG")) {
 //  console.log(song);
 nextSong.classList.remove("playingBG");
 // console.log("bg removed");

 // console.log(item);
 nextSong.querySelector(".playPause").src = "./src/img/play.svg";

 //ADDING GIPHY & REMOVING SONG ICON
nextSong.querySelector(".musicLogo").src = "./src/img/music.svg";
nextSong.querySelector(".musicLogo").classList.add("invert");
 nextSong.querySelector(".musicLogo").classList.remove("marginRight");
  }
})

      //TO ADD BG & change playPause btn in sonlist of left
      let songUL = document
 .querySelector(".songList")
 .getElementsByTagName("li")[findLikedSongIndex];
      // console.log(songUL);

      if (songUL) {
 songUL.classList.add("playingBG");
 // console.log(songUL);
 // console.log((songUL).querySelector(".playPause").src);
 songUL.querySelector(".playPause").src = "./src/img/pause.svg";

 //ADDING GIPHY & REMOVING SONG ICON
 songUL.querySelector(".musicLogo").src = "./src/img/playingGiphy.gif";
 songUL.querySelector(".musicLogo").classList.remove("invert");
 songUL.querySelector(".musicLogo").classList.add("marginRight");
 // console.log(songUL);
      }

      return findLikedSongIndex;
    } else {
      findLikedSongIndex = 0;
      currentSong.src = likedSongs[findLikedSongIndex].fullPath;
      currentSong.play();

      
     

      play.src = "./src/img/pause.svg";

      let actualSongName = likedSongs[findLikedSongIndex].songName

      // console.log(actualSongName);
      let actualArtistName = likedSongs[findLikedSongIndex].artistName
      // console.log(actualArtistName);


const songCoverImg = songs[findLikedSongIndex].split("/")[2];
// console.log(songCoverImg);
  
showSyncedLyrics(actualSongName, actualArtistName, songCoverImg);



      document.querySelector(
 ".songinfo"
      ).innerHTML = `${actualArtistName} - ${actualSongName}`;
      document.querySelector(
 ".songtime"
      ).innerText = `${secondsToMinutesSeconds(
 currentSong.currentTime
      )}/${secondsToMinutesSeconds(currentSong.duration)}`;

      //removing and changing last song
      let updateNextSongUI = Array.from(
 document.querySelector(".songList").getElementsByTagName("li")
  );
  updateNextSongUI.forEach((nextSong)=>{

  
  if (nextSong.classList.contains("playingBG")) {
 //  console.log(song);
 nextSong.classList.remove("playingBG");
 // console.log("bg removed");

 // console.log(item);
 nextSong.querySelector(".playPause").src = "./src/img/play.svg";

 //ADDING GIPHY & REMOVING SONG ICON
nextSong.querySelector(".musicLogo").src = "./src/img/music.svg";
nextSong.querySelector(".musicLogo").classList.add("invert");
 nextSong.querySelector(".musicLogo").classList.remove("marginRight");
  }
})

      //TO ADD BG & change playPause btn in sonlist of left
      let songUL = document
 .querySelector(".songList")
 .getElementsByTagName("li")[0];
      // console.log(songUL);

      if (songUL) {
 songUL.classList.add("playingBG");
 // console.log(songUL);
 // console.log((songUL).querySelector(".playPause").src);
 songUL.querySelector(".playPause").src = "./src/img/pause.svg";

 //ADDING GIPHY & REMOVING SONG ICON
 songUL.querySelector(".musicLogo").src = "./src/img/playingGiphy.gif";
 songUL.querySelector(".musicLogo").classList.remove("invert");
 songUL.querySelector(".musicLogo").classList.add("marginRight");
 // console.log(songUL);
      }

      return findLikedSongIndex;
    }
}
  });




document.addEventListener("DOMContentLoaded", ()=>{

  const searchBtn = document.getElementById("searchButton");
searchBtn.addEventListener("click", ()=>{
  const searchedSongName = searchInput.value.trim().toLowerCase();

  if (searchedSongName.length > 0) {

 

 if(searchedSongName.includes("karaoke")){
getMatchedKaraokeSongIndex(searchedSongName);
// console.log(`this includes karaoke - ${searchedSongName}`);
 }else{
 getMatchedSongIndex(searchedSongName);
//  console.log(`this dosen't include karaoke - ${searchedSongName}`);
 }

  } else {
console.log("Search term is empty.");
  }
});


// NEW CODE
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keypress", (e)=>{

  if (e.key === "Enter") {
  const searchedSongName = searchInput.value.trim().toLowerCase();

  if (searchedSongName.length > 0) {

 

 if(searchedSongName.includes("karaoke")){
getMatchedKaraokeSongIndex(searchedSongName);
// console.log(`this includes karaoke - ${searchedSongName}`);
 }else{
 getMatchedSongIndex(searchedSongName);
//  console.log(`this dosen't include karaoke - ${searchedSongName}`);
 }

  } else {
console.log("Search term is empty.");
  }
}
});


})

//search btn on left = to direct to input field
const searchBtnOnLeft = document.getElementById('searchBtnOnLeft');
const searchInput = document.getElementById("searchInput");

searchBtnOnLeft.addEventListener('click', function() {
 if (searchInput) {
  searchInput.focus();
 }
});





// Function to load all songs from all albums
async function getAllSongsList() {
 // Note: allSongs is now declared outside to retain the list for later use/searching
 allSongs = []; 
 const albumsDirectory = "songs/"; // Base path to your music folders

 try {
  // Step 1: Fetch the list of all album folder names
  let albumListResponse = await fetch(`${albumsDirectory}allSongs.json`);
  // console.log(albumListResponse);
  
  if (!albumListResponse.ok) {
throw new new Error(`Failed to fetch album list: ${albumListResponse.statusText}`);
  }
  
  let albumFolders = await albumListResponse.json();
  // console.log(albumFolders);
  
  // Step 2: Fetch the info.json for each album concurrently
  const fetchPromises = albumFolders.map(albumName => {
const albumPath = `${albumsDirectory}${albumName}/`;
return fetch(`${albumPath}info.json`)
 .then(response => {
  if (!response.ok) {
console.error(`Skipping album ${albumName}: Failed to fetch info.json`);
return null; // Return null to filter out later
  }
  
  
  // Correctly handle the songs list, assuming it's an array of raw filename strings.
  return response.json().then(albumData => {
return albumData.songs.map(filenameString => {
 
 // Remove the file extension for a cleaner display name
 const cleanName = filenameString.replace(/\.mp3$/i, '').trim(); 
 
 return {
  name: cleanName, // The song's display name
  filename: filenameString, // The original filename
  fullPath: `${albumPath}${filenameString}`, // CORRECT full path
  albumName: albumName
  // Add other default/derived properties here if needed, 
  // e.g., image: `${albumPath}cover.jpg`
 };
});
  });
 
 })
 .catch( error => {
  console.error(`Error processing album ${albumName}:`, error);
  return null;
 });
  });

  // Wait for all album info fetches to complete
  const results = await Promise.all(fetchPromises);

  // Step 3: Combine all song lists into the final 'allSongs' array
  results.forEach(songArray => {
if (songArray) {
 allSongs.push(...songArray);
}
  });

  console.log("Total songs loaded:", allSongs.length);
  return allSongs; // This array contains ALL songs with their full path

 } catch (error) {
  console.error("Error loading complete song list:", error);
  return []; // Return empty array on failure
 }
}



document.addEventListener("DOMContentLoaded", async()=>{ 
  const allMySongs = await getAllSongsList();
 // console.log(allMySongs);
 // console.log(allSongs[0].name);
  })


function getMatchedSongIndex(searchedSongName){

// console.log(searchedSongName);
//console.log(allSongs);

matchedSongIndex = allSongs.findIndex(song => {
  // Inside findIndex, 'song' is a single song object, so you can access its .name
  const normalizedSongName = song.name.toLowerCase();

  // Check if the song name includes the search term (case-insensitive)
  return normalizedSongName.includes(searchedSongName);
 });

 // console.log(`searched song index is ${matchedSongIndex}`);
 //  console.log(allSongs[matchedSongIndex]);
 searchedSong(matchedSongIndex);
 return matchedSongIndex;
}




function getMatchedKaraokeSongIndex(searchedSongName){

// console.log(searchedSongName);
//console.log(karaokeTracks);

 const clickedSongIndex = karaokeTracks.findIndex((trackPath) => {
 
const trackName = trackPath.split("-")[1].replace(".mp3", "").trim();
// console.log(trackName)
  
return trackName.toLowerCase() === searchedSongName.trim().toLowerCase();
  });

  // console.log(clickedSongIndex);
 // console.log(`searched song index is ${matchedSongIndex}`);
 //  console.log(allSongs[matchedSongIndex]);
 searchedKaraokeSong(clickedSongIndex);
 // return matchedSongIndex;
}





function searchedKaraokeSong(matchedSongIndex){
//  console.log(searchedSongName);
//  console.log(allSongs[matchedSongIndex]);
//  console.log(matchedSongIndex);

  let cardContainer = document.querySelector(".cardContainer");

  
cardContainer.innerHTML = "";


if(matchedSongIndex != -1){
  //  console.log(matchedSongIndex);
  //  console.log(allSongs[matchedSongIndex]);
  //console.log(allSongs);

 let songName = (karaokeTracks[matchedSongIndex]).split("/")[3].replace(".mp3", "");
 // console.log(karaokeTracks);
 // console.log(songName);
 let searchedAlbumCoverImg =  (karaokeTracks[matchedSongIndex]).split("/")[3].split("-")[0].replaceAll(" ", "").trim().toLowerCase();
// console.log(searchedAlbumCoverImg);


cardContainer.innerHTML = `
  <div data-folder="afterHours" class="card">
  <div class="play">
 <img src="./src/img/play.svg" alt="play" />
  </div>

  <img src="./src/img/playingGiphy.gif" 
  alt="Music Animation" class="songPlayingGIF hidden" />


  <img
 aria-hidden="false"
 draggable="false"
 loading="eager"
 src="./songs/karaokeTracks/${searchedAlbumCoverImg}.jpg"
 alt="MTV Unplugged In New York - Album by Nirvana | Spotify"
 class=" coverImg LBM25IAoFtd0wh7k3EGM PzkeRprwMqPpgrCKNMk8 PgTMmU2Gn7AESFMYhw4i"
  />
  <h2>${songName}</h2>

</div>`
  

cardContainer.addEventListener("click", ()=>{
// console.log(karaokeTracks[matchedSongIndex]);
  // currentSong.src = karaokeTracks[matchedSongIndex];



  const songCoverImg = (karaokeTracks[matchedSongIndex]).split("/")[3].split("-")[0].replaceAll(" ", "").trim().toLowerCase();
const songName = (karaokeTracks[matchedSongIndex]).split("-")[1].replace("Karaoke.mp3", "").trim();
// console.log(songName);
const artistName = (karaokeTracks[matchedSongIndex]).split("/")[3].split("-")[0].trim();
// console.log(artistName);


const finalSongCoverImg = `karaokeTracks/${songCoverImg}`;
// console.log(finalSongCoverImg);

// console.log(songName);
  
showSyncedLyrics(songName, artistName, finalSongCoverImg);
  // currentSong.play();
playKaraokesong(songName);
 

seekbarPlayBtn.src = "./src/img/pause.svg";

let songUL = Array.from(document
 .querySelector(".songList")
  .getElementsByTagName("li"));

 // console.log(songUL)

 songUL.forEach((song) => {
  // console.log(song);
  if (song.classList.contains("playingBG")) {
 song.classList.remove("playingBG");
 // console.log("bg removed");

 // console.log(item);
 song.querySelector(".playPause").src = "./src/img/play.svg";

 //ADDING GIPHY & REMOVING SONG ICON
 song.querySelector(".musicLogo").src = "./src/img/music.svg";
 song.querySelector(".musicLogo").classList.add("invert");
 song.querySelector(".musicLogo").classList.remove("marginRight");
  }
});
})




}else{
  cardContainer.innerHTML = ` <h2>Song Not found</h2>`
console.log("song not found");
}
}





function searchedSong(matchedSongIndex){
//  console.log(searchedSongName);
//  console.log(allSongs[matchedSongIndex]);
//  console.log(matchedSongIndex);

  let cardContainer = document.querySelector(".cardContainer");

  
cardContainer.innerHTML = "";


if(matchedSongIndex != -1){
  //  console.log(matchedSongIndex);
console.log(allSongs[matchedSongIndex]);
  //console.log(allSongs);

 let songName = allSongs[matchedSongIndex].name;
 let searchedAlbumCoverImg =  allSongs[matchedSongIndex].albumName;



cardContainer.innerHTML = `
  <div data-folder="afterHours" class="card">
  <div class="play">
 <img src="./src/img/play.svg" alt="play" />
  </div>

  <img src="./src/img/playingGiphy.gif" 
  alt="Music Animation" class="songPlayingGIF hidden" />


  <img
 aria-hidden="false"
 draggable="false"
 loading="eager"
 src="./songs/${searchedAlbumCoverImg}/cover.jpg"
 alt="MTV Unplugged In New York - Album by Nirvana | Spotify"
 class=" coverImg LBM25IAoFtd0wh7k3EGM PzkeRprwMqPpgrCKNMk8 PgTMmU2Gn7AESFMYhw4i"
  />
  <h2>${songName}</h2>

</div>`
  

cardContainer.addEventListener("click", ()=>{

  currentSong.src = allSongs[matchedSongIndex].fullPath;

  const songCoverImg = (allSongs[matchedSongIndex].fullPath).split("/")[1].trim();
const songName = (allSongs[matchedSongIndex].name).split("-")[1].replace(".mp3", "").trim();
const artistName = (allSongs[matchedSongIndex].name).split("-")[0].trim();
// console.log(allSongs)
// console.log(songCoverImg);
// console.log(songName);
// console.log(songName);
  
showSyncedLyrics(songName, artistName, songCoverImg);
  currentSong.play();

  let songInfo = document.querySelector(".songinfo");

  songInfo.innerText = `${artistName} - ${songName}`;


seekbarPlayBtn.src = "./src/img/pause.svg";

let songUL = Array.from(document
 .querySelector(".songList")
  .getElementsByTagName("li"));

 // console.log(songUL)

 songUL.forEach((song) => {
  // console.log(song);
  if (song.classList.contains("playingBG")) {
 song.classList.remove("playingBG");
 // console.log("bg removed");

 // console.log(item);
 song.querySelector(".playPause").src = "./src/img/play.svg";

 //ADDING GIPHY & REMOVING SONG ICON
 song.querySelector(".musicLogo").src = "./src/img/music.svg";
 song.querySelector(".musicLogo").classList.add("invert");
 song.querySelector(".musicLogo").classList.remove("marginRight");
  }
});
})




}else{
  cardContainer.innerHTML = ` <h2>Song Not found</h2>`
console.log("song not found");
}
}






//SYNC LYRICS
async function getLrc(songName, artistName){
  const apiUrl = `https://lrclib.net/api/get?track_name=${encodeURIComponent(songName)}&artist_name=${encodeURIComponent(artistName)}`

  try{
 const result = await fetch(apiUrl);
  if (!result.ok) throw new Error('Lyrics not found');
  const data = await result.json();

if(data.syncedLyrics){
  //  console.log(data.syncedLyrics);
  return data.syncedLyrics;
 
} else if(data.plainLyrics){
  //  console.log(data.plainLyrics);
return data.plainLyrics;
}else{
throw new Error('No lyrics found for this song.');
}
  }  catch (err) {
  console.error(err);
  return null;
}
}


function parseLrc(lrcText) {
  // console.log("Raw LRC text:", lrcText);

 
  const filteredData = lrcText.split("\n").map(line => {
 
 const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
 if (!match) return null;

 
 const time = parseInt(match[1]) * 60 + parseFloat(match[2]);

 
 const content = match[3].trim();

 // Return a line object
 return { time, content };
  }).filter(Boolean);

  // console.log("Parsed lines:", filteredData);
  return filteredData; 
}

async function showSyncedLyrics(songName, artistName, songCoverImg) {
 // console.log(songName);
  // console.log(artistName);
  // console.log(songCoverImg);

// playKaraokesong (songName);
lyricsOnScreenSongName = songName;
// console.log(lyricsOnScreenSongName);
// console.log(songName);


 


  const container = document.getElementById("lyrics-container");
  container.innerHTML = `<p>Fetching lyrics for ${songName}...</p>`;

  const artistNameLyrics = document.getElementsByClassName("artistNameLyrics")[0];
  const songNameLyrics = document.getElementsByClassName("songNameLyrics")[0];

  const imgLyrics = document.querySelector('.imgLyrics');
//  const extractedSongNameImg = songCoverImg.split("/")[2];
//  console.log(extractedSongName);

  artistNameLyrics.innerText = artistName;
  songNameLyrics.innerText = songName;
  // console.log(songName);

  // console.log((songCoverImg.split("/")[0] === "karaokeTracks"));
  // console.log("songs\karaokeTracks\greenday.jpg")
  if(songCoverImg.split("/")[0] === "karaokeTracks"){
 imgLyrics.src = (`./songs/${songCoverImg}.jpg`);

 }else{
 imgLyrics.src = (`./songs/${songCoverImg}/cover.jpg`);

 }


  const lrcText = await getLrc(songName, artistName);
  if (!lrcText) {
 container.innerHTML = `<p>No lyrics found.</p>`;
 return;
  }

  const lines = parseLrc(lrcText);
  container.innerHTML = lines.map(l => `<p>${l.content}</p>`).join('');
  const pTags = container.querySelectorAll('p');



  function updateLyrics() {
 const karaokeBtn = document.querySelector(".karaokeBtn");
karaokeBtn.classList.remove("hidden");

const songInfoWithLyrics = document.getElementById("songInfoWithLyrics");
songInfoWithLyrics.classList.remove("hidden");


 const currentTime = currentSong.currentTime;
 let currentIndex = lines.findIndex(
(line, i) => currentTime >= line.time && (!lines[i + 1] || currentTime < lines[i + 1].time)
 );

 pTags.forEach((p, i) => p.classList.toggle('active', i === currentIndex));

 const active = container.querySelector('.active');
 // if (active) active.scrollIntoView({ behavior: "smooth", block: "center" });

if (active && container) {
 // 1. Calculate the necessary scroll position to center the active line
 const containerHeight = container.offsetHeight;
 const activeHeight = active.offsetHeight;
 
 // Position = active line's top - (half of container height) + (half of active line height)
 const scrollTo = active.offsetTop - (containerHeight / 2) + (activeHeight / 2);

 // 2. Apply the scroll to the lyrics container ONLY
 container.scrollTo({
  top: scrollTo,
  behavior: "smooth"
 });
}

 if (!currentSong.paused) requestAnimationFrame(updateLyrics);
  }

  // add listener
  currentSong.addEventListener("play", () => {
 // console.log("Song started, syncing lyrics...");
 requestAnimationFrame(updateLyrics);
  });

  //start immediately if already playing
  if (!currentSong.paused) {
 // console.log("Song already playing, start sync now...");
 requestAnimationFrame(updateLyrics);
  }
}

//KARAOKE BTN FEATURE
 async function playKaraokesong (lyricsOnScreenSongName){

// await getKaraokeTracksFromFolder();
// console.log(lyricsOnScreenSongName);
// console.log(karaokeTracks);

const fliteredLyricsOnScreenSongName = lyricsOnScreenSongName.trim().toLowerCase();

const clickedSongIndex = karaokeTracks.findIndex((trackPath) => {
 
const trackName = trackPath.split("-")[1]
.replace("Karaoke.mp3", "")
.trim();

  
return trackName.toLowerCase() === fliteredLyricsOnScreenSongName.toLowerCase();
  });


  // console.log("Found Index:", clickedSongIndex);
  // console.log(karaokeTracks);

if(clickedSongIndex !== -1){
  // console.log(clickedSongIndex);
  const songInfo = document.querySelector(".songinfo");
  const songNameWithArtist = (karaokeTracks[clickedSongIndex]).split("/")[3].replace(".mp3", "").trim();
songInfo.innerText = songNameWithArtist;
  

currentKaraokeTrackFullPath = karaokeTracks[clickedSongIndex];

 currentSong.src = karaokeTracks[clickedSongIndex];
 currentSong.play();

 //recording voice & karaoke together 

const recordBtn = document.querySelector(".recordBtn");
if(recordBtn){
 recordBtn.getAttribute("id");
 recordBtn.setAttribute("id", "startRec");
}


startStopRecording();

currentSong.onended = ()=>{
  if(recordBtn){
  recordBtn.querySelector("p").textContent = "Start Rec";
 recordBtn.getAttribute("id");
 recordBtn.setAttribute("id", "disableRec");
seekbarNextBtn.click();
}
}


}else{
  // console.log("karaoke track not found");
  showToast("Karaoke not Available");
}

 }

let audioContext = null;

 //RECORDINGfnx
function startStopRecording(){

  const recordBtn = document.querySelector(".recordBtn");
  

  // let audioContext  = new AudioContext();
// const karaokeSource = audioContext.createMediaElementSource(currentSong);
if (!audioContext) {
  audioContext = new AudioContext();
}

if (!currentSong._karaokeSource) {
  currentSong._karaokeSource = audioContext.createMediaElementSource(currentSong);
  currentSong._karaokeSource.connect(audioContext.destination);
}

const karaokeSource = currentSong._karaokeSource;


karaokeSource.connect(audioContext.destination);
let mediaRecorder;
let micStream;
let audioChunks = [];
let isRecording = false;
let hasSavedRecording = false;
// let karaokeCurrentSongForRecording = new Audio(karaokeTracks[clickedSongIndex]);
// console.log(karaokeCurrentSongForRecording);
// console.log(karaokeTracks[clickedSongIndex]);

recordBtn.addEventListener("click", async()=>{

  if(!isRecording){

 isRecording = true;
 //updatee btn when statr rec here;
 recordBtn.querySelector("p").textContent = "Stop Rec";
 recordBtn.getAttribute("id");
 recordBtn.setAttribute("id", "stopRec");

  micStream = await navigator.mediaDevices.getUserMedia({ audio: true });


const micSource = audioContext.createMediaStreamSource(micStream);
const destination = audioContext.createMediaStreamDestination();

 karaokeSource.connect(destination);
 micSource.connect(destination);



 mediaRecorder = new MediaRecorder(destination.stream);
 audioChunks = [];

 mediaRecorder.ondataavailable = e => audioChunks.push(e.data);

 mediaRecorder.onstop = () => {

  if (hasSavedRecording) return; 
  hasSavedRecording = true;

// Combine audio chunks into one file
const blob = new Blob(audioChunks, { type: 'audio/webm' });
const url = URL.createObjectURL(blob);

const a = document.createElement('a');
a.href = url;
a.download = 'karaoke_recording.webm';
a.click();


// Reset UI
// recordBtn.querySelector('span').textContent = 'Record';
isRecording = false;
 }
 // console.log(karaokeTracks[clickedSongIndex])
// playKaraokesong(karaokeTracks[clickedSongIndex]);

 currentSong.currentTime = 0;
 currentSong.play();
 hasSavedRecording = false;
 mediaRecorder.start();
 seekbarPlayBtn.src = "./src/img/pause.svg";


  currentSong.onended = () => {
if (isRecording && mediaRecorder.state === 'recording') {
  recordBtn.querySelector("p").textContent = "Start Rec";
recordBtn.getAttribute("id");
 recordBtn.setAttribute("id", "disableRec");
  mediaRecorder.stop();
  micStream.getTracks().forEach(track => track.stop()); // turn off mic
  seekbarNextBtn.click();
  console.log("song ended after finished")
}
 };

  } else {
 // --- STOP RECORDING ---
 if (mediaRecorder && mediaRecorder.state === 'recording') {
mediaRecorder.stop();
micStream.getTracks().forEach(track => track.stop()); // turn off mic
 }
currentSong.pause();
 currentSong.currentTime = 0;
 // recordBtn.querySelector('span').textContent = 'Record';
  recordBtn.querySelector("p").textContent = "Start Rec";
 recordBtn.getAttribute("id");
 recordBtn.setAttribute("id", "disableRec");
 isRecording = false;
  seekbarPlayBtn.src = "./src/img/play.svg";
console.log("song ended when clicked on stop")
  }
})
}

 //TOAST MESSAGE
 function showToast(message) {
 const toast = document.getElementById('lyrics-toast');
 

 toast.classList.add('show');

 setTimeout(() => {
  toast.classList.remove('show');
 }, 3000);
}



karaokeBtn.addEventListener("click", function(){
  // console.log(lyricsOnScreenSongName)
playKaraokesong(lyricsOnScreenSongName);
})


async function getKaraokeTracksFromFolder(){
  
  const folderName = "songs/karaokeTracks";

  let reslts = await fetch(`./${folderName}/info.json`);
  let data = await reslts.json();
  
  karaokeTracks = data.songs.map((song) => `./${folderName}/${song}`);

  // console.log("karaokeTracks array:", karaokeTracks);
return karaokeTracks;
}



