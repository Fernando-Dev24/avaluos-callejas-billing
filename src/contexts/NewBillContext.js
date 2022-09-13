import React, { useState, useContext } from "react";

/* context variables */
const NewBillContext = React.createContext();

/* useNewBillContext */
const useNewBill = () => useContext(NewBillContext);

/* NewBillProvider */
const NewBillProvider = ({ children }) => {
   /* states */
   const [newBill, setNewBill] = useState({
      /* DATOS GENERALES DE FACTURA O CCF */
      billType: 'FACTURA',
      /* DATOS DE FACTURA, LUEGO SEGUIRÁN DATOS DE EXCEL */
      costumer: '',
      adress: '',
      telephone: '',
      personalId: '',
      giro: '',
      registerNumber: '',
      billPrices: [], /* DENTRO DE BILLPRICES IRÁN LOS SIGUIENTES CAMPOS: CANTIDAD (AMOUNT), DESCRIPCION (DESCRIPTION), PRECIO UNIT (UNITPRICE), VENTAS NO SUJETAS (SALESNOTSUBJECTS), VENTAS EXENTAS (EXEMPTSALES) */
      /* DATOS EXCEL */
      ref: 'VALÚO',
      state: 'PENDIENTE',
      billNumber: '',
      ccfNumber: '',
      contado: 0,
      cheque: 0,
      pos: 0,
      linea: 0,
      creditoPendiente: 0,
      total: 0,
      iva: 0,
      sumPrices: 0,
      paymentConditions: '',
      totalSalesNotSubjects: 0,
      totalExemptSales: 0,
   });

   /* handleReset */
   const resetBill = () => {
      setNewBill({
         /* DATOS GENERALES DE FACTURA O CCF */
         billType: 'FACTURA',
         /* DATOS DE FACTURA, LUEGO SEGUIRÁN DATOS DE EXCEL */
         costumer: '',
         adress: '',
         telephone: '',
         personalId: '',
         giro: '',
         registerNumber: '',
         billPrices: [], /* DENTRO DE BILLPRICES IRÁN LOS SIGUIENTES CAMPOS: CANTIDAD (AMOUNT), DESCRIPCION (DESCRIPTION), PRECIO UNIT (UNITPRICE), VENTAS NO SUJETAS (SALESNOTSUBJECTS), VENTAS EXENTAS (EXEMPTSALES) */
         /* DATOS EXCEL */
         ref: 'VALÚO',
         state: 'PENDIENTE',
         billNumber: '',
         ccfNumber: '',
         contado: 0,
         cheque: 0,
         pos: 0,
         linea: 0,
         creditoPendiente: 0,
         total: 0,
         iva: 0,
         sumPrices: 0,
         paymentConditions: '',
         totalSalesNotSubjects: 0,
         totalExemptSales: 0,
      });
   };

   return (
      <NewBillContext.Provider value={{
         newBill: newBill,
         setNewBill: setNewBill,
         resetBill: resetBill,
      }}>
         { children }
      </NewBillContext.Provider>
   );
};

export { useNewBill, NewBillProvider };