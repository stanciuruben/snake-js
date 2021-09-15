// EXTERNAL FUNCTIONS
const getOppositeDirection = (direction) => {
    if(direction === "up") return "down";
    if(direction === "down") return "up";
    if(direction === "left") return "right";
    if(direction === "right") return "left";
}

// INTERFACE CONTROLLER
const IntrefaceCtrl = (function() {
    const displayCell = (x, y, type) => {
        document.getElementById(`${x}-${y}`).classList.add('cell-' + type);
    }

    const removeCell = (x, y, type) => {
        document.getElementById(`${x}-${y}`).classList.remove('cell-' + type);
    }

    const createMap = (mapDimensions) => {
        const map = document.getElementById('snake-map');
        for(let i = 0; i < mapDimensions; ++i) {
            const newRow = document.createElement("div");
            newRow.className = "row";
            for (let j = 0; j < mapDimensions; ++j) {
                const newCell = document.createElement("div");
                newCell.className = "cell";
                newCell.id = `${i}-${j}`;
                newRow.appendChild(newCell);
            }
            map.appendChild(newRow);
        }
    }

    const createApple = (mapDimensions) => {
        const appleX = Math.floor(Math.random() * mapDimensions);
        const appleY = Math.floor(Math.random() * mapDimensions);
        if (document.getElementById(`${appleX}-${appleY}`).classList.contains("cell-snake")) {
            createApple(mapDimensions);
        }
        document.getElementById(`${appleX}-${appleY}`).classList.add("cell-apple");
    }

    const updateScore = (value) => {
        document.getElementById('score').innerText = "Score: " + value;
    }

    const checkCollisions = (x, y) => {
        if (document.getElementById(`${x}-${y}`).classList.contains("cell-snake")) {
            return 'snake';
        }
        if (document.getElementById(`${x}-${y}`).classList.contains("cell-apple")) {
            return 'apple';
        }
        return 'nothing';
    }

    const showGameOver = () => {
        document.getElementById('game-over').style.opacity = 1;
    }

    return {
        displayCell: (x, y, type) => displayCell(x, y, type),
        removeCell: (x, y, type) => removeCell(x, y, type),
        createMap: (map, mapDimensions) => createMap(map, mapDimensions),
        createApple: (mapDimensions) => createApple(mapDimensions),
        updateScore: (value) => updateScore(value),
        checkCollisions: (x, y) => checkCollisions(x, y),
        showGameOver: () => showGameOver()
    };
})();

// GAME CONTROLLER
const GameCtrl = (function(IntrefaceCtrl, getOppositeDirection) {
    let snake = [[5, 5], [5, 6], [5, 7], [5, 8]],
        mapDimensions = 20,
        gameSpeed = 150,
        score = 0,
        direction = 'left',
        previousDirection = 'up',
        isRunning = true;
    

    const loadEventListener = () => {
        document.addEventListener("keydown", (e) => {
            if(e.keyCode === 38 || e.keyCode === 87) {
                direction = "up";
            }
            if(e.keyCode === 65 || e.keyCode === 37){
                direction = "left";
            }
            if(e.keyCode === 83 || e.keyCode === 40) {
                direction = "down";
            }
            if(e.keyCode === 68 || e.keyCode === 39) {
                direction = "right";
            }
        });
    }

    const makeNextMove = (x, y, direction) => {
        switch (direction) {
            case 'up': x -= 1; break;
            case 'down': x += 1; break;
            case 'left':  y -= 1; break;
            case 'right': y += 1; break;
        }
        if (x < 0) x = mapDimensions - 1;
        if (y < 0) y = mapDimensions - 1;
        if (x === mapDimensions) x = 0;
        if (y === mapDimensions) y = 0;
        snake.unshift([x, y]);
    }
    
    const setMovement = (direction) => {
        if(previousDirection === getOppositeDirection(direction)) {
            makeNextMove(snake[0][0], snake[0][1], previousDirection);
        } else {
            makeNextMove(snake[0][0], snake[0][1], direction);
            previousDirection = direction;
        }
        const snakeTouches = IntrefaceCtrl.checkCollisions(snake[0][0], snake[0][1]);
        switch(snakeTouches) {
            case 'snake': {
                isRunning = false;
                IntrefaceCtrl.showGameOver();
                break;
            }
            case 'apple': {
                IntrefaceCtrl.removeCell(snake[0][0], snake[0][1], 'apple');
                IntrefaceCtrl.displayCell(snake[0][0], snake[0][1], 'snake');
                IntrefaceCtrl.updateScore(++score);
                IntrefaceCtrl.createApple(mapDimensions);
                break;
            }
            case 'nothing': {
                IntrefaceCtrl.displayCell(snake[0][0], snake[0][1], 'snake'); 
                IntrefaceCtrl.removeCell(snake[snake.length - 1][0], snake[snake.length - 1][1], 'snake');
                snake.pop();
                break;
            }
        }
    }

    const renderSnake = () => {
        snake.forEach(cell => {
            IntrefaceCtrl.displayCell(cell[0], cell[1], 'snake');
        });
    }

    const moveSnake = () => {
        if (isRunning) {
            setMovement(direction);
            setTimeout(moveSnake, gameSpeed);
        }
    }

    return {
        start: () => {
            IntrefaceCtrl.createMap(mapDimensions);
            renderSnake();
            IntrefaceCtrl.createApple(mapDimensions);
            loadEventListener();
            moveSnake();
        }
    }
})(IntrefaceCtrl, getOppositeDirection);


// START GAME
GameCtrl.start();