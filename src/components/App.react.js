import React from 'react';

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="application" className={appClasses}>
        <h1>App</h1>
      </div>
    );
  }
}

export default App;
