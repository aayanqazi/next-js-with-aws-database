import React, { useEffect, useRef, useState } from "react";
import Nav from "../nav";
import dynamic from 'next/dynamic';
import io from "socket.io-client";
import Grid from '@material-ui/core/Grid';
import MicRoundedIcon from '@material-ui/icons/MicRounded';
import Styles from "./style";
import { withStyles } from "@material-ui/styles";
import StopIcon from '@material-ui/icons/Stop';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import Dialog from "../Dialog/Dialog";
import { renderToString } from "react-dom/server";

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
  const [isBroadcastPlay, setBroadcastPlay] = useState(false);
  const listen = useRef(null);
  const [open, setOpen] = React.useState(false);
  const [isFound, setFound] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const rotateAudio = (audio) => {
    audio.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(0deg)';
    setTimeout(() => {
      audio.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(360deg)';
    }, 1000);
  }

  useEffect(() => {
    const data = {
      openSocket: function (config) {
        var SIGNALING_SERVER = 'http://192.168.1.101:9559/';

        config.channel = config.channel || "rafikyRadio9856";
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
      onRemoteStream: function (htmlElement) {
        listen.current.insertBefore(htmlElement, listen?.current.firstChild);
      },

      onRoomFound: (room) => {
        var alreadyExist = document.querySelector('li[data-broadcaster="' + room.broadcaster + '"]');
        if (alreadyExist) return;
        if (!isBroadcastPlay && localStorage.getItem('role').toString() === "participant") {
          if (typeof roomsList.current === 'undefined') roomsList = document.body;
          setFound(room)
        }
      },
      onNewParticipant: function (numberOfViewers) {
        document.title = 'Viewers: ' + numberOfViewers;
      },
      onReady: function () {
        console.log('now you can open or join rooms');
      }
    }
    setConfig(data);
  }, []);

  useEffect(() => {
    if (config.openSocket) {
      var broadcastUI = broadcast(config);
      setBroadcastUI(broadcastUI);
    }
  }, [config]);

  const captureUserMedia = (callback) => {
    var audio = document.createElement('audio');
    audio.setAttribute('autoplay', true);
    audio.setAttribute('controls', true);

    audio.muted = true;
    audio.volume = 0;
    if (window.DetectRTC.hasMicrophone !== true) {
      alert('DetectRTC library is unable to find microphone; maybe you denied microphone access once and it is still denied or maybe microphone device is not attached to your system or another app is using same microphone.');
    }

    participant?.current.insertBefore(audio, participant.current.firstChild)

    var mediaConfig = {
      video: audio,
      constraints: { audio: true, video: false },
      onsuccess: (stream) => {
        config.attachStream = stream;
        setConfig({
          ...config,
          attachStream: stream
        })
        callback && callback();
        audio.muted = true;
        audio.volume = 0;
        rotateAudio(audio);
        setBroadcastPlay(true)
      },
      onerror: (e) => {
        console.log(e)
        alert('unable to get access to your microphone');
      }
    };
    window.getUserMedia(mediaConfig);
  }

  const setupNewBroadcast = (value) => {
    window.DetectRTC.load(function () {
      captureUserMedia(() => {
        broadcastUI.createRoom({
          roomName: value || 'Anonymous',
          isAudio: true
        });
      });
    })
    handleClose();
  }


  useEffect(() => {
    if (isFound && localStorage.getItem('role').toString() === "participant") {
      var li = document.createElement('li');
      li.innerHTML = renderToString(<>
        <PlayCircleOutlineIcon style={{ marginRight: 10, width: "1.3em", height: "1.3em" }} />
        <span style={{ fontSize: 14 }}>{`Channel: ${isFound.roomName}`}</span></>)
      roomsList.current.appendChild(li);
      li.setAttribute('data-broadcaster', isFound.broadcaster);
      li.setAttribute('data-roomToken', isFound.broadcaster);
      li.onclick = () => {
        li.disabled = true;
        var broadcaster = li.getAttribute('data-broadcaster');
        var roomToken = li.getAttribute('data-roomToken');
        broadcastUI.joinRoom({
          roomToken: roomToken,
          joinUser: broadcaster
        });
      }
    }
  }, [isFound]);

  const isParticipate = localStorage.getItem('role').toString() === "participant";
  return (
    <div>
      <Nav />
      <Dialog setupNewBroadcast={setupNewBroadcast} open={open} handleClickOpen={handleClickOpen} handleClose={handleClose} />
      <Grid container spacing={12}>
        <Grid item xs={8}>
          <Zoom />
        </Grid>
        <Grid style={{ position: "relative" }} item xs={4}>
          {!isParticipate ? <div className={classes.interpreter} >
            {isBroadcastPlay ? <div className={classes.black}>
              <StopIcon style={{ color: "white", width: "1.5em", height: "1.5em" }} />
            </div> : <div className={classes.micSection} onClick={handleClickOpen}>
                <MicRoundedIcon style={{ color: "white", width: "1.9em", height: "1.9em" }} />
              </div>}
            <div ref={participant} id="participants"></div>
          </div> : <div className={classes.participants} >
              <ul ref={roomsList} className={classes.roomList} id="rooms-list">
              </ul>
              <div ref={listen} />
            </div>}
        </Grid>
      </Grid>
    </div>
  );
};

export default withStyles(Styles)(Main);
