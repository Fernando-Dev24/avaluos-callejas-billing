/* firebase */
import { db } from "../firebase/firebaseConfig";
import { doc, setDoc } from 'firebase/firestore';
/* helpers */
import { calculateOutcomes } from "./calculateOutcomes";

export const updateIncome = async (value, editIncome, registerData, setRegisterData, date) => {
   /* destructure for easy to use access */
   const { year, month, day } = date;
   const { content: ref } = editIncome;
   const { bills, incomes, outcomes, incomes: {
      totalContado,
      totalCheques,
      totalPos,
      totalLinea,
   } } = registerData;

   // Add the new value to the corresponding income entry
   let newIncomes = {
      ...incomes,
   };

   switch(ref) {
      case 'OTROS INGRESOS':
         newIncomes.otherIncomes = Number(value);
      break;
      case 'SALDO ANTERIOR EFECTIVO':
         newIncomes.anteriorEfectivo = Number(value);
      break;
      case 'SALDO ANTERIOR CHEQUES':
         newIncomes.anteriorCheques = Number(value);
      break;
      case 'DURAZNOS EFECTIVO':
         newIncomes.totalDuraznosContado = Number(value);
      break;
      case 'DURAZNOS CHEQUES':
         newIncomes.totalDuraznosCheques = Number(value);
      break;
      case 'SALDO ANTERIOR EFECTIVO SAN MIGUEL':
         newIncomes.anteriorEfectivoSm = Number(value);
      break;
      case 'SALDO ANTERIOR CHEQUES SAN MIGUEL':
         newIncomes.anteriorChequeSm = Number(value);
      break;
      default:
         break;
   };

   // DONE: Need to calculate the new totals and outcomes based on newIncomes object
   newIncomes = {
      ...newIncomes,
      totalSalesEfectivo: ( newIncomes.anteriorEfectivo + newIncomes.anteriorEfectivoSm + totalContado + newIncomes.totalDuraznosContado + newIncomes.otherIncomes ),
      totalSalesCheques: ( newIncomes.anteriorCheques + newIncomes.anteriorChequeSm + totalCheques + totalLinea + totalPos + newIncomes.totalDuraznosCheques ),
      totalSales: ( totalContado + totalCheques + totalPos + totalLinea + newIncomes.totalDuraznosContado + newIncomes.totalDuraznosCheques + newIncomes.otherIncomes ),
   };

   // DONE: Calculate the outcomes with the new incomes data
   const newOutcomes = calculateOutcomes(outcomes, newIncomes);

   // Now, we need to update the data locally and upload it to firestore
   setRegisterData({
      ...registerData,
      incomes: newIncomes,
      outcomes: newOutcomes,
   });
   
   // Upload data to firestore
   const docRef = doc(db, 'billing', year, month, day);
   await setDoc(docRef, {
      bills: bills,
      incomes: newIncomes,
      outcomes: newOutcomes,
   });
};