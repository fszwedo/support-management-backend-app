const getTodayShifts = (shiftData) => {
    const today = new Date().toDateString();
    
    for (let i = 0; i < shiftData.length; i++){
        const date = new Date(shiftData[i].date).toDateString();
        if (date === today) {
            return shiftData[i];
        }        
    }

}

export default getTodayShifts;