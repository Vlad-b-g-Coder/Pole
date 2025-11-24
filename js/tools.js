// tools.js
class ToolManager {
    constructor(game) {
        this.game = game;
        this.selectedTool = 'shovel';
        this.toolNames = {
            'shovel': 'Лопата', 'bucket': 'Ведро', 'hoe': 'Мотыга',
            'marsh-seed': 'Семена болотника', 'potato-seed': 'Семена картошки', 'cactus-seed': 'Семена кактуса'
        };
    }

    init() {
        this.setupEventListeners();
        this.updateToolStatus();
    }

    setupEventListeners() {
        const tools = ['shovel', 'bucket', 'hoe', 'marsh-seed', 'potato-seed', 'cactus-seed'];
        tools.forEach(tool => {
            document.getElementById(tool).addEventListener('click', () => this.selectTool(tool));
        });
    }

    selectTool(tool) {
        this.selectedTool = tool;
        document.querySelectorAll('.tool-btn, .seed-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(tool).classList.add('active');
        this.updateToolStatus();
    }

    useTool(row, col) {
        const cell = this.game.getCell(row, col);
        if (!cell) return;

        switch (this.selectedTool) {
            case 'shovel': this.useShovel(cell); break;
            case 'bucket': this.useBucket(cell); break;
            case 'hoe': this.useHoe(cell); break;
            case 'marsh-seed': this.plantSeed(cell, 'marsh'); break;
            case 'potato-seed': this.plantSeed(cell, 'potato'); break;
            case 'cactus-seed': this.plantSeed(cell, 'cactus'); break;
        }

        this.updateToolStatus();
        this.game.updateMoisture();
    }

    useShovel(cell) {
        if (['earth', 'farmland'].includes(cell.type)) {
            cell.removePlant();
        } else if (cell.type === 'water') {
            this.game.convertToEarth(cell.row, cell.col);
        }
    }

    useBucket(cell) {
        if (cell.type === 'water') {
            this.game.convertToEarth(cell.row, cell.col);
        } else if (['earth', 'farmland'].includes(cell.type)) {
            this.game.convertToWater(cell.row, cell.col);
        }
    }

    useHoe(cell) {
        if (cell.type === 'earth') {
            this.game.convertToFarmland(cell.row, cell.col);
        }
    }

    plantSeed(cell, plantType) {
        if (!['earth', 'farmland'].includes(cell.type) || cell.hasPlant()) return;

        const plants = {
            'marsh': MarshPlant,
            'potato': PotatoPlant,
            'cactus': CactusPlant
        };

        if (plants[plantType]) {
            const plant = new plants[plantType]();
            cell.setPlant(plant);
            plant.checkSurvival(cell.moisture);
        }
    }

    updateToolStatus() {
        document.getElementById('current-tool').textContent = this.toolNames[this.selectedTool];
        document.getElementById('bucket-status').textContent = 'готово к работе';
        document.getElementById('bucket-status').style.color = '#27ae60';
    }
}