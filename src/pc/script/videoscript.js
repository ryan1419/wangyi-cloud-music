{var video = document.getElementById('video'),
    playPauseBtn = document.getElementById('play_pauseBtn'),
    soundMute = document.getElementById('sound_mute'),
    playPro = document.getElementById('play_pro'),
    videoCon = document.getElementById('video_con'),
    soundPro = document.getElementById('sound_pro'),
    soundProCon = document.getElementById('sound_pro_con'),
    fullScreen = document.getElementById('full_screen'),
    videoControl = $('.video_control'),
    screenSta = false,
    maxTime = document.getElementById('max_time'),
    currentTime = document.getElementById('current_time'),
    proMark = document.getElementById('pro_mark'),
    soundMark = document.getElementById('sound_mark');}

{playPauseBtn.addEventListener('click',play_pause,false);
video.addEventListener('click',play_pause,false);
soundMute.addEventListener('click',sound_mute,false);
video.addEventListener('loadedmetadata',setProMax,false);
video.addEventListener('timeupdate',setCurrTime,false);
playPro.addEventListener('click',changeTime,false);
soundPro.addEventListener('click',changeSound,false);
fullScreen.addEventListener('click',changeScreen,false);
proMark.addEventListener('mousedown',playMarkdown,false);
document.addEventListener('mouseup',playMarkup,false);
soundMark.addEventListener('mousedown',soundMarkdown,false);
document.addEventListener('mouseup',soundMarkup,false);}

function play_pause(){
    if(video.paused){
        video.play();
        $(playPauseBtn).addClass('icon-bofangqizanting');
        $(playPauseBtn).removeClass('icon-bofangqikaishi');
    }else{
        video.pause();
        $(playPauseBtn).removeClass('icon-bofangqizanting');
        $(playPauseBtn).addClass('icon-bofangqikaishi');
    }
}

function sound_mute(){
    if(!video.muted){
        video.muted = true;
        $(soundMute).removeClass('icon-yinliangda');
        $(soundMute).addClass('icon-yinliangwu');
        soundMark.style.left = '-2px';
        soundPro.value = 0;

    }else{
        video.muted = false;
        $(soundMute).removeClass('icon-yinliangwu');
        $(soundMute).addClass('icon-yinliangda');
        soundMark.style.left = '55px';
        soundPro.value = 1;
    }
}

function setProMax(){
    playPro.setAttribute('max',video.duration);
    playPro.style.width = '640px';
    soundPro.style.width = '60px';
    maxTime.innerHTML = calculationTime(video.duration);
}

function setCurrTime(){
    playPro.setAttribute('value',video.currentTime);
    currentTime.innerHTML = calculationTime(video.currentTime);
    if(screenSta){
        proMark.style.left = (video.currentTime/video.duration) * parseInt(screen.width)-5+'px';
    }else{
        proMark.style.left = ((video.currentTime/video.duration) * parseInt(playPro.style.width))-5+'px';
    }
}

function changeTime(e){
    if(screenSta){
        video.currentTime = (e.pageX/screen.width) * video.duration;
        proMark.style.left = e.pageX - 5 +'px';
    }else{
        var proClickW = e.pageX - videoCon.offsetLeft;
        var proW = parseFloat(this.style.width);
        video.currentTime = (proClickW/proW) * video.duration;
    }
}

function changeSound(e){
    if(screenSta){
        var proClickW = e.pageX - (soundProCon.offsetLeft);
    }else{
        var proClickW = e.pageX - (soundProCon.offsetLeft+videoCon.offsetLeft);
    }
    video.muted = false;
    $(soundMute).removeClass('icon-yinliangwu');
    $(soundMute).addClass('icon-yinliangda');
    var proW = parseFloat(this.style.width);
    var wid = proClickW/proW;
    video.volume = wid;
    this.value = wid;
    soundMark.style.left = proClickW - 5 +'px';
}

function changeScreen(){
    if(screenSta){
        $(fullScreen).removeClass('icon-iconzuixiaohua');
        $(fullScreen).addClass('icon-bofangqiquanping');

        screenSta = false;
        videoControl.css({
            position:'relative',
            width:'100%'
        });
        playPro.style.width='640px';
        playPro.style.height='4px';

        if(document.exitFullscreen){
            document.exitFullscreen();
        }else if(document.mozCancelFullScreen){
            document.mozCancelFullScreen();
        }else if(document.webkitCancelFullScreen){
            document.webkitCancelFullScreen();
        }else if(document.msExitFullscreen){
            document.msExitFullscreen();
        }

        if(playPro.value == video.duration){
            proMark.style.left = parseInt(playPro.style.width)-5+'px';
        }
        document.removeEventListener('mousemove',showControl,false);
    }else{
        $(fullScreen).removeClass('icon-bofangqiquanping');
        $(fullScreen).addClass('icon-iconzuixiaohua');

        screenSta = true;
        videoControl.css({
            position:'absolute',
            left:0,
            bottom:0,
            width:'100%'
        });

        playPro.style.width='100%';
        playPro.style.height='5px';

        if(video.requestFullscreen){
            videoCon.requestFullscreen();
        }else if(video.mozRequestFullscreen){
            videoCon.mozRequestFullscreen();
        }else if(video.webkitRequestFullscreen){
            videoCon.webkitRequestFullscreen();
        }
        videoCon.style.width = '100%';
        videoCon.style.height = '100%';
        video.style.width = '100%';
        video.style.height = '100%';
        if(playPro.value == video.duration){
            proMark.style.left =  parseInt(screen.width)-5+'px';
        }
        document.addEventListener('mousemove',showControl,false);
        //document.addEventListener('keydown',escDown,false);

    }
}

function calculationTime(time){
    var minute = parseInt(time/60);
    var second = parseInt(time%60);
    if(second < 10){
        second = '0' + second;
    }
    if(minute < 10){
        minute = '0' + minute;
    }
    return minute+":"+second;
}

function playMarkdown(e){
    e.stopPropagation();
    $('body').css({
        "user-select":"none",
        cursor: 'pointer'
    });
    document.addEventListener('mousemove',playMarkMove,false);
}

function playMarkMove(e){
    if(screenSta){
        video.currentTime = (e.pageX/screen.width) * video.duration;
        playPro.value = video.currentTime;
        currentTime.innerHTML = calculationTime(video.currentTime);
        proMark.style.left = e.pageX - 5 +'px';
    }else{
        var procurrW = e.pageX - videoCon.offsetLeft;
        var proW = parseInt(playPro.style.width);
        video.currentTime = (procurrW/proW) * video.duration;
        playPro.value = video.currentTime;
        currentTime.innerHTML = calculationTime(video.currentTime);
        if(e.pageX < videoCon.offsetLeft){
            proMark.style.left = "-2px";
        }else if(e.pageX > (videoCon.offsetLeft + parseInt(playPro.style.width))){
            proMark.style.left = parseInt(playPro.style.width) - 12 +'xp';
        }else{
            proMark.style.left = e.pageX - videoCon.offsetLeft-5+'px';
        }
    }

}

function playMarkup(){
    $('body').css({
        "user-select":"text",
        cursor: 'auto'
    });
    document.removeEventListener('mousemove',playMarkMove,false);
}

function soundMarkdown(e){
    e.stopPropagation();
    $('body').css({
        "user-select":"none",
        cursor: 'pointer'
    });
    document.addEventListener('mousemove',soundMarkMove,false);
}

function soundMarkMove(e){
    if(screenSta){
        var proClickW = e.pageX - (soundProCon.offsetLeft);
    }else{
        var proClickW = e.pageX - (soundProCon.offsetLeft+videoCon.offsetLeft);
    }
    var proW = parseInt($('#sound_pro_con').css('width'));
    if(proClickW <= -1 ){
        soundMark.style.left = '-6px';
        video.volume = 0;
        soundPro.value = 0;
    }else if(proClickW > parseInt($('#sound_pro_con').css('width'))){
        soundMark.style.left = soundProCon.style.width+'px';
        video.volume = 1;
        soundPro.value = 1;
    }else{
        soundMark.style.left = proClickW - 5 + 'px';
        video.volume = proClickW/proW;
        soundPro.value = proClickW/proW;
    }
}

function soundMarkup(){
    $('body').css({
        "user-select":"text",
        cursor: 'auto'
    });
    document.removeEventListener('mousemove',soundMarkMove,false);
}

function showControl(e){
    if(e.pageY > 600){
        videoControl[0].style.bottom = '0';
    }else{
        videoControl[0].style.bottom = '-41px';
    }
}

//function escDown(e){
//    if(e.keyCode == 27){
//        $(fullScreen).removeClass('icon-iconzuixiaohua');
//        $(fullScreen).addClass('icon-bofangqiquanping');
//
//        screenSta = false;
//        videoControl.css({
//            position:'relative',
//            width:'100%'
//        });
//        playPro.style.width='640px';
//        playPro.style.height='4px';
//
//
//        if(playPro.value == video.duration){
//            proMark.style.left = parseInt(playPro.style.width)-5+'px';
//        }
//        document.removeEventListener('mousemove',showControl,false);
//        document.removeEventListener('keydown',escDown,false);
//    }
//}