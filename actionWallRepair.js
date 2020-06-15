
module.exports = {
    run:function(creep){
        creep.profileStart();

        if(creep.room.name !== creep.memory.roomID){
            let actRes = creep.moveTo(new RoomPosition(25,25,creep.memory.roomID));
            if (actRes === OK) {
                creep.memory.action= 'traveling back ';
            }
            creep.profileFinish();
            return;
        }

        if(creep.carry.energy === creep.carryCapacity){
            creep.memory.working = true;
        }

        if(creep.carry.energy === 0 || !creep.memory.working) {
            delete creep.memory.wallID;

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
        else {
            if(!creep.doWallsRampartsRepair()){
                creep.memory.working = creep.doUpgrade();
            } else {
                creep.memory.working = true;
            }
        }
        creep.profileFinish();
    },
    /** @param spawn {Spawn} */
    needBuild:function(spawn) {
        let walls = spawn.room.find(FIND_MY_STRUCTURES, {
            filter: (s) => (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART)
        });
        return walls.length && Memory.population[spawn.room.name]['repairWall'] < 1;
    },
    prefix: function() {return 'WR';},
};
