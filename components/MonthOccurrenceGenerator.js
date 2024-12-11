export default function MonthOccurrenceGenerator(recurrenceIndex, startDate) {

    let monthList = [];
    let startMonth = startDate.getMonth();

    switch (recurrenceIndex) {
        case 0: //each month
            monthList = [...Array(12).keys()];
            break;
        case 1: //every 3 month
        for (let i = 0; i < 4; i++) {
            monthList.push((startMonth + i * 3) % 12);
          }
            break;
        case 2: //every year
            monthList =[startMonth];
            break;
    }

    return monthList // tableau d'index de mois selon le format date js
    
}