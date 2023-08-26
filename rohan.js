const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const endButton = document.getElementById('endButton');
let localStream;
let peerConnection;

// Function to start the call
async function startCall() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;

        // Create and set up peer connection
        const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
        peerConnection = new RTCPeerConnection(configuration);

        // Add local stream to peer connection
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        // Set up remote video display
        peerConnection.ontrack = event => {
            if (!remoteVideo.srcObject) {
                remoteVideo.srcObject = event.streams[0];
            }
        };

        // Offer SDP
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // Send offer to the other peer (e.g., through a signaling server)
        // In a real application, you would use a WebSocket or another method for signaling.

    } catch (error) {
        console.error('Error starting call:', error);
    }
}

// Function to end the call
function endCall() {
    if (peerConnection) {
        peerConnection.close();
    }
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localVideo.srcObject = null;
    }
    remoteVideo.srcObject = null;
}

startButton.addEventListener('click', startCall);
endButton.addEventListener('click', endCall);
