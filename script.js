let currentSong = new Audio();// variable

let songs;

async function getSongs(){
    let a = await fetch("http://127.0.0.1:5500/musicSong/")
    //console.log(a);
    let response = await a.text();
    // console.log(response)

    let div = document.createElement("div")
    div.innerHTML = response

    // console.log(div)

    let as = div.getElementsByTagName("a")
    //  console.log(as);
    
    let song = [];// empty array
    for(let idx = 0;idx<as.length;idx++){
        const element = as[idx];
        //  console.log(element)
        if(element.href.endsWith(".mp3")){
            // song.push(element.href.split("/musicSong/")[1]);
            
            let s =element.href.split("/musicSong/")[1];
            //  console.log(s)
            song.push(s)
        }
        
    }

    //  console.log(song);
    return song;

    
}
function secondToMinutesSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}


const playMusic = (track,pause = false)=>{
    // let audio = new Audio("/musicSong/" + track);
  
    currentSong.src = "/musicSong/" + track;
    if(!pause){
        currentSong.play();
        // audio.play();
        play.src = "pause.svg";
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track); // it display the the song which is currently playing 
    document.querySelector(".songTime").innerHTML = "00:00/00:00"
}

async function main(){

    

    // get the list of all the song from getSongs() function

     songs = await getSongs()
    console.log(songs)
    playMusic(songs[0],true);// default song playing
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]

    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>
        <img class="invert" src="music.svg" alt="music">
        <div class="info">
          <div>${song.replaceAll("%20"," ")}</div>
          <div>Pratham</div>
        </div>
        <div class="playNow">
            <span>play now</span>
            <img class= "invert" src="play.svg" alt="playing">
        </div>

        </li>`;
    }

    //     // play the song
    // var audio = new Audio(songs[3]);
    // // audio.play();

    
    // audio.addEventListener("loadeddata", ()=>{
    //     let duration = audio.duration;
    //     // console.log(duration)
    //     // The duration variable now holds the duration (in seconds) of the audio clip
    // });

    // attach an eventlistner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach( e => {
        e.addEventListener("click",element =>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML.trim());
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
            console.log(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
       
    })

    // Array.from(...)-> this convert the html code retruned by getElementByTagName into an array


    // attach an eventListner to play , next ,prev, loop

    // direct id ka use kar sakte hai

    play.addEventListener("click", element => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg"; // Change icon to 'pause' when playing
        } else {
            currentSong.pause();
            play.src = "play.svg"; // Change icon to 'play' when paused
        }
    });
    

    // update timeing of current song

    currentSong.addEventListener("timeupdate",()=>{ // timeupdate is for updating time 
        console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songTime").innerHTML = `${secondToMinutesSeconds(currentSong.currentTime)}/${secondToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100+"%";
    })

    // add an eventlistner to seekbar

    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100 // it shows how much duration has completed
        document.querySelector(".circle").style.left =  percent + "%" ;
        currentSong.currentTime = ((currentSong.duration) * percent)/100;
    })

    // add an event listner to an hamberger

    document.querySelector(".hamb").addEventListener("click",e=>{
        document.querySelector(".leftbox").style.left = 0;
     

    })

    // add an event listner to an corss
    document.querySelector(".cross").addEventListener("click",e=>{
        document.querySelector(".leftbox").style.left = "-120%";
     
    })


    // add an event listner to prev  song for svg
    prev.addEventListener("click",e=>{
        // console.log("previous clicked");
        currentSong.pause();
        let currentSongName = currentSong.src.split("/").slice(-1)[0];

        // Get the index of the current song
        let index = songs.indexOf(currentSongName);
        if(index>0){
            playMusic(songs[index-1]);
        }
        
    })

    // add an event listner to next song for svg
    next.addEventListener("click",e=>{

        // console.log("next clicked");
        currentSong.pause();
        let currentSongName = currentSong.src.split("/").slice(-1)[0];

        // Get the index of the current song
        let index = songs.indexOf(currentSongName);
        playMusic(songs[(index+1)%songs.length]);// last gana ke bad suru se start ho jayega
        
    })

    // add an event listner to replay for svg

    // loop.addEventListener("click",e=>{
    // })
    


}

main()