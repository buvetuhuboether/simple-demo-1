'use strict';

const express = require( 'express' );
const io = require( 'socket.io' )();
const morgan = require( 'morgan' );
const http = require( 'http' );
const path = require( 'path' );

const app = express();

app.set( 'port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000 );
app.use( morgan( 'dev' ) );
app.use( express.static( path.join( __dirname, 'public' ) ) );

const server = http.createServer( app );
io.attach( server );

let counter = 0;
const sockets = new Map();

io.on( 'connection', socket => {
    socket.clientData = {
        value: 0,
        id: ++counter
    };
    sockets.set( socket.clientData.id.toString(), socket );

    console.log( `Client connected, сid: ${socket.clientData.id}` );

    socket.on( 'disconnect', () => {
        console.log( `Client disconnected, сid: ${socket.clientData.id}` );
        sockets.delete( socket.id );
    });
});

app.post( '/bill_accepted/:id/:value', ( req, res ) => {
    const { id, value } = req.params;
    const socket = sockets.get( id.toString() );
    socket.clientData.value += parseInt( value );
    if( socket ) socket.emit( 'accepted', socket.clientData.value );
    res.sendStatus( 200 );
});

app.post( '/bill_declined/:id', ( req, res ) => {
    const { id } = req.params;
    const socket = sockets.get( id.toString() );
    if( socket ) socket.emit( 'declined' );
    res.sendStatus( 200 );
});

server.listen( app.get( 'port' ), () => {
    console.log( 'Server listening on port ' + server.address().port );
});