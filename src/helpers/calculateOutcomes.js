export const calculateOutcomes = (outcomes, incomes) => {
   const { totalSalesCheques, totalSalesEfectivo } = incomes;
   const {
      totalEgresosEfectivo,
      totalEgresosBancoEfectivo,
      totalEgresosBancoCheques,
   } = outcomes;

   // We need to calculate the totalEfectivo and totalCheques from outcomes and update outcomes state at the end of the function.
   let newOutcomes = {
      ...outcomes,
      totalEfectivo: ( totalSalesEfectivo - (totalEgresosEfectivo + totalEgresosBancoEfectivo) ),
      totalCheques: ( totalSalesCheques - totalEgresosBancoCheques ),
      totalEgresos: totalSalesEfectivo + totalSalesCheques - (totalEgresosEfectivo + totalEgresosBancoEfectivo + totalEgresosBancoCheques),
   };

   return newOutcomes;
};