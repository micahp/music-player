document.addEventListener('DOMContentLoaded', () => {
    const songList = document.getElementById('songList');
    const playPauseButton = document.getElementById('playPauseButton');
    const nextButton = document.getElementById('nextButton');
    const prevButton = document.getElementById('prevButton');
    const muteButton = document.getElementById('muteButton');
    const volumeSlider = document.getElementById('volumeSlider');
    const nowPlayingBar = document.getElementById('nowPlayingBar');
    const songCover = document.getElementById('songCover');
    const songTitle = document.getElementById('songTitle');
    const songArtist = document.getElementById('songArtist');
    const audioElement = document.createElement('audio');

    let songs = [];
    let currentSongIndex = 0;
    let isPlaying = false;
    let isMuted = false;

    // Fetching audio files from the server
    fetch('/audio-files')
    .then(response => response.json())
    .then(files => {
        songs = files.map(file => ({
            title: file,
            artist: 'Unknown Artist',
            cover: 'placeholder.jpg',
            file: `http://localhost:3000/audio/${encodeURIComponent(file)}`
        }));
        populateSongList();
    })
    .catch(error => console.error('Error fetching audio files:', error));


    // Function to play a song
    function playSong(index) {
        const song = songs[index];
        currentSongIndex = index;
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist || 'Unknown Artist';
        songCover.src = song.cover || 'placeholder.jpg';
    
        // Directly set the src attribute to the audio file URL
        audioElement.src = song.file;
        audioElement.play();
        isPlaying = true;
        playPauseButton.innerHTML = '&#x23F8;'; // Pause icon
    }

    // Function to toggle play/pause
    function togglePlayPause() {
        if (isPlaying) {
            audioElement.pause(); // Pause the audio
            playPauseButton.innerHTML = '&#x25B6;'; // Update button to show the play icon
        } else if (!audioElement.src) {
            playSong(0);
        } else {
            audioElement.play(); // Play the audio
            playPauseButton.innerHTML = '&#x23F8;'; // Update button to show the pause icon
        }
        isPlaying = !isPlaying; // Toggle the state
    }

    // Play/Pause button event listener
    playPauseButton.addEventListener('click', togglePlayPause);

    // Function to play previous song
    function playPreviousSong() {
        let currTime = Math.floor(audioElement.currentTime);
        let duration = Math.floor(audioElement.duration);
        console.log('currTime: ', currTime);
        if (currTime < 3 || currentSongIndex == 0) {
            playSong(currentSongIndex - 1);
        } else {
            playSong(currentSongIndex);
        }
      
        // if (isNaN(duration)){
        //   durationDiv.innerHTML = '00:00';
        // } 
        // else{
        //   durationDiv.innerHTML = formatSecondsAsTime(duration);
        // }
    }

    prevButton.addEventListener('click', playPreviousSong);

    // Toggle mute functionality
    function toggleMute() {
        audioElement.muted = !audioElement.muted; // Toggle the muted state
        if (audioElement.muted) {
            muteButton.innerHTML = '&#x1F507;'; // Muted icon/character
        } else {
            muteButton.innerHTML = '&#x1F50A;'; // Unmuted icon/character
        }
    }

    // Event listener for the Mute button
    muteButton.addEventListener('click', toggleMute);

    // Event listener for the Volume Slider
    volumeSlider.addEventListener('input', (event) => {
        const volume = event.target.value / 100; // Convert the slider value to a 0-1 range
        audioElement.volume = volume; // Set the audio volume

        // Optionally, update the mute button icon based on the volume level
        if (volume === 0) {
            muteButton.innerHTML = '&#x1F507;'; // Muted icon/character
            audioElement.muted = true; // Ensure consistency in mute state
        } else if (audioElement.muted || volumeSlider.value > 0) {
            audioElement.muted = false; // Unmute if adjusting volume above 0
            muteButton.innerHTML = '&#x1F50A;'; // Unmuted icon/character
        }
    });

    // Function to play the next song
    function playNextSong() {
        if (songs.length > 0) {
            currentSongIndex = (currentSongIndex + 1) % songs.length; // Increment and wrap around
            playSong(currentSongIndex); // Play the next song
        }
    }

    // Event listener for the Next button
    nextButton.addEventListener('click', playNextSong);
    
    // Optional: Update isPlaying when audio is paused/played outside of the playPauseButton control
    audioElement.addEventListener('play', () => {
        isPlaying = true;
        playPauseButton.innerHTML = '&#x23F8;'; // Pause icon
    });

    audioElement.addEventListener('pause', () => {
        isPlaying = false;
        playPauseButton.innerHTML = '&#x25B6;'; // Play icon
    });
    

    // Handling file uploads
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'audio/*';
    fileInput.multiple = true;
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', (event) => {
        const files = Array.from(event.target.files);
        songs = files.map(file => ({
            title: file.name,
            artist: 'Unknown Artist',
            cover: 'placeholder.jpg',
            file: file
        }));
        populateSongList();
        console.log(songs);
    });

    // Populate song list in the UI
    function populateSongList() {
        songList.innerHTML = '';
        songs.forEach((song, index) => {
            const songItem = document.createElement('div');
            songItem.textContent = song.title;
            songItem.classList.add('songItem');
            songItem.addEventListener('click', () => playSong(index));
            songList.appendChild(songItem);
        });
    }

    // ... [Rest of the event listeners and functions] ...

    // Trigger file upload
    document.body.appendChild(fileInput);
    fileInput.click();
});
