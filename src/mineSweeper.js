/**
 * Represents a grid based MineSweeper game;
 * @constructor
 * @method startGame() - will start the game and create grid.
 *                     
 * @method resetGrid() - resets the grid in order to
 *                        restart the game.
 */

function MineSweeper(){
  const grid = document.getElementById('grid')
  const flagsLeft = document.getElementById('flags-left')
  const result = document.getElementById('result')
  let size = 9    // grid size.
  let bombAmount = 10 // total bombs present in the grid.
  let flagsCount = 0  // variable to account for number of cells flagged by user
  let gridIndexInformationArray = []  /*stores the information about each index of grid
                                       *that whether it is a valid index or bomb index.
                                      */
  let isGameOver = false; //boolean to check if game is over.
  let totalScore = 0; // variable to store number of correct cells clicked.

  /* function to start the game */

  this.startGame = () =>{

    createBoard();

  }

  /*
   *function to create board and make grid playable. 
  */

  const createBoard = () => {

    flagsLeft.innerHTML =`Flags Left: ${bombAmount}`;
    document.getElementById('start').style.display = "none";
  
    gridIndexInformationArray = 
            Array(size*size - bombAmount).fill('valid')
            .concat(Array(bombAmount).fill('bomb'))
            .sort(() => Math.random() - 0.5)
    
    for(let i = 0; i < size*size; i++) {
      const cell = document.createElement('div')
      cell.setAttribute('id', i)
      cell.classList.add(gridIndexInformationArray[i])
      cell.classList.add('grid-cell')
      grid.appendChild(cell)
      cell.addEventListener('click', (event) => {
        handleCellClick(cell);
      })

      cell.oncontextmenu = (event) => {
        event.preventDefault()
        handleFlaggingCell(cell)
      }
    }

    grid.style.border = "solid 1px white";
    calculateProximityBombCount();
  }

  /*
   *function to calculate bombs present in neighbours of each cell.
  */

  const calculateProximityBombCount = () => {


    for (let i = 0; i < size*size; i++) {
      let total = 0
      const isLeftEdge = (i % size === 0)
      const isRightEdge = (i % size === size -1)

      const currentCell = document.getElementById(i); 

      if (gridIndexInformationArray[i] === 'valid'){
        if ( i > 0 && !isLeftEdge && gridIndexInformationArray[i - 1] === 'bomb'){
          total++ ;
        }
        if (i > 9 && !isRightEdge && gridIndexInformationArray[i + 1 - size] === 'bomb'){
          total++;
        }
        if (i > 10 && gridIndexInformationArray[i - size] === 'bomb'){
          total++;
        }
        if (i > 11 && !isLeftEdge && gridIndexInformationArray[i - 1 - size] === 'bomb'){
          total++;
        }
        if (i < 78 && !isRightEdge && gridIndexInformationArray[i + 1] === 'bomb'){
          total++;
        }
        if (i < 70 && !isLeftEdge && gridIndexInformationArray[i - 1 + size] === 'bomb'){
          total++;
        }
        if (i < 68 && !isRightEdge && gridIndexInformationArray[i + 1 + size] === 'bomb'){
          total++;
        }
        if (i < 69 && gridIndexInformationArray[i + size] === 'bomb'){
          total++
        }

        currentCell.setAttribute('proximity-bombs-count', total);

      }
    }
  } 
  
  /**
   * function to flag/unflag a cell.
   * @param {element which is to be flagged/unflagged} cell 
   */

  const handleFlaggingCell = (cell) => {

    if (isGameOver){
      return
    }
    if (!cell.classList.contains('checked') && (flagsCount < bombAmount)) {
      if (!cell.classList.contains('flag')) {
        cell.classList.add('flag')
        cell.innerHTML ='📍'
        flagsCount++;
        flagsLeft.innerHTML = `Flag Left: ${bombAmount- flagsCount}`;
      } else {
        cell.classList.remove('flag');
        cell.innerHTML = '';
        flagsCount --;
        flagsLeft.innerHTML = `Flag Left: ${bombAmount- flagsCount}`;
      }
    }
  }
  
  /**
   * function to handle sequence of event to follow on clicking a cell.
   * @param {element (clicked cell)} cell 
   */

  const  handleCellClick = (cell) => {
    
    if (cell.classList.contains('checked') || isGameOver){
      return
    }
    cell.classList.add('checked')
    if (cell.classList.contains('bomb')) {
      gameOver();
    } else {
      totalScore++;
      let proximityBombCount = cell.getAttribute('proximity-bombs-count');
      cell.innerHTML = proximityBombCount;
      if(isWinner()){
        result.innerHTML = 'Congrats! YOU WIN!';
      }
    }
  }

  // function to render gameOver UI

  const gameOver = () =>{

    isGameOver = true;
    flagsLeft.innerHTML = "";
    result.innerHTML = `BOOM! Game Over! You scored ${totalScore}`;
    
    gridIndexInformationArray.forEach((value,index) => {
      if (value === 'bomb') {
        const cell = document.getElementById(index);
        cell.style.backgroundColor = "grey";
        cell.innerHTML = '&#128165;';
        cell.style.fontSize = "25px";
      }
    })
    document.getElementById('reset').style.display = "inline-block";
  }
    
  /*
   * functon to check win condition.
   */
  const isWinner = () => {
    if(totalScore === 71){
      isGameOver = true;
      return true;
    }else{
      return false;
    }
  }

  /**
   * method to reset the game , to make it ready for playing again.
   */

  this.resetGrid = () => {
    bombAmount = 10;
    flagsCount = 0;
    gridIndexInformationArray = [];
    isGameOver = false;
    totalScore = 0;
    document.getElementById('reset').style.display = "none";
    grid.innerHTML = "";
    flagsLeft.innerHTML = "";
    result.innerHTML = "";
    createBoard();
  }
}

let mineSweeper = new MineSweeper();