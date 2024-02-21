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
    myvideoStream=stream;
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
