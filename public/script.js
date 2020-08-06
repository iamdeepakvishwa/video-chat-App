const socket = io('/')
const videoGrid = document.getElementById('video-grid');  
const myVideo = document.createElement('video');
myVideo.muted = true;


var peer = new Peer(undefined,{
    path: 'peerjs',
    host: '/',
    port: '5000',
});
 
let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream =>{
    myVideoStream = stream
    videoStream(myVideo,stream);
    peer.on('call',call=>{
        call.answer(stream)
        const video = document.createElement('video');
        call.on('stream',userVideoStream=>{
            videoStream(video,userVideoStream);
        })
    })
    socket.on('user-connected',(userId)=>{
        connectToNewUser(userId,stream);
    })
})

peer.on('open', id=>{
    socket.emit('join-room',ROOM_ID,id);
})




const connectToNewUser =(userId,stream)=>{
    const call = peer.call(userId,stream)
    const video = document.createElement('video');
    call.on('stream',userVideoStream=>{
        videoStream(video,userVideoStream);
    });
}

const videoStream = (video, stream )=>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videoGrid.append(video);
}

let msg = document.querySelector('#chat_message')


document.addEventListener('keypress',(e)=>{
    if(e.key === 'Enter'){
        socket.emit('message',msg.value);
        msg.value = '';
    }
})

socket.on('createMessage' ,message=>{
    let msg = document.querySelector('.messages');
    let li = document.createElement('li');
    li.innerHTML = `<b>user</b><br/>${message}`;
    li.className = 'message';
    msg.append(li);
    scrollToBottom();
})

const scrollToBottom = ()=>{
    let element = $('.main__chat__window');
    element.scrollTop(element.prop("scrollHeight"));
}

const muteUnmute = ()=>{
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = ()=>{
    const html = `<i class= "fas fa-microphone"></i> 
        <span>Mute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = html;
}

const setUnmuteButton = ()=>{
    const html = `<i class= "unmute fas fa-microphone-slash"></i> 
        <span>Unmute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = html;
}

const playStop = ()=>{
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayButton();
    }else {
        setStopButton();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setPlayButton = ()=>{
    const html = `
        <i class ="stop fas fa-video-slash"></i>
        <span>Play Video</span>
   `
   document.querySelector('.main__video_button').innerHTML = html;
}

const setStopButton = ()=>{
    const html = `
        <i class ="fas fa-video"></i>
        <span>Stop Video</span>
   `
   document.querySelector('.main__video_button').innerHTML = html;
}