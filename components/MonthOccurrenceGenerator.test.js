function MonthOccurrenceGenerator(recurrenceIndex, startDate) {

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
            monthList = [startMonth];
            break;
    }

    return monthList // tableau d'index de mois selon le format date js

}
//recurrence row : 0 mensuelle, 1 trimestrielle, 2 annuelle
it('Charge mensuelle', () => {
    const recurrenceRow = 0;
    const startDate = new Date();
    expect(MonthOccurrenceGenerator(recurrenceRow, startDate)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
});

it('Charge trimestrielle', () => {
    const recurrenceRow = 1;
    const startDate = new Date(2024, 0, 1); // 1er janvier
    expect(MonthOccurrenceGenerator(recurrenceRow, startDate)).toEqual([0, 3, 6, 9]);
});


it('Charge annuelle', () => {
    const recurrenceRow = 2;
    const startDate = new Date(2024, 5, 10); // Juin
    expect(MonthOccurrenceGenerator(recurrenceRow, startDate)).toEqual([5]);
});
