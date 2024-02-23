const socket = io('/');
const videoGrid = document.getElementById('video-grid');
console.log(videoGrid);
let myvideoStream;
const myvideo = document.createElement('video');
myvideo.muted = true;
// import Peer from 'peerjs';

// var peer = new Peer(undefined, {
//     path: '/peerjs',
//     host: '/',
//     port: '3030'
// })
var peer = new Peer();
navigator.mediaDevices.getUserMedia({ //we can attemp to access the webcame and mike of client through this.
    video: true,
    audio: true
}).then(stream => {
    myvideoStream = stream;
    addvideostream(myvideo, stream);
    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            // console.log("SHOWING");
            addvideostream(video, userVideoStream);
        })
    })

    //Telling socket that we join room 
    socket.on('user-connected', (userId) => {
        // socket.emit('join-room',ROOM_ID);
        connectToNewUser(userId, stream);
        // console.log(userId);
    });
})
peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
});


//call the user
const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addvideostream(video, userVideoStream);
    })
}

//Function
const addvideostream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}

let text = $('input')

//Doing Chat
$('html').keydown((e) => {
    if (e.which == 13 && text.val().length !== 0) {
        console.log(text.val())
        socket.emit('message', text.val());
        text.val('')
    }
})

socket.on('createMessage', message => {
    $('ul').append(`<li class="message"><b>user</b><br/>${message}</li>`)
})

//Scroll For Chat
const scrollToBottom = () => {
    var d = $('.main__chat_window');
    d.scrollToBottom(d.prop('scrollHeight'));
}


//To stop functionality of mute and unmute.
const muteUnmute = () => {
    const enabled = myvideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myvideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myvideoStream.getAudioTracks()[0].enabled = true;
    }
}

//To stop functionality of Turn on and turnoff video
const playStop = () => {
    console.log('object')
    let enabled = myvideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myvideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo()
    } else {
        setStopVideo()
        myvideoStream.getVideoTracks()[0].enabled = true;
    }
}

//To show Mute and Unmute.
const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
}

//To show stop video and play video
const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>    `
    document.querySelector('.main__video_button').innerHTML = html;
}
