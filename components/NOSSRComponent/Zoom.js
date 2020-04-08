import { ZoomMtg } from "@zoomus/websdk";
import { useEffect } from "react";
import getConfig from 'next/config'

const Zoom = () => {

  useEffect(() => {
    const { publicRuntimeConfig } = getConfig();

    ZoomMtg.setZoomJSLib('https://source.zoom.us/1.7.4/lib', '/av');
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();
    const meetConfig = {
      apiKey: publicRuntimeConfig?.API_KEY || "", // here you need to add zoom api key
      apiSecret: publicRuntimeConfig?.API_SECRET || "", // here you need to add zoom api secret key
      meetingNumber: publicRuntimeConfig?.MEETING_NUMBER || "", //here you need to add meetingId
      userName: localStorage.getItem("username") || "admin",
      passWord: publicRuntimeConfig?.PASSWORD || "", //here you need to add meeting password
      leaveUrl: 'https://rafiky.net',
      role: 0
    };
    ZoomMtg.generateSignature({
      meetingNumber: meetConfig.meetingNumber,
      apiKey: meetConfig.apiKey,
      apiSecret: meetConfig.apiSecret,
      role: meetConfig.role,
      success(res) {
        ZoomMtg.init({
          leaveUrl: meetConfig.leaveUrl,
          showMeetingHeader: true,
          isSupportAV: true,
          isSupportChat: false,
          disableInvite: true,
          isLockBottom: false,
          isSupportQA: false,
          isSupportCC: false,
          screenShare: false,
          videoHeader: false,
          isLockBottom: false,
          isSupportNonverbal: false,
          success() {
            ZoomMtg.join(
              {
                meetingNumber: meetConfig.meetingNumber,
                userName: meetConfig.userName,
                signature: res.result,
                apiKey: meetConfig.apiKey,
                userEmail: 'info@rafiky.net',
                passWord: meetConfig.passWord,
                success() {
                  $('#nav-tool').hide();
                  console.log('join meeting success');
                },
                error(res) {
                  console.log(res);
                }
              }
            );
          },
          error(res) {
            console.log(res);
          }
        });
      }
    });
  }, [])

  return (
    <>
    </>
  )
}

export default Zoom;