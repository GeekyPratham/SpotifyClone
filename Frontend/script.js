let currentSong = new Audio(); // variable for current song
let songs; // array to hold song list
let currFolder; // current folder name
let token;
// Check for the token on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    token = localStorage.getItem('authToken');
    const midsegment = document.querySelector('.midsegment');
    console.log(token)
    if (!token || token === 'undefined' || token === 'null') {
        midsegment.style.display = 'none'; // Hide features if not logged in
        alert('You need to sign in to access this feature.');
    } else {
        midsegment.style.display = 'block'; // Show features if logged in
       main();
    }
});



// Function to reset the UI to its initial state
function resetToInitialState() {
    const midsegment = document.querySelector('.midsegment');
    midsegment.style.display = 'none'; // Hide or reset the component
    document.querySelector(".songList").getElementsByTagName("ul")[0].innerHTML = ''; // Clear song list
    alert('You have been logged out. Please sign in to continue.');
}

// Fetch the songs list from the server
async function getSongs(folder) {
    try {
        currFolder = folder;
        let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;

        let as = div.getElementsByTagName("a");
        songs = []; // empty array

        for (let idx = 0; idx < as.length; idx++) {
            const element = as[idx];
            if (element.href.endsWith(".mp3")) {
                let s = element.href.split(`/${folder}/`)[1];
                songs.push(s);
            }
        }

        let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
        songUl.innerHTML = "";
        for (const song of songs) {
            songUl.innerHTML += `<li data-song="${song}">
                <img class="invert" src="music.svg" alt="music">
                <div class="info">
                  <div>${song.replaceAll("%20", " ").split("_")[0]}</div>
                  <div>Pratham</div>
                </div>
                <div class="playNow">
                    <span>play now</span>
                    <img class="invert" src="play.svg" alt="playing">
                </div>
            </li>`;
        }

        // Attach event listeners to the new songs
        Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", element => {
                const songFile = e.getAttribute("data-song");
                playMusic(songFile);
            });
        });
    } catch (error) {
        console.error("Error fetching songs: ", error);
        alert("Failed to load songs. Please try again later.");
    }
}

// Utility function to convert seconds to minutes and seconds
function secondToMinutesSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Play music function
const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "pause.svg"; // Change play button to pause
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track.replaceAll("%20", " ").split("_")[0].replace(".mp3", "")); // Display song info
    document.querySelector(".songTime").innerHTML = "00:00/00:00"; // Reset song timer
}

// Main function for the music player
async function main() {
    await getSongs("Frontend/musicSong/bhaktiSong"); // Load default folder songs
    playMusic(songs[0], true); // Default song playing, paused

    // Play/pause button
    play.addEventListener("click", element => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg"; // Change icon to 'pause' when playing
        } else {
            currentSong.pause();
            play.src = "play.svg"; // Change icon to 'play' when paused
        }
    });

    // Update song time and seekbar
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songTime").innerHTML = `${secondToMinutesSeconds(currentSong.currentTime)}/${secondToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // Seekbar interaction
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    // Hamburger menu interactions
    document.querySelector(".hamb").addEventListener("click", e => {
        document.querySelector(".leftbox").style.left = 0;
    });

    document.querySelector(".cross").addEventListener("click", e => {
        document.querySelector(".leftbox").style.left = "-120%";
    });

    // Previous song button
    prev.addEventListener("click", e => {
        currentSong.pause();
        let currentSongName = currentSong.src.split("/").slice(-1)[0];
        let index = songs.indexOf(currentSongName);
        if (index > 0) {
            playMusic(songs[index - 1]);
        } else {
            playMusic(songs[songs.length - 1]); // Loop back to last song
        }
    });

    // Next song button
    next.addEventListener("click", e => {
        currentSong.pause();
        let currentSongName = currentSong.src.split("/").slice(-1)[0];
        let index = songs.indexOf(currentSongName);
        playMusic(songs[(index + 1) % songs.length]); // Loop back to first song
    });

    // Volume button toggle mute/unmute
    volume.addEventListener("click", e => {
        if (currentSong.muted) {
            currentSong.muted = false;
            volume.src = "volume.svg"; // Change back to volume icon
        } else {
            currentSong.muted = true;
            volume.src = "mute.svg"; // Change to mute icon
        }
    });

    // Volume range interaction
    document.querySelector(".range input").addEventListener("change", e => {
        currentSong.volume = parseInt(e.target.value) / 100;
    });

    // Load new playlist when card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            await getSongs(`Frontend/musicSong/${item.currentTarget.dataset.folder}`);
        });
    });


        // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function() {
        console.log(token)
        localStorage.removeItem('authToken'); // Remove the token
        resetToInitialState(); // Reset UI to initial state
    });
}

// main(); // Execute the main function
