import './lobby-controller.scss';
import React from "react";

var lobbyStates = {
    NONE: 'none',
    CREATED: 'hosting',
    JOINED: 'joined',
}

class LobbyController extends React.Component {
    static defaultProps = {
        'currentState': lobbyStates.NONE,
    }

    constructor(props) {
        super(props);
        this.state = {
            currentState: props.currentState,
        }
    }

    render() {
        switch (this.state.currentState) {
            case lobbyStates.NONE:
                return (
                    <div className="lobby-controller">
                        <button className="btn btn-primary" onClick={this.onCreateGameClicked}>Create Game</button>
                        <button className="btn btn-primary" onClick={this.onJoinGameClicked}>Join Game</button>
                    </div>
                )
            case lobbyStates.CREATED:
                return (
                    <div className="lobby-controller">
                        <p>Game Created</p>
                        <button className="btn btn-primary" onClick={this.onBackClicked}>Back</button>
                    </div>
                )
            case lobbyStates.JOINED:
                return (
                    <div className="lobby-controller">
                        <p>Game Joined</p>
                        <button className="btn btn-primary" onClick={this.onBackClicked}>Back</button>
                    </div>
                )
        }
    }

    onCreateGameClicked = () => {
        this.setState({currentState: lobbyStates.CREATED});
    }

    onJoinGameClicked = () => {
        this.setState({ currentState: lobbyStates.JOINED });
    }

    onBackClicked = () => {
        this.setState({ currentState: lobbyStates.NONE });
    }
}

export default LobbyController;