import React from 'react';
import { renderToString } from 'react-dom/server';
import consts from 'consts';
import config from 'config';

const { APP_NAME, APP_DOM_CONTAINER } = consts;
const { BASE_URL } = config;

function Html(props) {
  const { component } = props;
  const initialState = JSON.stringify(props.initialState);
  const configs = JSON.stringify(config);

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <title>{ APP_NAME }</title>
        <link rel="icon" href={"/assets/img/favicon.ico"} />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Roboto:100,100italic,400,300,300italic,400italic,500,500italic,700,700italic" rel="stylesheet" type="text/css" />
        <link rel="stylesheet" href={ BASE_URL + '/assets/css/style.css'} />
        <script dangerouslySetInnerHTML={{ __html: 'window.__INITIAL_STATE__ = ' + initialState + '; window.__CONFIG__ = ' + configs }}></script>
      </head>
      <body>
        <div id={ APP_DOM_CONTAINER } dangerouslySetInnerHTML={{ __html: renderToString(component) }}></div>
      </body>
    </html>
  );
}

Html.propTypes = {
  initialState: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired,
};

export default Html;
