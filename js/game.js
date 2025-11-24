// game.js
class Game {
    constructor(rows = 10, cols = 10) {
        this.rows = rows;
        this.cols = cols;
        this.grid = [];
        this.toolManager = new ToolManager(this);
        this.isInitialized = false;
        this.gameLoopInterval = null;
        this.selectedCell = null;
    }

    init() {
        this.createGrid();
        this.renderGrid();
        this.toolManager.init();
        this.isInitialized = true;
        this.startGameLoop();
    }

    createGrid() {
        for (let row = 0; row < this.rows; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col] = new EarthCell(row, col);
            }
        }
        this.updateMoisture();
    }

    updateMoisture() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = this.grid[row][col];
                if (cell.type === 'earth' || cell.type === 'farmland') {
                    cell.calculateMoisture(this.grid);
                }
            }
        }
    }

    renderGrid() {
        const gridElement = document.getElementById('grid');
        gridElement.innerHTML = '';

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cellElement = this.grid[row][col].render();
                cellElement.addEventListener('click', () => this.handleCellClick(row, col));
                gridElement.appendChild(cellElement);
            }
        }
    }

    handleCellClick(row, col) {
        this.selectedCell = this.grid[row][col];
        this.toolManager.useTool(row, col);
        this.renderGrid();
        this.updateInfoPanel(row, col);
    }

    updateInfoPanel(row, col) {
        const cell = this.grid[row][col];
        const cellInfoElement = document.getElementById('cell-info');
        const plantInfoElement = document.getElementById('plant-info');
        const moistureIndicator = document.getElementById('moisture-indicator');

        const cellInfo = cell.getInfo();
        let cellInfoHTML = `<p><strong>Тип:</strong> ${cellInfo.type}</p>`;

        if (cellInfo.moisture !== undefined) {
            cellInfoHTML += `<p><strong>Влажность:</strong> ${cellInfo.moisture}%</p>`;
        }

        if (cellInfo.coordinates) {
            cellInfoHTML += `<p><strong>Координаты:</strong> ${cellInfo.coordinates}</p>`;
        }

        cellInfoElement.innerHTML = cellInfoHTML;

        if (cellInfo.moisture !== undefined) {
            moistureIndicator.textContent = `${cellInfo.moisture}%`;
        } else {
            moistureIndicator.textContent = '0%';
        }

        if (cellInfo.plant) {
            const plantInfo = cellInfo.plant;
            let plantInfoHTML = `<p><strong>Растение:</strong> ${plantInfo.type}</p>`;
            plantInfoHTML += `<p><strong>Стадия роста:</strong> ${plantInfo.growthStage}/${plantInfo.maxGrowthStage}</p>`;
            plantInfoHTML += `<p><strong>Состояние:</strong> ${plantInfo.isAlive ? '✅ Живое' : '❌ Погибло'}</p>`;
            plantInfoHTML += `<p><strong>Диапазон влажности:</strong> ${plantInfo.moistureRange.min}% - ${plantInfo.moistureRange.max}%</p>`;

            if (!plantInfo.isAlive) {
                plantInfoHTML += `<p><em>Растение погибло из-за неподходящей влажности</em></p>`;
            } else if (!plantInfo.suitableMoisture) {
                plantInfoHTML += `<p><em>⚠️ Внимание: текущая влажность не подходит для этого растения!</em></p>`;
            }

            plantInfoElement.innerHTML = plantInfoHTML;
        } else {
            plantInfoElement.innerHTML = '<p>Растение не посажено</p>';
        }
    }

    convertToFarmland(row, col) {
        if (this.grid[row][col].type === 'earth') {
            const newFarmland = new FarmlandCell(row, col);
            newFarmland.moisture = this.grid[row][col].moisture;
            this.grid[row][col] = newFarmland;
        }
    }

    convertToWater(row, col) {
        if (this.grid[row][col].type === 'earth' || this.grid[row][col].type === 'farmland') {
            this.grid[row][col] = new WaterCell(row, col);
        }
    }

    convertToEarth(row, col) {
        if (this.grid[row][col].type === 'water') {
            this.grid[row][col] = new EarthCell(row, col);
        }
    }

    startGameLoop() {
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
        }

        this.gameLoopInterval = setInterval(() => {
            this.gameLoop();
        }, 2000);
    }

    gameLoop() {
        if (this.isInitialized) {
            for (let row = 0; row < this.rows; row++) {
                for (let col = 0; col < this.cols; col++) {
                    this.grid[row][col].update(this.grid);
                }
            }

            this.renderGrid();

            if (this.selectedCell) {
                this.updateInfoPanel(this.selectedCell.row, this.selectedCell.col);
            }
        }
    }

    getCell(row, col) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            return this.grid[row][col];
        }
        return null;
    }

    stop() {
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
        }
        this.isInitialized = false;
    }
}