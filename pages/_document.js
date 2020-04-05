import React from "react";
import Document, { Head, Main, NextScript } from "next/document";
import { ServerStyleSheets } from "@material-ui/core/styles";

export default class MyDocument extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          {/* PWA primary color */}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <link type="text/css" rel="stylesheet" href="https://source.zoom.us/1.7.2/css/bootstrap.css" />
          <link type="text/css" rel="stylesheet" href="https://source.zoom.us/1.7.2/css/react-select.css" />        </Head>
        <body>
          <Main />
          <NextScript />
          <script src="https://www.webrtc-experiment.com/DetectRTC.js"></script>
          <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
          <script src="https://source.zoom.us/1.7.2/lib/vendor/redux.min.js"></script>
          <script src="https://source.zoom.us/1.7.2/lib/vendor/redux-thunk.min.js"></script>
          <script src="https://source.zoom.us/1.7.2/lib/vendor/lodash.min.js"></script>
          <script src="https://cdn.webrtc-experiment.com/socket.io.js"> </script>
          <script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
          <script src="https://www.webrtc-experiment.com/RTCPeerConnection-v1.5.js"> </script>
          <script src="../static/broadcast.js"> </script>
          <script src="https://www.webrtc-experiment.com/commits.js" async> </script>
        </body>
      </html>
    );
  }
}

MyDocument.getInitialProps = async ctx => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props => sheets.collect(<App {...props} />)
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement()
    ]
  };
};
