export default function CheckInRange(charge, startDate, endDate) { //event object array to check and date of the start of the displayed range (we assume that it is a month)
    const chargeDate = Date.parse(charge.date)              //tableau charge du compte select, date début période, date fin
    const rangeFirstDay = Date.parse(startDate)
    const rangeLastDay = Date.parse(endDate)

    let nextOccurrences = [];
    let checkedDate = rangeFirstDay;


    switch (charge.recurrence) {
        case O: //each week -SUPPRIMER
            break;
        case 1: //each month
            const refDate = chargeDate.getDate() // setting a refference with the number of the day to check
            while (checkedDate <= rangeLastDay) { //check all date between first date and last date
                if (checkedDate.getDate() == refDate) { //if the number of the checked date is equal to the refference number
                    nextOccurrences.puch(checkedDate) //the checked date is added to the nextOccurrences array
                }
                checkedDate.setDate(checkedDate.getDate() + 1); // the checked date number is incremented to go further in the loop
            }
            break;
        case 2: //every 3 month
            
            break;
        case 3: //every year
            break;

    }


    return nextOccurrences; // tableau avec les charges qui correspondent à la période

}
