/**
 * Настройки уведомлений в консоль в игре
 */
module.exports = {
    noticeCPU: true,  //оповещать о превышении уроня CPU на дейстие крипа или здания true/false
    noticeCPULevel: 1.9, //уровень расхода, после которого выводить информацию в консоль
    noticeTowerAttack: true,  //оповещать о найденных башней вражеских крипах true/false
    memoryNotice: false, //показывать или нет логи чистки памяти или добавления в очередь, например для путешествия по комнатам
    createNotice: true, //оповещения о создании криппов
    longHarvestNotice: false //оповещения о добавлении крипа к собиранию в другой комнате
};
