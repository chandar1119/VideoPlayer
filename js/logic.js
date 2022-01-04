window.onload = function() {
    init();
}

id('mediaPlayer').onloadeddata = function() {
    id('runTime').innerText = setTime('duration');
    buffer();
};

function init() {
    addListeners();

}

function addListeners() {

    // function scope variables mostly used as Flag var
    var rangeisDown = false; //rangeisDown is used to show/move thumbnail image while scrolling though timeline
    var isDown = false; //isDown is used to check timer thumb pressed or not while moving it.
    // function scope used in range click,drag-mousenmove,mouseup
    var myX = 0;
    var timer = null;
    id('playButton').addEventListener('click', function(event) {
        playVideo();
        showControls(id('mainContainer'));
    }, false);

    id('desktopPlay').addEventListener('click', function(event) {
        playVideo();
        showControls(id('mainContainer'));
    }, false);

    id('mobilePlayButton').addEventListener('click', function(event) {
        playVideo();
        showControls(id('mainContainer'));
    }, false);
    
    id('mainContainer').addEventListener('mouseenter',function(){
        this.classList.add('showControls');
    });
    id('mainContainer').addEventListener('touchstart',function(){
        this.classList.add('showControls');
    })
    
    id('mainContainer').addEventListener('mouseleave',function(){
        showControls(this);
    });

    id('mainContainer').addEventListener('touchend',function(){
        showControls(this);
    });

    function showControls(that){
        clearTimeout(timer);
        if (id('mediaPlayer').paused) {
            that.classList.add('showControls');
        }
        else{
            timer = setTimeout(function(){
                that.classList.remove('showControls');
            },2000)
        }
    }
    function playVideo(){
        if (id('mediaPlayer').paused) {
            id('mediaPlayer').play();
            id('playButton').childNodes[0].setAttribute('src','images/pause.png');
        } else {
            id('mediaPlayer').pause()
            id('playButton').childNodes[0].setAttribute('src','images/play.png');
        }
    }

    id('audioButton').addEventListener('click', function(event) {
        if(id('mediaPlayer').muted){
            id('mediaPlayer').muted =! id('mediaPlayer').muted;
            id('audioButton').children[0].setAttribute('src','images/unmute.png');
        }
        else{
            id('mediaPlayer').muted =! id('mediaPlayer').muted;
            id('audioButton').children[0].setAttribute('src','images/mute.png');
        }
    }, false);

    id('mediaPlayer').addEventListener('timeupdate', function() {
        if (!id('mediaPlayer').paused) {
            id('playButton').children[0].setAttribute('src','images/pause.png');
            id('mobilePlayButton').children[0].setAttribute('src','images/pause.png');
        } else {
            id('playButton').children[0].setAttribute('src','images/play.png');
            id('mobilePlayButton').children[0].setAttribute('src','images/play.png');
        }
        id('currentTime').innerText = setTime('currentTime');
        played();
        buffer();
        audio('audioButton');
    });

    function audio(btn){
        if(id('mediaPlayer').muted){
            id(btn).children[0].setAttribute('src','images/mute.png');
        }
        else{
            id(btn).children[0].setAttribute('src','images/unmute.png');
        }
    }

    id('mediaPlayer').addEventListener('ended', function(){
        id('playButton').children[0].setAttribute('src','images/play.png');
        showControls(id('mainContainer'))
    });

    id('range').addEventListener('mousedown', function(event) {
        rangeClick(event);
    }, false);
    id('range').addEventListener('touchstart', function(event) {
        rangeClick(event);
    }, false);
    function rangeClick(event){
        var play = true;
        if (id('mediaPlayer').paused) {
            id('mediaPlayer').pause()
            play = false;
        } else {
            id('mediaPlayer').pause()
            play = true;
        }
        if(event.touches != undefined){
            var thumbValue = event.touches[0].clientX - id('range').getBoundingClientRect().left;
        }
        else{
            var thumbValue = event.clientX - id('range').getBoundingClientRect().left;
        }
        id('thumb').style.left = thumbValue / id('range').getBoundingClientRect().width * 100 + '%';
        id('played').style.width = thumbValue / id('range').getBoundingClientRect().width * 100 + '%';
        id('mediaPlayer').currentTime = id('mediaPlayer').duration / 100 * parseFloat(id('thumb').style.left);
        if (play) {
            id('mediaPlayer').play()
        }
        myX = parseFloat(id('thumb').style.left) / 100 * id('range').getBoundingClientRect().width;
        id('rangeSlider').classList.add('active');
        rangeisDown = true;
    }
    id('range').addEventListener('mouseup', function(event) {
        rangeisDown = false;
    });
    id('range').addEventListener('touchend', function(event) {
        rangeisDown = false;
    });
    
    id('thumb').addEventListener('mousedown', function(event) {
        isDown = true;        
    }, true);

    id('thumb').addEventListener('touchstart', function(event) {
        isDown = true;        
    }, true);

    document.addEventListener('mouseup', function(event) {
        release(event);
    }, true);

    document.addEventListener('touchend', function(event) {
        release(event);
    }, true);

    document.addEventListener('mousemove', function(event) {
        if(rangeisDown){
            move(event);
        }
        else if (isDown == true){
            move(event);
        }
               
    }, true);

    document.addEventListener('touchmove', function(event) {
        if(rangeisDown){
            move(event);
        }
        else if (isDown == true){
            move(event);
        } 
    }, true);

    document.addEventListener('mousedown',function(event){
        if(event.target.id != 'thumb' && event.target.id != 'range'){
            id('rangeSlider').classList.remove('active');
        }
    })
    document.addEventListener('touchend',function(event){
        if(event.target.id != 'thumb' && event.target.id != 'range'){
            id('rangeSlider').classList.remove('active');
        }
    })

    function release(event){
        isDown = false;
        touchStart = false;
        rangeisDown = false;
        if (myX > id('range').getBoundingClientRect().width) {
            myX = id('range').getBoundingClientRect().width;
        } else if (myX < 0) {
            myX = 0
        }
        id('scrollTimer').classList.add('displayNone');
        
    }
    
    function move(event){
            
            if(event.touches != undefined){
                myX = event.touches[0].clientX - id('range').getBoundingClientRect().left ;
            }
            else{
                event.preventDefault();
                myX = event.clientX - id('range').getBoundingClientRect().left;
            }
                
            if (myX > id('range').getBoundingClientRect().width) {
                id('thumb').style.left = 100 + '%';
                id('played').style.width = 100 + '%';
            } else if (myX < 0) {
                id('thumb').style.left = 0 + '%';
                id('played').style.width = 0 + '%';
            } else {
                id('thumb').style.left = myX / id('range').getBoundingClientRect().width * 100 + '%';
                id('played').style.width = myX / id('range').getBoundingClientRect().width * 100 + '%';
            }

            id('mediaPlayer').currentTime = id('mediaPlayer').duration / 100 * parseFloat(id('thumb').style.left);
            id('rangeSlider').classList.add('active');
            moveTimer(event);
            id('scrollTimer').classList.remove('displayNone');
        
    }


    id('rangeSlider').addEventListener('mouseenter',function(event){
        id('scrollTimer').classList.remove('displayNone');
    });
    
    var timerTouched = false;
    id('rangeSlider').addEventListener('touchstart',function(event){
        if(event.target.id == 'thumb'){
        id('scrollTimer').classList.remove('displayNone');
        
        }
        timerTouched = true;
    });

    id('rangeSlider').addEventListener('mousemove',function(event){
        setRangeSliderValue(event);
    });

    id('rangeSlider').addEventListener('touchmove',function(event){
        setRangeSliderValue(event);
    });

    id('rangeSlider').addEventListener('mouseleave',function(event){
        id('scrollTimer').classList.add('displayNone');
    });

    id('rangeSlider').addEventListener('touchend',function(event){
        id('scrollTimer').classList.add('displayNone');
        timerTouched = false;
    });
}

function setRangeSliderValue(event){
    // create scroll scrubber thumbnail during runtime
    if(id('thumbNailPlayer') == null){
        var video = document.createElement('video');
        video.src = id('mediaPlayer').getAttribute('src');
        video.autoplay = false;
        video.disableremoteplayback = '';
        video.playsinline = '';
        video.tabindex = '-1';
        video.id="thumbNailPlayer";
        video.controls ='';
        id('hoverThumbNail').appendChild(video);
    }
    id('thumbNailPlayer').currentTime = moveTimer(event);
    id('scrollTimer').classList.remove('displayNone');
}

function moveTimer(event){
    if(event.touches != undefined){
        var mousePoint = event.touches[0].clientX - id('range').getBoundingClientRect().left;
    }
    else{
        var mousePoint = event.clientX - id('range').getBoundingClientRect().left;
    }
    // this if statement is for not allowing tooltip to go further left/right than timer width
    if(mousePoint < id('scrollTimer').getBoundingClientRect().width/2){
        mousePoint = id('scrollTimer').getBoundingClientRect().width/2;
    }
    else if(mousePoint > (id('range').getBoundingClientRect().width - (id('scrollTimer').getBoundingClientRect().width)/2)){
        mousePoint = id('range').getBoundingClientRect().width - (id('scrollTimer').getBoundingClientRect().width)/2;
    }
    id('scrollTimer').style.left = mousePoint + 'px';

    //reinitializing mousepoint to get correct thumbnail image even if the tootlip stopped moving beyond certain limit- fall back
    if(event.touches != undefined){
        var mousePoint = event.touches[0].clientX - id('range').getBoundingClientRect().left;
    }
    else{
        var mousePoint = event.clientX - id('range').getBoundingClientRect().left;
    }

    if(mousePoint < 0){
        mousePoint = 0;
    }
    else if(mousePoint > (id('range').getBoundingClientRect().width)){
        mousePoint = id('range').getBoundingClientRect().width;
    }
    var hoverValue = (mousePoint * 100/id('range').getBoundingClientRect().width);
    var setValueInTooltip = setTimeInTooltip('duration',hoverValue);
    id('hoverTimer').innerText = setValueInTooltip;
    return setValueInTooltip * 100;
}


// to set texts in video control like duration,current time etc.,
function setTime(obj) {
    let minutes = Math.floor(id('mediaPlayer')[obj] / 60);
    let seconds = Math.floor(id('mediaPlayer')[obj] - minutes * 60);
    let minuteValue;
    let secondValue;

    if (minutes < 10) {
        minuteValue = '0' + minutes;
    } else {
        minuteValue = minutes;
    }

    if (seconds < 10) {
        secondValue = '0' + seconds;
    } else {
        secondValue = seconds;
    }

    return (minuteValue + '.' + secondValue);
}

function setTimeInTooltip(obj,percentage) {
    let calcdDuration = id('mediaPlayer')[obj]/100 * percentage;
    let minutes = Math.floor(calcdDuration / 60);
    let seconds = Math.floor(calcdDuration - minutes * 60);
    let minuteValue;
    let secondValue;

    if (minutes < 10) {
        minuteValue = '0' + minutes;
    } else {
        minuteValue = minutes;
    }

    if (seconds < 10) {
        secondValue = '0' + seconds;
    } else {
        secondValue = seconds;
    }

    return (minuteValue + '.' + secondValue);
}


function buffer() {
    var bufferedValue = id('mediaPlayer').buffered;
    var bufferEnd = bufferedValue.end(0);
    id('buffered').style.width = bufferEnd / id('mediaPlayer').duration * 100 + '%';
}

function played() {
    var currentTime = parseFloat(id('mediaPlayer').currentTime);
    id('played').style.width = currentTime / id('mediaPlayer').duration * 100 + '%';
    id('thumb').style.left = currentTime / id('mediaPlayer').duration * 100 + '%'
}

function id(input) {
    return document.getElementById(input);
}