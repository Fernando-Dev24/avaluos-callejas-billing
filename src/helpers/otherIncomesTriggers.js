/* firebase */
import { db } from '../firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
/* helpers */
import { v4 as uuidv4 } from 'uuid';
import { calculateOutcomes } from '../helpers/calculateOutcomes'

const addOtherIncome = async (registerData, setRegisterData, formValues, date, editOtherIncome) => {
   // Desestructuring for easy to use access
   const { year, month, day } = date;
   const docRef = doc(db, 'billing', year, month, day);
   const {
      bills,
      incomes,
      incomes: {
         otherIncomesList,
         anteriorEfectivo,
         anteriorCheques,
         totalDuraznosContado,
         totalDuraznosCheques
      },
      outcomes,
   } = registerData;
   
   // Create the object to push it to otherIncomesList from incomes entry on registerData
   let newOtherIncomesList = [...otherIncomesList];
   if( !editOtherIncome.state ) {
      const newOtherIncome = {
         ...formValues,
         incomeValue: Number(formValues.incomeValue),
         id: uuidv4(),
      };
      newOtherIncomesList = [...otherIncomesList, newOtherIncome];
   } else {
      const editedIncome = {
         ...formValues,
         incomeValue: Number(formValues.incomeValue),
      };

      // Find the index on expenses array from the folder array item
      const targetIncomeIndex = newOtherIncomesList.findIndex(({ id }) => id === editedIncome.id);
      // If the result from targetIncomeIndex is different from -1 we need to edit the otherIncomes array with the editedIncome
      targetIncomeIndex !== -1 ?
         newOtherIncomesList[targetIncomeIndex] = editedIncome
         :
         console.log('Error');
   };

   // DONE: Calculate the new incomes total based on the otherIncomesList
   let totalOtherIncomes = 0;

   // Loop on every otherIncomesList item to calculate its total value
   newOtherIncomesList.forEach(({ incomeValue }) => totalOtherIncomes += incomeValue);

   // DONE: Now, we need to calculate the general incomes totals and outcomes as well.
   let efectivo = 0;
   let cheques = 0;
   let tarjeta = 0;
   let transferencias = 0;
   let pendiente = 0;

   bills.forEach(({ contado, cheque, pos, linea, creditoPendiente }) => {
      efectivo += Number(contado);
      cheques += Number(cheque);
      tarjeta += Number(pos);
      transferencias += Number(linea);
      pendiente += Number(creditoPendiente);
   });

   let newIncomes = {
      ...incomes,
      otherIncomesList: newOtherIncomesList,
      otherIncomes: totalOtherIncomes,
      totalContado: efectivo,
      totalCheques: cheques,
      totalPos: tarjeta,
      totalLinea: transferencias,
      totalCreditoPendiente: pendiente,
      totalSalesEfectivo: ( anteriorEfectivo + efectivo + totalDuraznosContado + totalOtherIncomes ),
      totalSalesCheques: ( anteriorCheques + cheques + totalDuraznosCheques + tarjeta + transferencias ),
      totalSales: ( efectivo + cheques + tarjeta + transferencias + totalDuraznosContado + totalDuraznosCheques + totalOtherIncomes ),
   };

   // DONE: Calculate the new outcomes
   const newOutcomes = calculateOutcomes(outcomes, newIncomes);

   // DONE: Update the registerData and data from firestore
   setRegisterData({
      ...registerData,
      incomes: newIncomes,
      outcomes: newOutcomes,
   });

   await setDoc(docRef, {
      bills: bills,
      incomes: newIncomes,
      outcomes: newOutcomes,
   });
};

const deleteOtherIncome = async (registerData, setRegisterData, restOfOtherIncomes, date) => {
   /* Desestructuring for easy access */
   const { year, month, day } = date;
   const {
      bills,
      incomes,
      incomes: {
         totalContado,
         totalCheques,
         totalPos,
         totalLinea,
         anteriorEfectivo,
         anteriorCheques,
         totalDuraznosContado,
         totalDuraznosCheques,
      },
      outcomes,
   } = registerData;
   const docRef = doc(db, 'billing', year, month, day);

   // DONE: Calculate the new otherIncomes total
   let totalOtherIncomes = 0;
   if( restOfOtherIncomes.length > 0 ) {
      restOfOtherIncomes.forEach(({ incomeValue }) => totalOtherIncomes += incomeValue);
   } else { totalOtherIncomes = 0; };

   // DONE: Now, we need to calculate the incomes and outcomes totals
   let newIncomes = {
      ...incomes,
      otherIncomesList: restOfOtherIncomes,
      otherIncomes: totalOtherIncomes,
      totalSalesEfectivo: ( anteriorEfectivo + totalContado + totalDuraznosContado + totalOtherIncomes ),
      totalSalesCheques: ( anteriorCheques + totalCheques + totalDuraznosCheques + totalPos + totalLinea ),
      totalSales: ( totalContado + totalCheques + totalPos + totalLinea + totalDuraznosContado + totalDuraznosCheques + totalOtherIncomes ),
   };

   // DONE: We need to calculate the new outcomes
   const newOutcomes = calculateOutcomes(outcomes, newIncomes);

   // DONE: Update the local and firestore state and its data
   setRegisterData({
      ...registerData,
      incomes: newIncomes,
      outcomes: newOutcomes,
   });

   await setDoc(docRef, {
      bills: bills,
      incomes: newIncomes,
      outcomes: newOutcomes,
   });
};

export {
   addOtherIncome,
   deleteOtherIncome,
};