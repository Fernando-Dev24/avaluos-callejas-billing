export const calculateYearTotals = (totals) => {
   // Define global counters
   let totalInYear = 0;
   let totalEfectivoInYear = 0;
   let totalChequesInYear = 0;
   let totalIncomesInYear = 0;
   let totalOutcomesInYear = 0;

   // Loop on an uniterary object with for of
   for (const month of Object.keys(totals)) {
      const {
         total,
         totalCheques,
         totalEfectivo,
         totalIncomes,
         totalOutcomes,
      } = totals[month];
      totalInYear += total === undefined ? 0 : total;
      totalEfectivoInYear += totalEfectivo === undefined ? 0 : totalEfectivo;
      totalChequesInYear += totalCheques  === undefined ? 0 : totalCheques;
      totalIncomesInYear += totalIncomes  === undefined ? 0 : totalIncomes;
      totalOutcomesInYear += totalOutcomes === undefined ? 0 : totalOutcomes;
   };

   return {
      totalInYear,
      totalEfectivoInYear,
      totalChequesInYear,
      totalIncomesInYear,
      totalOutcomesInYear,
   };
};