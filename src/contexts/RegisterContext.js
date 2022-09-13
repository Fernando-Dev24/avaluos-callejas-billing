import React, { useState, useEffect, useContext, useCallback } from 'react';
/* firebase */
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

/* Initialize context */
const RegisterContext = React.createContext();

/* custom hook to get BillRegisterContext */
const useRegister = () => useContext(RegisterContext);

/* Bill Register Provider */
const RegisterProvider = ({ children, date, registerData, setRegisterData }) => {
   /* props */
   const { year, month, day } = date;
   const [loading, setLoading] = useState(true);

   const handleGetData = useCallback(
      async () => {
      const docRef = doc(db, 'billing', year, month, day);
      const docSnap = await getDoc(docRef);
      
      // Variables to be returned
      let data = {
         bills: [ ...registerData.bills ],
         incomes: { ...registerData.incomes },
         outcomes: { ...registerData.outcomes },
      };
      
      // Validate if there is something on docSnap to render
      if( docSnap.exists() ) {
         const {
            bills: registerBills = [ ...registerBills.bills ],
            incomes: registerIncomes = { ...registerData.incomes },
            outcomes: registerOutcomes = { ...registerData.outcomes },
         } = docSnap.data();
         
         // Update registerData content
         data = {
            bills: [ ...registerBills ],
            incomes: { ...registerIncomes },
            outcomes: { ...registerOutcomes },
         };
      } else {
         data = {
            bills: [],
            incomes: {
               otherIncomes: 0,
               otherIncomesList: [],
               anteriorEfectivo: 0,
               anteriorCheques: 0,
               anteriorEfectivoSm: 0,
               anteriorChequeSm: 0,
               totalContado: 0,
               totalCheques: 0,
               totalPos: 0,
               totalLinea: 0,
               totalCreditoPendiente: 0,
               totalDuraznosContado: 0,
               totalDuraznosCheques: 0,
               totalSanMiguelValuos: 0,
               totalSanMiguelTaller: 0,
               totalSanMiguelEfectivo: 0,
               totalSanMiguelCheques: 0,
               totalMatrizValuos: 0,
               totalMatrizTaller: 0,
               totalMatrizEfectivo: 0,
               totalMatrizCheques: 0,
               totalSalesEfectivo: 0,
               totalSalesCheques: 0,
               totalSales: 0,
            },
            outcomes: {
               outcomesList: [],
               totalEgresosEfectivo: 0,
               totalEgresosBancoEfectivo: 0,
               totalEgresosBancoCheques: 0,
               totalEfectivo: 0,
               totalCheques: 0,
               totalEgresos: 0,
            },
         };
      };

      return data;
   });

   
   // Effect that will get all bills could have contain the date passed as a prop on Provider component
   useEffect(() => {
      const saveData = async () => {
         const data = await handleGetData();
         setRegisterData(data);
         setLoading(false);
      };
      saveData();
   }, [date.day]);

   return (
      <RegisterContext.Provider value={{ value: '' }}>
         { !loading && children }
      </RegisterContext.Provider>
   );
};

export { RegisterProvider, useRegister };