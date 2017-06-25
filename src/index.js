import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
    let className = "square";
    className += props.isPartOfWinner ? " winningSquare" : "";
    return (
      <button className={className} onClick={props.onClick}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]} 
        onClick = {() => this.props.onClick(i)}
        key = {i}
        isPartOfWinner = {this.isPartOfWinningLine(i)}
      />
    );
  }

  isPartOfWinningLine(i) {
    return this.props.winningLine && this.props.winningLine.indexOf(i) !== -1;
  }

  renderRow(rowNum) {
    let rowSquares = [];
    for(let colNum = 0; colNum < 3; colNum += 1) {
      rowSquares.push(this.renderSquare(rowNum * 3 + colNum));
    }

    return (
      <div className="board-row" key = {rowNum}>
        {rowSquares}
      </div>
    );
  }

  render() {
    let boardRows = [];
    for(let rowNum = 0; rowNum < 3; rowNum += 1) {
      boardRows.push(this.renderRow(rowNum));
    }

    return (
      <div>
       {boardRows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      xIsNext: true,
      stepNum: 0,
      showMovesInReverse: false
    }
  }

  handleBoardClick(i) {
    const history = this.state.history.slice(0, this.state.stepNum + 1);
    const current = history[history.length - 1];

    const squares = current.squares.slice();
    if(!calculateWinner(squares) && !squares[i]) {
      squares[i] = this.state.xIsNext ? "X" : "O";
    
      this.setState({
        history: history.concat([{
          squares: squares
        }]),
        xIsNext: !this.state.xIsNext,
        stepNum: history.length
      });
    }
  }

  jumpTo(moveNum) {
    this.setState({
      stepNum: moveNum,
      xIsNext: !Boolean(moveNum % 2)
    })
  }

  handleToggle() {
    this.setState({
      showMovesInReverse: !this.state.showMovesInReverse
    });
  }

  render() {
    const toggleText = `${this.state.showMovesInReverse ? "Ascending" : "Descending"}`;
    const history = this.state.history
    const current = history[this.state.stepNum];

    let status;
    const winningLine = calculateWinner(current.squares);

    if(winningLine) {
      const winningPlayer = current.squares[winningLine[0]];
      status = `Winner: ${winningPlayer}`;
    }
    else {
      status = `Next Player: ${this.state.xIsNext ? "X" : "O"}`;
    }

    let moves = history.map((boardStatus, moveNum) => {
      const desc = moveNum ? `Move #${moveNum}` : "Game Start";
      const itemClass = moveNum === this.state.stepNum ? "selectedMove" : "";

      return (
        <li key={moveNum} >
          <a href="#" className = {itemClass} onClick = {() => this.jumpTo(moveNum)}>{desc}</a>
        </li>
      );
    });

    if(this.state.showMovesInReverse)
      moves = moves.reverse();

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick = {(i) => this.handleBoardClick(i)}
            winningLine = {winningLine}
          />
        </div>  
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <button onClick = {() => this.handleToggle()}>{toggleText}</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

