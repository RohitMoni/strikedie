import './app.scss';
import React from "react";
import ReactDOM from "react-dom";
import LobbyController from "./components/lobby-controller/lobby-controller";

class App extends React.Component {
    render() {
        return (
            <div class="main">
                <LobbyController />
            </div>
        );
    }
}

let AppInstance = document.getElementById("app");

ReactDOM.render(<App />, AppInstance);