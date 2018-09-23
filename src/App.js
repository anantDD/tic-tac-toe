import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

function Square(props) {
  return (
    <button className={"square " + props.winningSquare} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let styleWinSquare = "";
    if (this.props.winner) {
      if (this.props.winner.indexOf(i) > -1) {
        styleWinSquare = "winning-square";
      }
    }
    return (
      <Square
        value={this.props.squares[i]}
        key={i}
        onClick={() => this.props.onClick(i)}
        winningSquare={styleWinSquare}
      />
    );
  }

  render() {
    let rows = [];
    let cells = [];
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        cells.push(this.renderSquare(3 * x + y));
      }
      let l = rows.length;
      rows.push(
        <div className="board-row" key={x}>
          {cells}
        </div>
      );
      cells = [];
    }

    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          xisnext: true
        }
      ],
      xisnext: true,
      stepNumber: 0,
      toggle: false
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(i) {
    let history = this.state.history.slice(0, this.state.stepNumber + 1);
    let current = history[this.state.stepNumber];
    let squares = [...current.squares];
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    let value = "X";
    if (!current.xisnext) {
      value = "O";
    }
    squares[i] = value;
    this.setState({
      history: history.concat([
        {
          squares: squares,
          rowcol: i,
          xisnext: !current.xisnext
        }
      ]),
      stepNumber: this.state.stepNumber + 1
    });
  }

  render() {
    let history = this.state.history;
    let current = history[this.state.stepNumber];
    let status;
    let winner = calculateWinner(current.squares);
    if (winner) {
      status = "Winner is: " + winner.victor;
    } else if (current.squares.indexOf(null) == -1) {
      status = "It's a draw";
    } else {
      status = "Next player: " + (current.xisnext ? "X" : "O");
    }

    let moves = history.map((value, index) => {
      return (
        <li key={index}>
          <button
            onClick={() => {
              this.setState({
                stepNumber: index
              });
            }}
            className={this.state.stepNumber == index ? "current-move" : ""}
          >
            Move #{index}:{" "}
            {index == 0 ? `Game Begins   ` : printCoordinates(value)}
          </button>
        </li>
      );
    });

    if (this.state.toggle) {
      moves.reverse();
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => {
              console.log(this);
              this.handleClick(i);
            }}
            winner={winner ? winner.winningSquares : null}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          {console.log(moves)}
          <ul className="Moves">{moves}</ul>
          <button
            onClick={() => {
              console.log(this);
              this.setState({
                toggle: !this.state.toggle
              });
            }}
          >
            TOGGLE
          </button>
        </div>
      </div>
    );
  }
}
function calculateWinner(squares) {
  let lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 9],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    let [a, b, c] = lines[i];
    if (squares[a] && squares[a] == squares[b] && squares[a] == squares[c]) {
      return {
        victor: squares[a],
        winningSquares: lines[i]
      };
    }
  }
  return null;
}

function getRow(value) {
  let row = Math.floor(value / 3);
  return row + 1;
}

function getColumn(value) {
  let column = value % 3;
  return column + 1;
}

function printCoordinates(value) {
  return (
    (value.xisnext ? "O " : "X ") +
    `placed at (${getRow(value.rowcol)},${getColumn(value.rowcol)}) `
  );
}
function printNextPlayer(value) {
  let current = value;
  let status;
  let winner = calculateWinner(current.squares);
  if (winner) {
    status = "Winner is: " + winner.victor;
  } else if (current.squares.indexOf(null) == -1) {
    status = "It's a draw";
  } else {
    status = "Next player: " + (current.xisnext ? "X" : "O");
  }
  return status;
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Tic Tac Toe using React</h1>
        </header>
        <Game />
      </div>
    );
  }
}

export default App;
