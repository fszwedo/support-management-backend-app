import shiftRotaModel from "../models/shiftRotaModel.js";
import shiftRotaRepository from "../repositories/shiftRotaRepository.js";


// const getTodayShifts = (shiftData) => {
//     const today = new Date().toDateString();
    
//     for (let i = 0; i < shiftData.length; i++){
//         const date = new Date(shiftData[i].date).toDateString();
//         if (date === today) {
//             return shiftData[i];
//         }        
//     }

// }

const getTodayShifts = () => {
    const shiftRepository = new shiftRotaRepository(shiftRotaModel);

    // shiftRepository.create({        
    //         date: new Date(),
    //         agents: [ 'phil', 'shehroze' ],
    //         hours: [ '9-17', '14-22' ]
          
    // })
    return shiftRepository.getShiftForToday();
}


export default getTodayShifts;