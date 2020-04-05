import React, { useEffect, useRef, useState } from "react";
import Nav from "../nav";
import dynamic from 'next/dynamic';
import io from "socket.io-client";
import Grid from '@material-ui/core/Grid';
import MicRoundedIcon from '@material-ui/icons/MicRounded';
import Styles from "./style";
import { withStyles } from "@material-ui/styles";

const Zoom = dynamic(
  () => import('../NOSSRComponent/Zoom'),
  {
    ssr: false,
  }
)

const Main = ({ classes }) => {
  const participant = useRef(null);
  const [config, setConfig] = useState({});
  const roomsList = useRef(null);
  const [broadcastUI, setBroadcastUI] = useState(null);

  const rotateAudio = (audio) => {
    audio.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(0deg)';
    setTimeout(() => {
      audio.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(360deg)';
    }, 1000);
  }

  useEffect(() => {
    if (!location.hash.replace('#', '').length) {
      location.href = location.href.split('#')[0] + '#' + (Math.random() * 100).toString().replace('.', '');
      location.reload();
    }
    const data = {
      openSocket: function (config) {
        var SIGNALING_SERVER = 'http://localhost:9559/';

        config.channel = config.channel || location.href.replace(/\/|:|#|%|\.|\[|\]/g, '');
        var sender = Math.round(Math.random() * 999999999) + 999999999;

        io(SIGNALING_SERVER).emit('new-channel', {
          channel: config.channel,
          sender: sender
        });

        var socket = io(SIGNALING_SERVER + config.channel);
        socket.channel = config.channel;
        socket.on('connect', function () {
          console.log("Connect")
          if (config.callback) config.callback(socket);
        });

        socket.on('error', function (err) {
          console.log("error", err)
        });

        socket.send = function (message) {
          console.log(message)
          socket.emit('message', {
            sender: sender,
            data: message
          });
        };
        socket.on('message', config.onmessage);
      },
      onRemoteStream: function (media) {
        var audio = media.audio;
        audio.setAttribute('controls', true);
        audio.setAttribute('autoplay', true);
        participant.current.insertBefore(audio, participant?.current.firstChild);
        audio.play();
        rotateAudio(audio);
      },

      onRoomFound: function (room) {
        console.log("Room", room)
        var alreadyExist = document.getElementById(room.broadcaster);
        if (alreadyExist) return;

        if (typeof roomsList.current === 'undefined') roomsList = document.body;

        var tr = document.createElement('tr');
        tr.setAttribute('id', room.broadcaster);
        tr.innerHTML = '<td>' + room.roomName + '</td>' +
          '<td><button class="join" id="' + room.roomToken + '">Join Room</button></td>';
        roomsList.current.insertBefore(tr, roomsList.firstChild);

        tr.onclick = function () {
          tr = this;
          captureUserMedia(function () {
            broadcastUI.joinRoom({
              roomToken: tr.querySelector('.join').id,
              joinUser: tr.id
            });
          });
        };
      },
      onNewParticipant: function (numberOfViewers) {
        document.title = 'Viewers: ' + numberOfViewers;
      },
      onReady: function () {
        console.log('now you can open or join rooms');
      }
    }
    setConfig(data);
    var broadcastUI = broadcast(data);
    setBroadcastUI(broadcastUI);
  }, []);

  const captureUserMedia = (callback) => {
    var audio = document.createElement('audio');
    audio.setAttribute('autoplay', true);
    audio.setAttribute('controls', true);

    audio.muted = true;
    audio.volume = 0;

    participant?.current.insertBefore(audio, participant.current.firstChild)

    var mediaConfig = {
      video: audio,
      constraints: { audio: true, video: false },
      onsuccess: (stream) => {
        setConfig({
          ...config,
          attachStream: stream
        })
        callback && callback();
        audio.muted = true;
        audio.volume = 0;
        rotateAudio(audio);
      },
      onerror: (e) => {
        console.log(e)
        alert('unable to get access to your microphone');
        callback && callback();
      }
    };
    window.getUserMedia(mediaConfig);
  }

  const setupNewBroadcast = () => {
    captureUserMedia(() => {
      broadcastUI.createRoom({
        roomName: 'Anonymous'
      });
    });
  }
  return (
    <div>
      <Nav />
      <Grid container spacing={12}>
        <Grid item xs={8}>
          {/* <Zoom /> */}
        </Grid>
        <Grid className={classes.interpreter} item xs={4}>
          <div className={classes.micSection} onClick={setupNewBroadcast}>
            <MicRoundedIcon style={{color:"white", width: "1.5em", height: "1.5em"}}/>
          </div>
          <table ref={roomsList} id="rooms-list"></table>
          <div ref={participant} id="participants"></div>
        </Grid>
      </Grid>
    </div>
  );
};

export default withStyles(Styles)(Main);
