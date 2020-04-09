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
import getConfig from 'next/config'
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';

const Main = ({ classes }) => {
  const participant = useRef(null);
  const [config, setConfig] = useState({});
  const roomsList = useRef(null);
  const [broadcastUI, setBroadcastUI] = useState(null);
  const [isBroadcastPlay, setBroadcastPlay] = useState(false);
  const listen = useRef(null);
  const [open, setOpen] = React.useState(false);
  const [isFound, setFound] = useState("");
  const [roomDetails, setRoomDetails] = useState(null);
  const [isPaused, setPaused] = useState(false);

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
  const { publicRuntimeConfig } = getConfig();
  const SIGNALING_SERVER = publicRuntimeConfig.NODE_ENV === "production" ? `${window?.location?.origin}/` : "http://localhost:3000/";
  const socket = io(SIGNALING_SERVER + config.channel);

  useEffect(() => {
    const data = {
      openSocket: function (config) {
        const { publicRuntimeConfig } = getConfig();
        const SIGNALING_SERVER = publicRuntimeConfig.NODE_ENV === "production" ? `${window?.location?.origin}/` : "http://localhost:3000/";
        const socket = io(SIGNALING_SERVER + config.channel);
        var sender = Math.round(Math.random() * 999999999) + 999999999;

        io(SIGNALING_SERVER).emit('new-channel', {
          channel: config.channel,
          sender: sender
        });
        config.channel = config.channel || "rafikyRadio9856";

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
        console.log("YAHA PAR MASLA HY")
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
    socket.on('message', (data) => {
      console.log(data);
      if (data?.isClose && localStorage.getItem('role').toString() === "participant") {
        const li = document.getElementsByTagName("li");
        [...li].map((val) => {
          const broadcaster = val.getAttribute("data-broadcaster");
          const roomToken = val.getAttribute("data-roomtoken");

          if (broadcaster === data.broadcaster && roomToken === data.roomToken) {
            console.log(roomToken);
            val.remove();
          }
        })
      }
    });
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
    audio.setAttribute('controls', false);

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
        }, (value) => {
          setRoomDetails(value)
        });
      });
    })
    handleClose();
  }

  const stopBroadcast = () => {
    const audio = document.getElementsByTagName("audio")[0];
    if (audio) {
      audio.srcObject.getTracks()[0].stop();
      broadcastUI.leaveRoom(roomDetails, socket);
      audio.remove()
      setBroadcastPlay(false)
    }
  }


  useEffect(() => {
    if (isFound && localStorage.getItem('role').toString() === "participant") {
      var li = document.createElement('li');
      li.innerHTML = renderToString(<>
        <PlayCircleOutlineIcon style={{ marginRight: 10, width: "1.3em", height: "1.3em" }} />
        <span style={{ fontSize: 14 }}>{`Channel: ${isFound.roomName}`}</span></>)
      roomsList.current.appendChild(li);
      li.setAttribute('data-broadcaster', isFound.broadcaster);
      li.setAttribute('data-roomToken', isFound.roomToken);
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

  const mute = () => {
    const audio = document.getElementsByTagName("audio")[0];
    audio.srcObject.getTracks().forEach(t => t.enabled = !t.enabled);
    setPaused(!isPaused)
  };

  const isParticipate = localStorage.getItem('role').toString() === "participant";

  return (
    <div>
      <Nav />
      <Dialog setupNewBroadcast={setupNewBroadcast} open={open} handleClickOpen={handleClickOpen} handleClose={handleClose} />
      <Grid container spacing={12}>
        <Grid item xs={8}>
          <iframe frameBorder="0" style={{ width: "90%", height: 450, marginTop: 20, marginLeft: 20 }} src="/zoom" />
        </Grid>
        <Grid style={{ position: "relative" }} item xs={4}>
          {!isParticipate ? <div className={classes.interpreter} >
            {isBroadcastPlay ? <div style={{ display: "flex" }}>
              <div onClick={mute} className={classes.black} style={{ marginRight: 5 }}>
                {isPaused ? <PlayCircleOutlineIcon style={{ color: "white", width: "1.5em", height: "1.5em" }} /> : <PauseCircleOutlineIcon style={{ color: "white", width: "1.5em", height: "1.5em" }} />}
              </div>
              <div onClick={stopBroadcast} className={classes.black}>
                <StopIcon style={{ color: "white", width: "1.5em", height: "1.5em" }} />
              </div></div> : <div className={classes.micSection} onClick={handleClickOpen}>
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
