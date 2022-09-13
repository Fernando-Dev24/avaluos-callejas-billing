/* helpers */
import { v4 as uuidv4 } from 'uuid';

export const addPrice = (
   amount,
   description,
   unitPrice,
   salesNotSubjects,
   exemptSales,
   newBill,
   setNewBill
) => {
   // Destructuring to easy access on new Bill object
   const { billPrices } = newBill;

   // Preparing new object to push it to prices Array on bill context
   const newPrice = {
      amount: amount,
      description: description,
      unitPrice: Number(unitPrice),
      salesNotSubjects: Number(salesNotSubjects),
      exemptSales: Number(exemptSales),
      affectedSales: ( unitPrice * amount ),
      id: uuidv4(),
   };

   // Add new price object to bill context
   setNewBill({
      ...newBill,
      billPrices: [...billPrices, newPrice],
   });
};