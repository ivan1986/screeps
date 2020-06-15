var harvester = require('./actionHarvest');
var upgrader = require('./actionUpgrader');

module.exports = {
    /** @param creep {Creep} */
    run:function(creep){
        creep.profileStart();

        if(creep.room.name !== creep.memory.roomID){
            let actRes = creep.moveTo(new RoomPosition(25,25,creep.memory.roomID));
            if (actRes === OK) {
                creep.memory.action= 'traveling back ';
            }
            return;
        }

        //var carry = _.sum(creep.carry);
        let carry = creep.store.getUsedCapacity(RESOURCE_ENERGY);

        if(carry < creep.store.getCapacity() && (creep.memory.working === false || creep.memory.working === undefined)){

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
            
            if(carry === 0){
                creep.memory.working = false;
            }
            else{
                creep.memory.working = true;
                const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                if(target) {
                    if(creep.build(target) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else{
                   upgrader.run(creep);
                }
            }
        }
        creep.profileFinish();
    },
    /** @param spawn {Spawn} */
    needBuild:function(spawn){
        let str = spawn.room.find(FIND_CONSTRUCTION_SITES);
        let builders = str.length > 5 ? 3 : 1;
        return Memory.population[spawn.room.name]['builder'] < builders;
    },
    prefix: function() {return 'B';},
};
