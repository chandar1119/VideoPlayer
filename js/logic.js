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

// BACKGROUND EXIT
function addListeners() {
    id('playButton').addEventListener('click', function(event) {
        if (id('mediaPlayer').paused) {
            id('mediaPlayer').play();
            event.target.setAttribute('src','images/pause.png');
        } else {
            id('mediaPlayer').pause()
            event.target.setAttribute('src','images/play.png');
        }
    }, false);

    id('mobilePlayButton').addEventListener('click', function(event) {
        if (id('mediaPlayer').paused) {
            id('mediaPlayer').play();
            event.target.setAttribute('src','images/pause.png');
        } else {
            id('mediaPlayer').pause()
            event.target.setAttribute('src','images/play.png');
        }
    }, false);

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
    });

    id('range').addEventListener('click', function(event) {
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
    }, false);


    var isDown = false;
    
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

    // function scope used in range click,drag-mousenmove,mouseup
    var myX = 0;
    document.addEventListener('mousemove', function(event) {
        move(event);        
    }, true);

    document.addEventListener('touchmove', function(event) {
        move(event);        
    }, true);


    function release(event){
        isDown = false;
        touchStart = false;
        if (myX > id('range').getBoundingClientRect().width) {
            myX = id('range').getBoundingClientRect().width;
        } else if (myX < 0) {
            myX = 0
        }

        // if statement for hiding timer tooltip
        // if(event.touches != undefined){
        //     if(event.touches[0].clientY > (id('range').getBoundingClientRect().top + id('range').getBoundingClientRect().height)){
        //         id('scrollTimer').classList.add('hidden');
        //     }
        // }
        // else{
        //     if(event.clientY > (id('range').getBoundingClientRect().top + id('range').getBoundingClientRect().height)){
                id('scrollTimer').classList.add('hidden');
        //     }
        // }
        
    }
    function move(event){
        if (isDown) {
            
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
            id('scrollTimer').classList.remove('hidden');
        }
    }


    id('rangeSlider').addEventListener('mouseenter',function(event){
        id('scrollTimer').classList.remove('hidden');
    });
    
    id('rangeSlider').addEventListener('touchstart',function(event){
        id('scrollTimer').classList.remove('hidden');
    });
    id('rangeSlider').addEventListener('mousemove',function(event){
        setRangeSliderValue(event);
    });
    id('rangeSlider').addEventListener('touchmove',function(event){
        setRangeSliderValue(event);
    });
    id('rangeSlider').addEventListener('mouseleave',function(event){
        id('scrollTimer').classList.add('hidden');
    });
    id('rangeSlider').addEventListener('touchend',function(event){
        id('scrollTimer').classList.add('hidden');
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
    id('scrollTimer').classList.remove('hidden');
}

function moveTimer(event){
    if(event.touches != undefined){
        var mousePoint = event.touches[0].clientX - id('range').getBoundingClientRect().left;
    }
    else{
        var mousePoint = event.clientX - id('range').getBoundingClientRect().left;
    }
        if(mousePoint < 0){
            mousePoint = 0;
        }
        else if(mousePoint > id('range').getBoundingClientRect().width){
            mousePoint = id('range').getBoundingClientRect().width;
        }
        id('scrollTimer').style.left = mousePoint + 'px';
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