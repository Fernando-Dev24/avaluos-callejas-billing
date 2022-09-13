export const calculateIncomes = (billsArray, oldIncomes) => {
   // Destructuring for easy access
   const {
      anteriorEfectivo,
      anteriorCheques,
      totalDuraznosContado,
      totalDuraznosCheques,
      otherIncomes,
   } = oldIncomes;

   // DONE: First we need to calculate the incomes and totalIncomes based on newBillsArray
   let efectivo = 0;
   let cheques = 0;
   let tarjeta = 0;
   let transferencia = 0;
   let pendiente = 0;

   // Loop this newBillsArray to calculate totals based on its payment method
   billsArray.forEach(({ contado, cheque, pos, linea, creditoPendiente }) => {
      efectivo += Number(contado);
      cheques += Number(cheque);
      tarjeta += Number(pos);
      transferencia += Number(linea);
      pendiente += Number(creditoPendiente);
   });

   const billsSanMiguel = billsArray.filter(({ ref }) => ( ref === 'SM VALUOS' ) || ( ref === 'SM TALLER' ));

   const billsMatriz = billsArray.filter(({ ref }) => ( ref !== 'SM VALUOS' ) && ( ref !== 'SM TALLER' ));

   // Now, we need to calculate the incomes from San Miguel
   let totalAvaluosSm = 0;
   let totalTallerSm = 0;
   let totalEfectivoSm = 0;
   let totalChequesSm = 0;

   let matrizValuos = 0;
   let matrizTaller = 0;
   let totalEfectivoMatriz = 0;
   let totalChequesMatriz = 0;

   // Loop on every item from billsSanMiguel to calculate the above amounts.
   billsSanMiguel.forEach(({ contado, cheque, ref }) => {
      totalEfectivoSm += contado;
      totalChequesSm += cheque;

      switch( ref ) {
         case 'SM AVALUOS':
            totalAvaluosSm = totalAvaluosSm + contado + cheque;
         break;
         case 'SM TALLER':
            totalTallerSm = totalTallerSm + contado + cheque;
         break;
         default:
            break;
      };
   });

   billsMatriz.forEach(({ contado, cheque, ref }) => {
      totalEfectivoMatriz += contado;
      totalChequesMatriz += cheque;

      switch( ref ) {
         case 'TALLER CASA MATRIZ':
            matrizTaller = matrizTaller + contado + cheque;
         break;
         default:
            matrizValuos = matrizValuos + contado + cheque;
         break;
      };
   });

   let newIncomes = {
      ...oldIncomes,
      totalContado: efectivo,
      totalCheques: cheques,
      totalPos: tarjeta,
      totalLinea: transferencia,
      totalSanMiguelValuos: totalAvaluosSm,
      totalSanMiguelTaller: totalTallerSm,
      totalSanMiguelEfectivo: totalEfectivoSm,
      totalSanMiguelCheques: totalChequesSm,
      totalMatrizValuos: matrizValuos,
      totalMatrizTaller: matrizTaller,
      totalMatrizEfectivo: totalEfectivoMatriz,
      totalMatrizCheques: totalChequesMatriz,
      totalCreditoPendiente: pendiente,
      totalSalesEfectivo: ( anteriorEfectivo + efectivo + totalDuraznosContado + otherIncomes ),
      totalSalesCheques: ( anteriorCheques + cheques + totalDuraznosCheques + tarjeta + transferencia ),
      totalSales: ( efectivo + cheques + tarjeta + transferencia + totalDuraznosContado + totalDuraznosCheques + otherIncomes ),
   };

   return newIncomes;
};