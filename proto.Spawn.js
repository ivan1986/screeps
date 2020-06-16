var actions = {
    harvester: require('./actionHarvest'),
    upgrader: require('./actionUpgrader'),
    builder: require('./actionBuilder'),
    repair: require('./actionRepaireler'),
    repairWall: require('./actionWallRepair'),
    TowerSupply: require('./actionTowerSupply'),
    harvesterLD: require('actionHarvestLD'),
    lorry: require('./actionLorry')
};

/**
 * контроль рождаемости крипов
 */
StructureSpawn.prototype.populationControl = function () {

    //region контроль популяции

    if(Memory.population === undefined){
        Memory.population = {};
    }


    if (Memory.population[this.room.name] === undefined) {
        Memory.population[this.room.name] = {};
    }

    for (let role in actions) {
        if (Memory.population[this.room.name][role] === undefined) {
            Memory.population[this.room.name][role] = 0;
        }
    }

    //endregion

    for (let name in Memory.creeps) {

        if (Game.creeps[name] === undefined) {
            Memory.population[this.room.name][Memory.creeps[name].role]--;

            if(Memory.population[this.room.name][Memory.creeps[name].role] < 0){
                Memory.population[this.room.name][Memory.creeps[name].role] = 0;
            }

            if (Memory.creeps[name].resourceRoomID !== undefined) {
                Memory.resourceRooms[Memory.creeps[name].resourceRoomID] -- ;

                if(Memory.resourceRooms[Memory.creeps[name].resourceRoomID] < 0){
                    Memory.resourceRooms[Memory.creeps[name].resourceRoomID] = 0;
                }
                if( Memory.noticeSettings !== undefined && Memory.noticeSettings['memoryNotice'] === true) {
                    console.log('[memory] -> remove dead ' + Memory.creeps[name].role + ' from ' + Memory.creeps[name].resourceRoomID + ' limit: ' + Memory.resourceRooms[Memory.creeps[name].resourceRoomID]);
                }
            }

            delete Memory.creeps[name];
        }
        else{
            //запуск action'ов
            actions[Memory.creeps[name].role].run(Game.creeps[name]);
        }
    }

    if(!this.spawning){
        for (let role in actions) {
            if (actions[role].needBuild(this, Memory.population[this.room.name][role])) {
                 this.creepCreate(role);
                 break;
            }
        }
    }
};

/**
 * конструирование тела крипа
 * @param role
 * @returns {Array}
 */
StructureSpawn.prototype.constructCreepBody = function (role) {
    let returnBody = [];
    let totalEnergy = this.room.energyAvailable;

     for(;;) {
         for (let bodyPart in actions[role].bodyTemplate) {
             totalEnergy -= BODYPART_COST[actions[role].bodyTemplate[bodyPart]];

             if (totalEnergy >= 0) {
                 returnBody.push(actions[role].bodyTemplate[bodyPart]);
             }
         }

         if (totalEnergy <= 0) {
             if (totalEnergy < 0) {
                 returnBody.pop();
             }
             break;
         }
     }

    if(returnBody.length < actions[role].bodyTemplate.length){
        returnBody = actions[role].bodyTemplate;
    }

    return returnBody;
};

/**
 * создание крипа по роли
 * @param role
 */
StructureSpawn.prototype.creepCreate = function (role) {
    if(this.spawning){
        console.log(this.spawning);
        return;
    }
    let creepBody = this.constructCreepBody(role);
    let pref = new Date();
    let tmp = this.canCreateCreep(creepBody, actions[role].prefix + '_'+ pref.getTime());

    if( tmp === OK){
        let cName = this.createCreep(creepBody,actions[role].prefix + '_'+pref.getTime(),{'role':role});

        if(cName !== undefined && _.isString(cName)){
            if( Memory.noticeSettings !== undefined &&  Memory.noticeSettings['createNotice'] === true){
                console.log('[create]-> new creep: '+ role + '(' + creepBody.length + ')');
            }
            Game.creeps[cName].memory.roomID = Game.creeps[cName].room.name;
            Memory.population[this.room.name][role] += 1;
        }
    }
    return '';
};


