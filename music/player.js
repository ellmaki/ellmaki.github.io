function setupAudioPlayer(audioPlayerId, trackListId, audioFiles, albumName, albumArt) {
    var audioPlayer = document.getElementById(audioPlayerId);
    var trackList = document.getElementById(trackListId);
    var currentFile = 0;

    audioPlayer.src = audioFiles[currentFile];

    updateVisuals(currentFile);

    trackList.addEventListener('click', function (e) {
        if (e.target && e.target.nodeName == 'LI') {
            currentFile = Number(e.target.getAttribute('data-track'));

            audioPlayer.src = audioFiles[currentFile];
            audioPlayer.play();
            updateVisuals(currentFile);

        }
    });

    audioPlayer.addEventListener('ended', function () {
        currentFile++;

        if (currentFile < audioFiles.length) {
            audioPlayer.src = audioFiles[currentFile];
            audioPlayer.play();

            updateVisuals(currentFile);
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.code === 'Space') {
            e.preventDefault();
            if (audioPlayer.paused) {
                audioPlayer.play();
            } else {
                audioPlayer.pause();
            }
        }
    });

    if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('previoustrack', function () {
            if (currentFile > 0) {
                currentFile--;
                audioPlayer.src = audioFiles[currentFile];
                audioPlayer.play();
                updateVisuals(currentFile);
            }
        });

        navigator.mediaSession.setActionHandler('play', function () {
            audioPlayer.play();
        });

        navigator.mediaSession.setActionHandler('pause', function () {
            audioPlayer.pause();
        });

        navigator.mediaSession.setActionHandler('nexttrack', function () {
            if (currentFile < audioFiles.length - 1) {
                currentFile++;
                audioPlayer.src = audioFiles[currentFile];
                audioPlayer.play();
                updateVisuals(currentFile);
            }
        });

        navigator.mediaSession.setActionHandler('seekto', function (event) {
            audioPlayer.currentTime = event.seekTime
        });
    }

    function updateVisuals(currentFile) {
        var tracks = document.querySelectorAll('.track');

        tracks.forEach(function (track) {
            track.classList.remove('currently-playing');
        });

        if (currentFile >= 0 && currentFile < tracks.length) {
            tracks[currentFile].classList.add('currently-playing');

            navigator.mediaSession.metadata = new MediaMetadata({
                title: tracks[currentFile].textContent,
                artist: 'Elliott Etzkorn',
                album: albumName,
                artwork: [{ src: albumArt }]
            });
        }
    }
}