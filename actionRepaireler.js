var harvester = require('./actionHarvest');

module.exports = {
    run:function(creep){
        creep.profileStart();

        if(creep.carry.energy === creep.carryCapacity){
            creep.memory.working = true;
        }

        if(creep.carry.energy === 0 || !creep.memory.working){

            let container = creep.room.getStorageWithEnergy(creep);
            if (container !== undefined) {
                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }
            else{
                harvester.run(creep);
            }
        }
        else{
            if(!creep.doRepair()){
                if(!creep.doBuild()){
                    creep.memory.working = creep.doUpgrade();
                }
                else{
                    creep.memory.working = true;
                    creep.profileFinish();
                }
            }
            else{
                creep.profileFinish();
                creep.memory.working = true;
            }
        }
        creep.profileFinish();
    },
    /** @param spawn {Spawn} */
    needBuild:function(spawn){
        return Memory.population[spawn.room.name]['repair'] < 1;
    },
    prefix: function() {return 'R';},
};
