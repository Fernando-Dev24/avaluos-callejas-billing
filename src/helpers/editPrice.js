export const editPrice = (content, newBill, setNewBill) => {
   // Destructuring values that are on an object to easy to use access
   const { billPrices: prices } = newBill;

   // Create a new object that will replace the old one in the same index it was
   const editedPrice = {
      ...content,
      unitPrice: Number(content.unitPrice),
      affectedSales: ( content.unitPrice * content.amount ),
   };

   // Find the index on expenses array from the older array item
   const targetIndex = prices.findIndex(({ id: priceId }) => priceId === content.id);

   // Is targetIndex is equal to "-1" it means there is no price object with the given id
   targetIndex !== -1 ? prices[targetIndex] = editedPrice : console.log('Error');

   // Create a new array with the old and new prices items
   const newPrices = [...prices];

   // Setting the new prices array
   setNewBill({
      ...newBill,
      billPrices: newPrices,
   });
};