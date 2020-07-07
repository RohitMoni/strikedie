import './lobby-controller.scss';
import React from "react";

class LobbyController extends React.Component {
    render() {
        return (
            <div class="lobby-controller">
                <button class="btn btn-primary">Create Game</button>
                <button class="btn btn-primary">Join Game</button>
            </div>
        )
    }
}

export default LobbyController;