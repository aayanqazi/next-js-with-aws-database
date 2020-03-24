import { ZoomMtg } from "@zoomus/websdk";
import { useEffect } from "react";
require("dotenv").config();

const Zoom = () => {

  useEffect(() => {
    ZoomMtg.setZoomJSLib('https://jssdk.zoomus.cn/1.7.2/lib', '/av');
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();

    const meetConfig = {
      apiKey: process.env.API_KEY,
      apiSecret: process.env.API_SECRET,
      meetingNumber: "847304408",
      userName: "Admin",
      passWord: '956012',
      leaveUrl: 'http://zoom.us/',
      role: 0
    };
    const signature = ZoomMtg.generateSignature({
      meetingNumber: meetConfig.meetingNumber,
      apiKey: meetConfig.apiKey,
      apiSecret: meetConfig.apiSecret,
      role: meetConfig.role,
      success: function (res) {
        console.log(res.result);
      }
    });

    ZoomMtg.init({
      leaveUrl: '/',
      isSupportAV: true,
      success: function () {
        ZoomMtg.join(
          {
            meetingNumber: meetConfig.meetingNumber,
            userName: meetConfig.userName,
            signature: signature,
            apiKey: meetConfig.apiKey,
            userEmail: 'email@gmail.com',
            passWord: meetConfig.passWord,
            success: function (res) {
              $('#nav-tool').hide();
              console.log('join meeting success');
            },
            error: function (res) {
              console.log(res);
            }
          }
        );
      },
      error: function (res) {
        console.log(res);
      }
    });
  }, [])

  return (
    <>
    </>
  )
}

export default Zoom;