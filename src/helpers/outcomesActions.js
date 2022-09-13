/* firebase */
import { db } from "../firebase/firebaseConfig";
import { setDoc, doc } from 'firebase/firestore';
/* helpers */
import { calculateOutcomes } from "./calculateOutcomes";

const removeOutcome = async (registerData, setRegisterData, date, targetId) => {
   const { bills, incomes, outcomes, outcomes: { outcomesList } } = registerData;
   const { year, month, day } = date;
   const docRef = doc(db, 'billing', year, month, day);

   // Filter the targetOutcome by his id
   const restOfOutcomes = outcomesList.filter(({ id }) => id !== targetId);

   /* Totals temporal variables */
   let salidas = 0;
   let bancoEfectivo = 0;
   let bancoCheques = 0;
   let jefe = 0;

   // Loop on every item to sum its total depending on type
   restOfOutcomes.forEach(({ type, price }) => {
      switch( type ) {
         case 'SALIDA NORMAL':
            salidas += price;
         break;
         case 'BANCO EFECTIVO':
            bancoEfectivo += price;
         break
         case 'BANCO CHEQUE' :
            bancoCheques += price;
         break;
         case 'GASTOS JEFE':
            jefe += price;
         break;
         default:
            salidas += price;
         break;
      };
   });

   let outcomesUpdate = {
      ...outcomes,
      outcomesList: restOfOutcomes,
      totalEgresosEfectivo: salidas,
      totalEgresosBancoEfectivo: bancoEfectivo,
      totalEgresosBancoCheques: bancoCheques,
      totalGastosJefe: jefe, 
   };

   // Calculate new outcomes totals
   const newOutcomes = calculateOutcomes(outcomesUpdate, incomes);

   // update registerData 
   setRegisterData({
      ...registerData,
      outcomes: newOutcomes,
   });

   // Update info on firebase
   await setDoc(docRef, {
      bills: bills,
      incomes: incomes,
      outcomes: newOutcomes,
   });
};

const editOutcomeFunc = async (inputValues, registerData, setRegisterData, date, editOutcome) => {
   const { content: { id: outcomeId } } = editOutcome;
   let { bills, incomes, outcomes, outcomes: { outcomesList } } = registerData;
   const { year, month, day } = date;
   const docRef = doc(db, 'billing', year, month, day);

   // DONE: Create a new object with the new info and update its information
   const editedObject = {
      ...inputValues,
      price: Number(inputValues.price),
   };

   // Filter its index on registerData
   const targetIndex = outcomesList.findIndex(({ id }) => id === outcomeId);
   
   // If targetIndex is different to -1 we need to replace its info for editedObject
   targetIndex !== -1 ? outcomesList[targetIndex] = editedObject : console.log('Error');

   // Loop on every item to sum it correspondal total
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

   let updatedOutcome = {
      ...outcomes,
      outcomesList: outcomesList,
      totalEgresosEfectivo: salidas,
      totalEgresosBancoEfectivo: bancoEfectivo,
      totalEgresosBancoCheques: bancoCheques,
   };

   const newOutcomes = calculateOutcomes(updatedOutcome, incomes);

   // DONE: Update the registerData on local and on firebase to save them
   setRegisterData({ ...registerData, outcomes: newOutcomes });
   await setDoc(docRef, {
      bills: bills,
      incomes: incomes,
      outcomes: newOutcomes,
   });
};

export { removeOutcome, editOutcomeFunc };