var upgrader = require('./actionUpgrader');

module.exports = {
    run:function(creep){

        let structure = creep.room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_TOWER && s.energy < s.energyCapacity
        });
        if (!structure) {
            return upgrader.run(creep);
        }

        let carry = creep.carry.energy;

        if(carry < creep.carryCapacity && !creep.memory.working) {

            let container = creep.room.getStorageWithEnergy(creep);

            if (container !== undefined) {
                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }
        
        }
        else{

            creep.memory.action ='transferToTower';

            let structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType === STRUCTURE_TOWER && s.energy < s.energyCapacity
            });

            let action = creep.transfer(structure, RESOURCE_ENERGY);
            if ( action === ERR_NOT_IN_RANGE) {
                creep.moveTo(structure);
            }
            else if(action === ERR_NOT_ENOUGH_RESOURCES){
                creep.memory.working = false;
            }

        }

    },
    /** @param spawn {Spawn} */
    needBuild:function(spawn){
        let towers = spawn.room.find(FIND_MY_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_TOWER
        });
        return towers.length && Memory.population[spawn.room.name]['TowerSupply'] < 1;
    },
    prefix: function() {return 'TS';},
};
