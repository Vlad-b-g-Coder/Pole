// cells.js
class Cell {
    constructor(row, col, type = 'cell') {
        this.row = row;
        this.col = col;
        this.type = type;
        this.plant = null;
    }

    setPlant(plant) {
        this.plant = plant;
        if (plant) plant.cell = this;
        return true;
    }

    removePlant() {
        this.plant = null;
    }

    hasPlant() {
        return this.plant !== null;
    }

    update(grid) {
        if (this.plant) this.plant.grow();
    }

    render() {
        const cellElement = document.createElement('div');
        cellElement.className = `cell ${this.type}`;
        cellElement.dataset.row = this.row;
        cellElement.dataset.col = this.col;

        if (this.plant) {
            const plantElement = document.createElement('div');
            let plantClass = `plant ${this.plant.type}-plant plant-growth-${this.plant.growthStage}`;
            if (!this.plant.isAlive) plantClass += ' dead';
            plantElement.className = plantClass;
            cellElement.appendChild(plantElement);
        }

        return cellElement;
    }

    getInfo() {
        return { type: this.type, hasPlant: this.hasPlant() };
    }
}

class EarthCell extends Cell {
    constructor(row, col) {
        super(row, col, 'earth');
        this.moisture = 0.1;
    }

    calculateMoisture(grid) {
        let totalMoisture = 0.1;

        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                const cell = grid[row][col];
                if (cell.type === 'water') {
                    const distance = Math.sqrt(Math.pow(this.row - row, 2) + Math.pow(this.col - col, 2));
                    const maxDistance = 4;

                    if (distance <= maxDistance) {
                        const factor = 1 - (distance / maxDistance);
                        totalMoisture += factor * 0.8;
                    }
                }
            }
        }

        this.moisture = Math.max(0.1, Math.min(1, totalMoisture));
        if (this.plant) this.plant.checkSurvival(this.moisture);
        return this.moisture;
    }

    update(grid) {
        this.calculateMoisture(grid);
        super.update(grid);
    }

    render() {
        const cellElement = super.render();
        const red = Math.floor(240 - (this.moisture * 139));
        const green = Math.floor(230 - (this.moisture * 163));
        const blue = Math.floor(140 - (this.moisture * 107));

        cellElement.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
        cellElement.title = `Земля\nВлажность: ${Math.round(this.moisture * 100)}%\nКоординаты: ${this.row},${this.col}`;

        return cellElement;
    }

    getInfo() {
        const info = {
            type: 'Земля',
            moisture: Math.round(this.moisture * 100),
            coordinates: `${this.row}, ${this.col}`
        };
        if (this.plant) info.plant = this.plant.getInfo();
        return info;
    }
}

class FarmlandCell extends EarthCell {
    constructor(row, col) {
        super(row, col);
        this.type = 'farmland';
    }

    render() {
        const cellElement = super.render();
        cellElement.title = `Грядка\nВлажность: ${Math.round(this.moisture * 100)}%\nКоординаты: ${this.row},${this.col}`;
        return cellElement;
    }

    getInfo() {
        const info = super.getInfo();
        info.type = 'Грядка';
        return info;
    }
}

class WaterCell extends Cell {
    constructor(row, col) {
        super(row, col, 'water');
    }

    setPlant() { return false; }

    render() {
        const cellElement = super.render();
        cellElement.title = `Вода\nКоординаты: ${this.row},${this.col}`;
        return cellElement;
    }

    getInfo() {
        return { type: 'Вода', coordinates: `${this.row}, ${this.col}` };
    }
}