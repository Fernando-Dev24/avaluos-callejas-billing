const calculateBillTotals = (newBill, setNewBill) => {
   // Destructuring billPrices from newBill state
   const { billPrices: prices } = newBill;
   
   // Declare sum variable
   let sum = 0;
   let sumSalesNotSubjects = 0;
   let sumExemptSales = 0;

   // Loop on every price object that is in prices array, while looping we need to sum affectedSales entry on sum let variable declare above
   prices.forEach(({ affectedSales, salesNotSubjects, exemptSales }) => {
      sum += Number(affectedSales);
      sumSalesNotSubjects += Number(salesNotSubjects);
      sumExemptSales += Number(exemptSales);
   });

   // Setting new values on newBill context
   setNewBill({
      ...newBill,
      sumPrices: sum,
      iva: 0,
      total: ( sum + sumSalesNotSubjects + sumExemptSales ),
      totalSalesNotSubjects: sumSalesNotSubjects,
      totalExemptSales: sumExemptSales,
   });
};

const calculateCffTotals = (newBill, setNewBill) => {
   /* Destructuring prices on newBill state */
   const { billPrices: prices } = newBill;

   /* Declare sum variables */
   let sum = 0;
   let sumIva = 0;
   let sumSalesNotSubjects = 0;
   let sumExemptSales = 0;

   // Looping on every item on prices array
   prices.forEach(({ affectedSales, salesNotSubjects, exemptSales  }) => {
      sum += Number(affectedSales);
      sumSalesNotSubjects += Number(salesNotSubjects);
      sumExemptSales += Number(exemptSales);
   });

   // sum without IVA
   const sumWithoutIVA = sum / 1.13;
   sumIva = sum - sumWithoutIVA;

   setNewBill({
      ...newBill,
      sumPrices: sum,
      iva: sumIva,
      total: ( sum + sumSalesNotSubjects + sumExemptSales + sumIva ),
      totalSalesNotSubjects: sumSalesNotSubjects,
      totalExemptSales: sumExemptSales,
   });
};

export { calculateBillTotals, calculateCffTotals };