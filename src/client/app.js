import './app.scss';
import 'regenerator-runtime/runtime'; // Need this to solve a weird parcel bug
import React from "react";
import ReactDOM from "react-dom";
import LobbyController from "./components/lobby-controller/lobby-controller";

class App extends React.Component {
    render() {
        return (
            <div className="main">
                <h1>Strike-Die</h1>
                <LobbyController />
            </div>
        );
    }
}

let AppInstance = document.getElementById("app");

ReactDOM.render(<App />, AppInstance);