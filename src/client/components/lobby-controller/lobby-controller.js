import './lobby-controller.scss';
import React from "react";

var lobbyStates = {
    NONE: 'none',
    CREATED: 'hosting',
    JOINING: 'joining',
}

var lobbyServerIp = 'http://localhost';
var lobbyServerPort = 1234;

class LobbyController extends React.Component {
    static defaultProps = {
        'currentState': lobbyStates.NONE,
    }

    constructor(props) {
        super(props);
        this.state = {
            currentState: props.currentState,
        };
    }

    render() {
        switch (this.state.currentState) {
            case lobbyStates.NONE:
                return (
                    <div className="lobby-controller">
                        <button className="main-button btn btn-primary" onClick={this.onCreateGameClicked}>Create Game</button>
                        <button className="main-button btn btn-primary" onClick={this.onJoinGameClicked}>Join Game</button>
                    </div>
                )
            case lobbyStates.CREATED:
                return (
                    <div className="lobby-controller">
                        <p>Game Created</p>
                        <button className="main-button btn btn-primary" onClick={this.onBackClicked}>Back</button>
                    </div>
                )
            case lobbyStates.JOINING:
                return (
                    <div className="lobby-controller">
                        <p>Input Game URL</p>
                        <div className="game-url-container">
                            <input id="game-url" type="url" className="game-url-input" onKeyPress={this.openUrlHotkey}></input>
                            <button className="game-url-join-button btn btn-primary" onClick={this.openUrlJoinGame}>Join</button>
                        </div>
                        <button className="main-button btn btn-primary" onClick={this.onBackClicked}>Back</button>
                    </div>
                );
        }
    }

    onCreateGameClicked = () => {
        this.requestCreateGame().then(this.setState({ currentState: lobbyStates.CREATED }));
    }

    requestCreateGame = async () => {
        const response = await fetch(`${lobbyServerIp}:${lobbyServerPort}/create-room`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
        });
        const result = await response.json();
        console.log(result);
    }

    onJoinGameClicked = () => {
        this.setState({ currentState: lobbyStates.JOINING });
    }

    openUrlHotkey = (e) => {
        if (e.key === 'Enter') {
            this.openUrlJoinGame();
        }
    }

    openUrlJoinGame = () => {
        var url = document.getElementById("game-url").value;
        window.open(url);
    }

    onBackClicked = () => {
        this.setState({ currentState: lobbyStates.NONE });
    }
}

export default LobbyController;