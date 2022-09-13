import { v4 as uuidv4 } from 'uuid';
import { getUnixTime } from 'date-fns';

export const addOutcome = (outcomes, inputValues) => {
   let { outcomesList } = outcomes;

   // DONE: First we need to inputValues into a new object that will be inside of outcomesList
   const newOutcome =  {
      ...inputValues,
      price: Number(inputValues.price),
      id: uuidv4(),
      created: getUnixTime(new Date()),
   };
   outcomesList = [...outcomesList, newOutcome];

   // DONE: Loop on every item from outcomesList to sum its correct total depending on type entry
   let salidas = 0;
   let bancoEfectivo = 0;
   let bancoCheques = 0;

   outcomesList.forEach(({ payMethod, price }) => {
      switch( payMethod ) {
         case 'EFECTIVO':
            salidas += price;
         break;
         case 'BANCO EFECTIVO':
            bancoEfectivo += price;
         break;
         default:
            bancoCheques += price;
         break;
      };
   });

   // Update just category totals on outcomes, totals on day will be calculate later
   let outcomesUpdated = {
      ...outcomes,
      outcomesList: outcomesList,
      totalEgresosEfectivo: salidas,
      totalEgresosBancoEfectivo: bancoEfectivo,
      totalEgresosBancoCheques: bancoCheques,
   };

   return outcomesUpdated;
};