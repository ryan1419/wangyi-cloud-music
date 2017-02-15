/**
 * Created by tms11_000 on 2017/1/24.
 * 播放器
 */
;(function(){

    var audio        = document.getElementById('player'),
        playPauseBtn = document.getElementById('play_pause'),
        playerPro    = document.getElementById('player_pro'),//进度条
        currTime     = document.getElementById('curr_time'),
        maxTime      = document.getElementById('max_time'),
        proCon       = document.getElementById('pro_con'), //进度条的容器
        proSlideBtn  = document.getElementById('pro_slide_btn');//进度条上的小圆点


    $(playPauseBtn).tmstap(play_pause);
    $(proCon).tmstap(changeTime);
    audio.addEventListener('timeupdate',setCurrTime,false);
    audio.addEventListener('loadedmetadata',setProMax,false);
    proSlideBtn.addEventListener('touchstart',proSlideBtnStart,false);

    function play_pause(){
        if(audio.paused){
            audio.play();
            playsta();
        }else{
            audio.pause();
            pausesta();
        }
    }

    function setProMax(){
        playerPro.setAttribute('max',audio.duration);
        maxTime.innerHTML = calculationTime(audio.duration);
    }

    function setCurrTime(){
        playerPro.setAttribute('value',audio.currentTime);
        currTime.innerHTML = calculationTime(audio.currentTime);
        proSlideBtn.style.left = ((audio.currentTime/audio.duration) - 0.02) * 100 + '%';
        if(audio.currentTime == audio.duration){
            playNext();
        }
    }

    function calculationTime(time){
        var minute = parseInt(time / 60);
        var second = parseInt(time % 60);
        if(second < 10){
            second = '0' + second;
        }
        if(minute < 10){
            minute = '0' + minute;
        }
        return minute+":"+second;
    }

    function changeTime(e,t){
        var protouchW = e.touches[0].pageX - t.offsetLeft;
        var proW = parseFloat($(t).css('width'));
        audio.currentTime = (protouchW/proW) * audio.duration;
    }

    function proSlideBtnStart(e){
        e.stopPropagation();
        document.addEventListener('touchmove',proSlideBtnMove,false);
        document.addEventListener('touchend',removeBtnMove,false);
    }

    function proSlideBtnMove(e){
        var procurrW = e.touches[0].pageX - proCon.offsetLeft;
        var proW = parseFloat($(proCon).css('width'));
        audio.currentTime = (procurrW/proW) * audio.duration;
        currTime.innerHTML = calculationTime(audio.currentTime);
    }

    function removeBtnMove(){
        document.removeEventListener('touchmove',proSlideBtnMove,false);
    }


    function playsta(){
        $(playPauseBtn).addClass('icon-zanting1');
        $(playPauseBtn).removeClass('icon-bofang');
        $('#player_pointer').addClass('playpointer');
        $('#record').removeClass('pauserecord');
    }

    function pausesta(){
        $(playPauseBtn).removeClass('icon-zanting1');
        $(playPauseBtn).addClass('icon-bofang');
        $('#player_pointer').removeClass('playpointer');
        $('#record').addClass('pauserecord');
    }
})();
