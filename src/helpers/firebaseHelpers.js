/* firebase */
import { auth, db } from '../firebase/firebaseConfig';
import { doc, setDoc, addDoc, collection, updateDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
/* helpers */
import { getUnixTime } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { addIncome } from './addIncome';
import { calculateIncomes } from './calculateIncomes';
import { calculateOutcomes } from './calculateOutcomes';
import { addOutcome } from './addOutcome';

/* signIn */
const signIn = async (email, password) => {
   await signInWithEmailAndPassword(auth, email, password);
};

/* signOut */
const authSignOut = async () => {
   await signOut(auth);
};

/* addYear */
const addYear = async (year) => {
   const docRef = doc(db, 'billing', String(year));
   await setDoc(docRef, {
      total_january: 0,
      total_february: 0,
      total_march: 0,
      total_april: 0,
      total_may: 0,
      total_june: 0,
      total_july: 0,
      total_august: 0,
      total_september: 0,
      total_october: 0,
      total_november: 0,
      total_december: 0,
   });
};

/* deleteBill */
const deleteBill = async (
   registerData,
   setRegisterData,
   newBillsArray,
   year,
   month,
   day,
) => {
   // Destructuring for easy to use access
   const { incomes, outcomes } = registerData;
   const docRef = doc(db, 'billing', year, month, day);

   // DONE: Calculate incomes again to update global state
   const newIncomes = calculateIncomes(newBillsArray, incomes);

   // DONE: Calculate outcomes with the new incomes data
   const newOutcomes = calculateOutcomes(outcomes, newIncomes);

   // Now, we need to update firestore state
   await setDoc(docRef, {
      bills: newBillsArray,
      incomes: newIncomes,
      outcomes: newOutcomes,
   });
};

/* saveData */
const saveData = async (registerData, date) => {
   const { year, month, day } = date;
   const { bills, incomes, outcomes } = registerData;
   const docRef = doc(db, 'billing', year, month, day);
   
   // Save data on firebase
   await setDoc(docRef, {
      bills: bills,
      incomes: incomes,
      outcomes: outcomes,
   });
};

/* FUNCIONES QUE INTERACTUAN CON GRAN CANTIDAD DE CODIGO */
const uploadNewBill = async (
   newBill,
   registerData,
   year,
   month,
   day,
   editBill,
   costumers,
) => {
   const { bills } = registerData;
   const docRef = doc(db, 'billing', year, month, day);
   
   if( !editBill ) {
      // First, we need to add this newBills to bills array and update just these entry to later calculate the totals
      const bill = {
         ...newBill,
         id: uuidv4(),
         created: getUnixTime(new Date()),
      };

      if( bill.billType === 'CCF' ) {
         // DONE: Now we need to validate if there is a existing register on database
         const [ isInDatabase ] = costumers.filter(({ registerNumber: costumerNumber }) => {
            return costumerNumber === bill.registerNumber;
         });

         // DONE: Now, if the costumer exists just replace the information and upload the bill to firebase
         if( isInDatabase !== undefined ) {
            const { adress, name, personalId, registerNumber } = isInDatabase;
            let updatedBill = {
               ...newBill,
               costumer: name,
               adress: adress,
               personalId: personalId,
               registerNumber: registerNumber,
               id: uuidv4(),
               created: getUnixTime(new Date()),
            };

            await setDoc(docRef, {
               ...registerData,
               bills: [ ...bills, updatedBill ],
            });
         } else {
            // DONE: Need to create a new costumer register with the data typed before
            const { costumer, registerNumber, personalId, adress, giro } = bill;

            // DONE: Create a new costumer register with the object created above
            const collectionRef = collection(db, 'costumers');
            await addDoc(collectionRef, {
               name: costumer,
               registerNumber: registerNumber,
               personalId: personalId,
               adress: adress,
               giro: giro,
               created: getUnixTime(new Date()),
            }).then(() => {
               setDoc(docRef, {
                  ...registerData,
                  bills: [ ...bills, bill ],
               });
            });
         };
      } else {
         await setDoc(docRef, {
            ...registerData,
            bills: [ ...bills, bill ],
         });
      };
   } else {
      // DONE: Make the logic when edited the bill to upload but replace its information
      let editedBill = { ...newBill };

      /* DONE: Need to validate if there is a costumer register with the same registerNumber that is on editedBill registerNumber entry. If the result is true, we just need to replace information on editedBill, but if it isn't need to create a new costumer register */
      if( editedBill.billType === 'CCF' ) {
         // Search an object that has the same registerNumber written on editedBill
         const { registerNumber: actualRegisterNumber } = editedBill;
         const [ isInDatabase ] = costumers.filter(({ registerNumber }) => registerNumber === actualRegisterNumber);
      
         // Now, need to validate if isInDatabase, its length is more than zero, if this validation is true, we just desestructure and replace, but if it is not need to create a new costumer register
         if( isInDatabase !== undefined ) {
            const { name, registerNumber, personalId, adress, giro } = isInDatabase;
            editedBill = {
               ...editedBill,
               costumer: name,
               registerNumber: registerNumber,
               personalId: personalId,
               adress: adress,
               giro: giro,
            };
         } else {
            const { costumer, registerNumber, personalId, adress, giro } = editedBill;
            // Upload a new document on firebase
            const collectionRef = collection(db, 'costumers');
            await addDoc(collectionRef, {
               name: costumer,
               registerNumber: registerNumber,
               personalId: personalId,
               adress: adress,
               giro: giro,
               created: getUnixTime(new Date()),
            });
         };
      };

      // Find targetBill index to access to that item on original array and replace its information with editedBill constant above
      const targetIndex = bills.findIndex(({ id: billId }) => billId === editedBill.id);
      
      // If targetBills result it's different to -1 then we need to access to that index item and update its information. If does not exist any item with this index then we just execute a console.log('error')
      targetIndex !== -1 ? bills[targetIndex] = editedBill : console.log('Error');

      // Upload new editeBill to firebase
      await updateDoc(docRef, {
         bills: bills,
      });
   };
};

const updateIncomes = async (
   modalValues,
   registerData,
   setRegisterData,
   year,
   month,
   day,
) => {
   // DONE: We need to sum the information modalValues it has in the correct entry on incomes state
   const { incomes, bills, outcomes } = registerData;
   const { type, price } = modalValues;
   const docRef = doc(db, 'billing', year, month, day);

   // Sum depending on type value
   let newIncomes = addIncome(incomes, type, price);
   const {
      totalContado, anteriorEfectivo, totalDuraznosContado, otherIncomes,
      totalCheques, anteriorCheques, totalDuraznosCheques,
      totalPos, totalLinea,
   } = newIncomes;

   // Calculate the totals and update the state locally and upload it to fireebase
   newIncomes = {
      ...newIncomes,
      totalSalesEfectivo: ( totalContado + anteriorEfectivo + totalDuraznosContado + otherIncomes ),
      totalSalesCheques: ( totalCheques + anteriorCheques + totalDuraznosCheques + totalLinea + totalPos),
      totalSales: ( totalContado + totalCheques + totalPos + totalLinea + totalDuraznosContado + totalDuraznosCheques + otherIncomes ),
   };

   // At the same time we need to calculate outcomes to update its totals
   const newOutcomes = calculateOutcomes(outcomes, newIncomes);

   // Update registerData because we do not have a snapShot to update automatically the state.
   setRegisterData({
      bills: bills,
      incomes: newIncomes,
      outcomes: newOutcomes,
   });

   await setDoc(docRef, {
      bills: bills,
      incomes: newIncomes,
      outcomes: newOutcomes,
   });
};

const uploadOutcome = async (
   registerData,
   setRegisterData,
   inputValues,
   date,
) => {
   const { year, month, day } = date;
   const docRef = doc(db, 'billing', year, month, day);
   const { outcomes, incomes, bills } = registerData;
   
   /* Adding inputValues to outcomesList */
   const outcomesUpdated = addOutcome(outcomes, inputValues);

   // Get the final outcomes result
   const newOutcomes = calculateOutcomes(outcomesUpdated, incomes);

   // First, we need to update registerData state because do not have a snapshot to update when it changes on firebase
   setRegisterData({
      ...registerData,
      outcomes: newOutcomes,
   });

   // Now, we update firebase data and finish this function
   await setDoc(docRef, {
      bills: bills,
      incomes: incomes,
      outcomes: newOutcomes,
   });
};

export {
   signIn,
   authSignOut,
   addYear,
   deleteBill,
   updateIncomes,
   uploadNewBill,
   uploadOutcome,
   saveData,
};