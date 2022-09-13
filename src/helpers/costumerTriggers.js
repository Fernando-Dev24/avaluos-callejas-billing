import { db } from '../firebase/firebaseConfig';
import { addDoc, deleteDoc, updateDoc, collection, doc } from 'firebase/firestore';
/* helpers */
import { getUnixTime } from 'date-fns';

const addCostumer = async (formValues, index, costumers, setCostumers) => {
   // DONE: Create the new costumer register object
   let newCostumer = {
      ...formValues,
      created: getUnixTime(new Date()),
   };

   // DONE: Push the new costumer object at the specific index
   let costumersBackup = [...costumers];
   costumersBackup.splice(index + 1, 0, newCostumer);

   // DONE: At last, we create a new document on firebase with the new costumer object
   await addDoc(collection(db, 'costumers'), newCostumer);
};

const editCostumer = async (costumerToEdit, costumers, setCostumers) => {
   /* Destructure for easy to use access */
   const { name, registerNumber, personalId, adress, giro, created } = costumerToEdit;

   // Find index on costumers array to edit the correct object
   const targetIndex = costumers.findIndex(({ id: costumerId }) => costumerId === costumerToEdit.id);
   
   // If targetIndex is different of -1 we need to replace the older costumer register from the one that has passed as a parameter
   targetIndex !== -1 ? costumers[targetIndex] = costumerToEdit : console.log('Error');

   // Upload the new costumerToEdit object to the respectively document
   const docRef = doc(db, 'costumers', costumerToEdit.id);
   await updateDoc(docRef, {
      name: name,
      registerNumber: registerNumber,
      personalId: personalId,
      adress: adress,
      giro: giro,
      created: created,
   });
};

const deleteCostumer = async (id) => {
   const docRef = doc(db, 'costumers', id);
   await deleteDoc(docRef);
};

export { addCostumer, editCostumer, deleteCostumer };