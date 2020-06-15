/**
 *
 * @param {Creep} creep
 * @returns {Structure}
 */
Room.prototype.getStorageWithEnergy = function(creep) {
    let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: s => ((s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE ) &&
            s.store[RESOURCE_ENERGY] > 0) || (s.structureType === STRUCTURE_LINK && s.energy > 0)
    });

    if (!container && this.energyAvailable === this.energyCapacityAvailable) {
        container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s => (s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION )
        });
    }

    return container;
};

    /**
 *
 */
Room.prototype.getSourcesInfo = function() {
    if (!this.memory.sourcesInfo) {
        this.memory.sourcesInfo = this._calculateSourcesInfo();
    }
    return this.memory.sourcesInfo;
}

/**
 * @param {string} sourceId
 * @param {string} harvesterName
 */
Room.prototype.linkHarvesterToSource = function(sourceId, harvesterName) {
    this.memory.sourcesInfo[sourceId].linked[harvesterName] = 1;
}

Room.prototype.getFreeSourceId = function() {
    if (!this.memory.sourcesInfo) {
        this.memory.sourcesInfo = this._calculateSourcesInfo();
    }
    for (let s in this.memory.sourcesInfo) {
        let source = this.memory.sourcesInfo[s];
        let linked = 0;
        for (let harvesterName in source.linked) {
            if (!Game.creeps[harvesterName]) {
                delete source.linked[harvesterName];
                continue;
            }
            linked++;
        }
        if (linked < source.max) {
            return s;
        }
    }
    return null;
}

Room.prototype._calculateSourcesInfo = function() {
    if (!this.memory.sourcesInfo) {
        this.memory.sourcesInfo = {};
    }

    let sources = this.find(FIND_SOURCES);
    for (let id in sources) {
        let source = sources[id];
        if (!this.memory.sourcesInfo[source.id]) {
            this.memory.sourcesInfo[source.id] = {
                max: 0,
                linked: {},
            };
        }
        this.memory.sourcesInfo[source.id].max = 0;
        for (let x = source.pos.x - 1 ; x <= source.pos.x + 1 ; x++)
            for (let y = source.pos.y - 1 ; y <= source.pos.y + 1 ; y++)
            {
                let terran = this.getTerrain().get(x, y);
                if (terran !== TERRAIN_MASK_WALL && terran !== TERRAIN_MASK_LAVA) {
                    this.memory.sourcesInfo[source.id].max++;
                }
            }
    }

    return this.memory.sourcesInfo;
}
