function $(node){
    return document.querySelector(node)
}

function $$(node){
    return document.querySelectorAll(node)
}
var musicList = []
var musicListIndex = 0;
var audio = new Audio();
var Div

//首次获取音乐并播放
getMusicList(function(list){
    musicList = list
    loadMusic(musicList[musicListIndex])
    generateList(list)
})

//监听播放状态修改进度条长度
audio.ontimeupdate = function(){
    $('.play-load .bar').style.width = (this.currentTime/this.duration)*100+'%'
    $('.time-bar').style.width = (this.currentTime/this.duration)*100+'%'
}

//渲染时间
function upTime(){
    var min = Math.floor(audio.currentTime/60)
    var sec = Math.floor(audio.currentTime)%60
    if( min < 10 ) {
        min = '0' + min
    }
    if( sec < 10) {
        sec = '0' + sec
    }
    $('.time').innerText = min + ':' + sec
}

//播放器播放每隔一秒渲染一次时间
audio.onplay = function(){
        clock = setInterval(function(){
        var min = Math.floor(audio.currentTime/60)
        var sec = Math.floor(audio.currentTime)%60
        if( min < 10 ) {
            min = '0' + min
        }
        if( sec < 10) {
            sec = '0' + sec
        }
        $('.time').innerText = min + ':' + sec
    },1000)
    $('ul>li').querySelector('div').style.width = audio.currentTime/audio.duration*100+'%'
}


//播放器停止，或者暂停停止时间渲染
audio.onpause = function(){
    clearInterval(clock)
}


//渲染ajax获取数据
function getMusicList(callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET','/music-play/music.json',true);
    xhr.onload = function(){
        if( ( xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 ){
            callback(JSON.parse(xhr.responseText));
        }else{
        }
    }
    xhr.onerror = function(){
    }
    xhr.send()
}

//音乐播放以及页面渲染
function loadMusic(musicObj){
    $('.list .title').innerText = musicObj.title
    $('.bottom-icon .singer').innerText = musicObj.auther
    $('body').style.backgroundImage = 'url('+musicObj.img+')'
   audio.src = musicObj.src
}

//下一曲播放逻辑
$('#next').onclick = function(){
    musicListIndex = (++musicListIndex) % musicList.length
    loadMusic(musicList[musicListIndex])
    changeIcon()
    changehehe()
}

//上一曲播放逻辑
$('#previous').onclick = function(){
    musicListIndex = (musicList.length+(--musicListIndex)) % musicList.length
    loadMusic(musicList[musicListIndex])
    changeIcon()
    changehehe()
}


//播放暂停按钮事件
$('#play-bottom').addEventListener('click',changeIcon)

function changeIcon(){
    console.log(audio.paused)
    if(audio.paused){
        audio.play()
        $('#play-bottom').classList.remove('icon-bofang')
        $('#play-bottom').classList.add('icon-zanting')
        console.log('正在播放')
    }else{
        audio.pause()
        $('#play-bottom').classList.remove('icon-zanting')
        $('#play-bottom').classList.add('icon-bofang')
    }
}

//拖动进度条音乐跳转（给最外面的绑定事件）
$('.play-load').onclick = function(e){
    // audio.currentTime = audio.duration * ((e.offsetX/this.offsetWidth)*100+'%')
    var loadWidth = e.offsetX/this.offsetWidth
    audio.currentTime = audio.duration * loadWidth
    $('.bar').style.width = loadWidth*100 + '%'
}


//播放结束播放下一曲
audio.onended = function(){
    musicListIndex = (++musicListIndex) % musicList.length
    loadMusic(musicList[musicListIndex])
}

//渲染歌曲列表
function generateList(list){
    var html = '';
    for(var i in list){
        html += '<li data-index='+i+'>'+list[i].title+'-'+list[i].title+'<div></div></li>'
    }
    $('.play-list').innerHTML = html;
    $('.play-list>li>div').classList.add('time-bar')
}


//使用事件代理点击li标签切换歌曲
$('.play-list').onclick = function(e){
    var target = e.target
    if(target.nodeName.toLowerCase() == 'li'){
        musicListIndex = target.getAttribute('data-index')
        loadMusic(musicList[musicListIndex])
        changeIcon()
    }
}

//换歌曲的时候切换歌单列表的进度条
function changehehe(){
    var Div = $$('.play-list>li>div')
    for(var i = 0;i < musicList.length;i++){
        Div[i].classList.toggle('time-bar')
    }
}




