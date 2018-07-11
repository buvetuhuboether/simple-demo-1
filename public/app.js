'use strict';

const start = document.getElementById( 'start' );
let socket = null;

start.addEventListener( 'click', () => {
    console.log( 'Start button clicked' );
    if( socket ) return;
    socket = io.connect();
    socket.on( 'connect', () => {
        console.log( 'Server connected...' );
        showConnectionCaption();
    });
    socket.on( 'disconnect', () => {
        console.log( 'Server disconnected...' );
    });
    socket.on( 'cid', cid => {
        console.log( 'cid', cid );
    });
    socket.on( 'accepted', data => {
        console.log( 'accepted', data );
        updateAcceptedCaption( data );
        enableAcceptedButton( data > 0 );
        enableDeclinedCaption( false );
    });
    socket.on( 'declined', () => {
        console.log( 'declined' );
        enableDeclinedCaption();
    });
});

function showConnectionCaption() {
    const caption = document.getElementById( 'caption' );
    caption.style.display = 'block';
}

function updateAcceptedCaption( value ) {
    const acceptedAmount = document.getElementById( 'accepted_amount' );
    acceptedAmount.innerText = value;
}

function enableAcceptedButton( enable ) {
    const acceptedButton = document.getElementById( 'accepted_btn' );
    acceptedButton.style.display = enable ? 'block' : 'none';
}

function enableDeclinedCaption( enable = true ) {
    const declined = document.getElementById( 'declined' );
    declined.style.display = enable ? 'block' : 'none';
}