import { TurnOrder } from "boardgame.io/core";

// Returns a random integer from [0, max)
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export const TicTacToe = {
  setup: () => ({
    timeline: Array(12).fill([]),
    action_phase_turn_order: []
  }),

  phases: {
    rollDicePhase: {
      start: true,
      next: "actionPhase",

      moves: {
        rollDice: (G, ctx, dice_size) => {
          var dice_result = getRandomInt(dice_size);

          var insert_idx = -1;
          G.timeline[dice_result].forEach(function(item, idx, array) {
            if (dice_size > item.dice_size) {
              insert_idx = idx;
            }
          });

          G.timeline[dice_result].splice(insert_idx+1, 0, {
            player: ctx.currentPlayer,
            dice_size: dice_size
          });
        }, // rollDice
      }, // moves

      onEnd: (G, ctx) => {
        G.action_phase_turn_order = [];
        G.timeline.forEach(function(time, time_idx, time_array) { 
          time.forEach(function(slot, slot_idx, slot_array) {
            G.action_phase_turn_order.push(slot.player);
          });
        });
      }, // onEnd
    }, // rollDicePhase

    actionPhase: {
      turn: {
        order: TurnOrder.CUSTOM_FROM('action_phase_turn_order'),
        moveLimit: 1,
      },
      moves: {
        noopAction: (G, ctx) => {
        }
      }
    }
  },
};
