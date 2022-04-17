const body = document.querySelector('body'),
colorPicker = document.querySelector('.clr_picker'),
toggleMode = document.querySelector('.switch'),
wrapper = document.querySelector('.player_wrapper'),
playList = wrapper.querySelector('.music_container'),
currentTimeDisplay = wrapper.querySelector('.current_time'),
progressBar = wrapper.querySelector('.img_container'),
audio = wrapper.querySelector('#audio'),
songInfo = wrapper.querySelector('.info'),
progressLineBar = wrapper.querySelector('.progress'),
progressIndi = progressLineBar.querySelector('.progress_indicator'),
playMode = wrapper.querySelector('.play_mode'),
playPauseBtn = wrapper.querySelector('.play-pause'),
playlistBtn = wrapper.querySelector('.playlist'),
prevBtn = playPauseBtn.previousElementSibling,
nextBtn = playPauseBtn.nextElementSibling;

let data= {
    color:undefined,
    mode:false
};

let musicIndex = 2;


if(localStorage.getItem('colorData')!==null){
    data = JSON.parse(localStorage.getItem('colorData'))
    if(data.mode===true){
        body.classList.add('active');
        body.removeAttribute('style');
        toggleMode.checked = true;
        colorPicker.classList.toggle('disabled')
        if(data.color!==undefined){
            body.classList.add('active');
            body.style.setProperty('--clr-mode', data.color);
            toggleMode.checked = true;
        }
    }
}else{
    body.classList.remove('active');
    body.removeAttribute('style');
};


window.addEventListener('load', ()=>{
   loadMusic(musicIndex)
})

function loadMusic(actualNum){
    progressBar.querySelector('img').src = `images/${allMusic[actualNum-1].img}.png`
    audio.src = `songs/${allMusic[actualNum-1].src}.mp3`;
    songInfo.querySelector('h2').textContent = `${allMusic[actualNum-1].name}`;
    songInfo.querySelector('h3').textContent = `${allMusic[actualNum-1].artist}`
}

audio.addEventListener('timeupdate', (e)=>{
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    const progressCircle = (currentTime / duration) * 360;
    progressBar.style.background = `conic-gradient(var(--clr-accent) ${progressCircle}deg, var(--clr-mode) 0deg)`;

    let displayCurrentMin = Math.floor(currentTime / 60);
    let dispalyCurrentSec = Math.floor(currentTime % 60);

    dispalyCurrentSec > 9 ? dispalyCurrentSec : dispalyCurrentSec = `0${dispalyCurrentSec}`;
    currentTimeDisplay.textContent = `${displayCurrentMin}:${dispalyCurrentSec}`;
    progressIndicator(currentTime , duration);
})

let isPlayMusic;

playPauseBtn.addEventListener('click', ()=>{
    isPlayMusic = playPauseBtn.classList.contains('paused');
    isPlayMusic ? pauseMusic() : playMusic();
})

function playMusic(){
    audio.play();
    playPauseBtn.classList.add('paused');
    playPauseBtn.textContent = 'pause';
}

function pauseMusic(){
    audio.pause();
    playPauseBtn.classList.remove('paused');
    playPauseBtn.textContent = 'play_arrow'
}

nextBtn.addEventListener('click', ()=>{
    nextMusic();
})

prevBtn.addEventListener('click', ()=>{
    prevMusic();
})

function nextMusic(){
    if(playMode.innerText==='shuffle'){
        musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
        loadMusic(musicIndex);
        playMusic()
    }
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
}

function prevMusic(){
    if(playMode.innerText==='shuffle'){
        musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
        loadMusic(musicIndex);
        playMusic()
    }
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex
    loadMusic(musicIndex);
    playMusic();
}

function progressIndicator(currentTime , duration){
    let indi = (currentTime / duration)*100;
    progressIndi.style.width = `${indi}%`;
    // console.log(progressIndi)
}

progressLineBar.addEventListener('click', (e)=>{ 
    let totalWidth = progressLineBar.clientWidth;
    let clickedWidthVal = e.offsetX;
    let totalDuration = audio.duration;
    let widthVal = (clickedWidthVal / totalWidth) * 100;
    progressIndi.style.width = widthVal + '%';
    audio.currentTime = (totalDuration / 100) * widthVal;
    playMusic();
})

audio.addEventListener('ended', ()=>{
    let getModeName = playMode.innerText;
    switch (getModeName) {
        case 'repeat':
            nextMusic();
            break;
        
        case 'repeat_one':
            audio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;

        case 'shuffle':
            musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
            loadMusic(musicIndex);
            playMusic();
            break;

        default:
            break;
    }
})

playMode.addEventListener('click', ()=>{
    let getModeName = playMode.innerText;
    switch (getModeName) {
        case 'repeat':            
            playMode.title = 'Song Looped';
            playMode.textContent = 'repeat_one'
            break;
        
        case 'repeat_one':
            playMode.title = 'Playlist Shuffled';
            playMode.textContent = 'shuffle'
            break;

        case 'shuffle':
            playMode.title = 'Playlist Looped';
            playMode.textContent = 'repeat'
            break;

        default:
            break;
    }
})



toggleMode.addEventListener('click', colorChanger)

function colorChanger(){
    body.classList.toggle('active');
    colorPicker.classList.toggle('disabled');
    body.removeAttribute('style');
    if(toggleMode.checked===true){
        data.mode = true
        localStorage.setItem('colorData', JSON.stringify(data))
        if(data.color!==undefined){
            body.style.setProperty('--clr-mode', data.color);
        }
    }
    else{
        localStorage.removeItem('colorData', JSON.stringify(data))
    }
}

colorPicker.addEventListener('change',()=>{
    data.color = colorPicker.value;
    body.style.setProperty('--clr-mode', data.color);
    data.color = data.color;
    localStorage.setItem('colorData', JSON.stringify(data))
})


playlistBtn.addEventListener('click', ()=>{
    playList.classList.toggle('active');
})


allMusic.forEach((music)=>{
    musicDiv = document.createElement('div');
    musicDiv.classList.add('music');

    musicName = document.createElement('h2');
    musicName.classList.add('music_name');
    musicName.textContent = music.name;
    
    singer = document.createElement('h3');
    singer.classList.add('singer');
    singer.textContent = music.artist;

    musicDetails = document.createElement('audio');
    musicDetails.src = `songs/${music.src}.mp3`;

    musicDuration = document.createElement('span');
    // musicDuration.textContent = ;

    singer.appendChild(musicDuration);


    musicDiv.append(musicName, singer , musicDetails);

    playList.append(musicDiv)

});

let playClickedSong = document.querySelectorAll('.music')

playClickedSong.forEach((clickedSong, index)=>{
    clickedSong.addEventListener('click', (e)=>{
        audio.src = e.target.parentElement.lastChild.src;
        loadMusic(index+1)
        musicIndex = index+1;
        playMusic()
    })
});





