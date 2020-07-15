import './lobby-controller.scss';
import React from "react";

var lobbyStates = {
    NONE: 'none',
    CREATED: 'hosting',
    JOINING: 'joining',
}

const lobbyServerIp = 'http://localhost';
const lobbyServerPort = 3000;

function getJoinGameUrlFromRoomCode(roomCode) {
    return `${lobbyServerIp}:${lobbyServerPort}/join/${roomCode}`;
}

class LobbyController extends React.Component {
    static defaultProps = {
        'currentState': lobbyStates.NONE,
        'roomCode': null,
        'gameUrl': null,
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
                const renderGameCreatedText = () => {
                    return (
                        <div>
                            <p id="gameUrlText">Game URL: {this.state.gameUrl}</p>
                        </div>
                    )
                }

                return (
                    <div className="lobby-controller">
                        {renderGameCreatedText()}
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
        this.requestCreateGame();
    }

    requestCreateGame = () => {
        fetch(`${lobbyServerIp}:${lobbyServerPort}/create-room`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
        })
        .then(response => response.json())
        .then((result) => {
            console.log(result);
            this.setState({ 
                currentState: lobbyStates.CREATED,
                roomCode: result.roomCode,
                gameUrl: getJoinGameUrlFromRoomCode(result.roomCode), 
            });
            console.log(`Created game: ${getJoinGameUrlFromRoomCode(this.state.roomCode)}`);
        })
        .catch(console.log);
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
