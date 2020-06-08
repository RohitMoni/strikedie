import { model } from './model-controller';
import { view } from './view';

class TicTacToeGame {
    constructor() {
        this.model = model;
        this.view = view;

        this.view.model = this.model;
        this.model.view = this.view;

        this.model.start();
        this.view.start();
    }
}

export {
    TicTacToeGame
};