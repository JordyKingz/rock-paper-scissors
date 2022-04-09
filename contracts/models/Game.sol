pragma solidity ^0.8.12;

    struct Game {
        uint Id;
        address PlayerAddress;
        GameResult Result;
        GameAction Action;
        uint Wager;
        GameState State;
        bool Exists;
    }

    enum GameResult {
        UNKNOWN,
        WIN,
        LOSE,
        TIE
    }

    enum GameAction {
        ROCK,
        PAPER,
        SCISSORS
    }

    enum GameState {
        WAGER_SET,
        RESULT_SET,
        CANCELED
    }
