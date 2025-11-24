// plants.js
class Plant {
    constructor(type, moistureRange, growthRate = 1) {
        this.type = type;
        this.moistureRange = moistureRange;
        this.growthRate = growthRate;
        this.growthStage = 0;
        this.maxGrowthStage = 3;
        this.isAlive = true;
        this.cell = null;
    }

    grow() {
        if (this.isAlive && this.growthStage < this.maxGrowthStage && this.cell) {
            const moisture = this.cell.moisture;
            if (moisture >= this.moistureRange.min && moisture <= this.moistureRange.max) {
                this.growthStage = Math.min(this.maxGrowthStage, this.growthStage + this.growthRate);
            }
        }
    }

    checkSurvival(moisture) {
        this.isAlive = !(moisture < this.moistureRange.min || moisture > this.moistureRange.max);
    }

    getDisplayName() {
        const names = { 'marsh': 'Болотник', 'potato': 'Картошка', 'cactus': 'Кактус' };
        return names[this.type] || this.type;
    }

    isSuitableMoisture() {
        return this.cell && ['earth', 'farmland'].includes(this.cell.type) &&
            this.cell.moisture >= this.moistureRange.min &&
            this.cell.moisture <= this.moistureRange.max;
    }

    getInfo() {
        return {
            type: this.getDisplayName(),
            growthStage: this.growthStage,
            maxGrowthStage: this.maxGrowthStage,
            isAlive: this.isAlive,
            moistureRange: {
                min: Math.round(this.moistureRange.min * 100),
                max: Math.round(this.moistureRange.max * 100)
            },
            suitableMoisture: this.isSuitableMoisture()
        };
    }
}

class MarshPlant extends Plant {
    constructor() { super('marsh', { min: 0.7, max: 1.0 }, 0.8); }
}

class PotatoPlant extends Plant {
    constructor() { super('potato', { min: 0.4, max: 0.8 }, 1); }
}

class CactusPlant extends Plant {
    constructor() { super('cactus', { min: 0.0, max: 0.3 }, 1.2); }
}