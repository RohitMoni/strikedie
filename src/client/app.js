import './scss/app.scss';
import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
    render() {
        return (
            <div id="main">Test 1234</div>
        );
    }
}

let AppInstance = document.getElementById("app");

ReactDOM.render(<App />, AppInstance);