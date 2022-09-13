import React, { useState } from 'react';
import WebFont from 'webfontloader';
/* context */
import { YearProvider } from './contexts/YearContext';
import { NewBillProvider } from './contexts/NewBillContext';
/* Router */
import { Routes, Route } from 'react-router-dom';
/* components */
import { Login } from './components/Login';
import { Home } from './components/Home';
import { YearRegister } from './components/YearRegister';
import { PrivateRoute } from './components/PrivateRoute';
import { Register } from './components/Register';
import { NewBill } from './components/NewBill';
import { Alert } from './elements/Alert';
import { MonthRegistersContext } from './components/MonthRegistersContext';
import { Costumers } from './components/Costumers';

export const BillApp = () => {
   WebFont.load({
      google: {
         families: ['Outfit:300,400,500,600'],
      },
   });

   /* states */
   const [alertState, setAlertState] = useState(false);
   const [alertContent, setAlertContent] = useState({});
   const [registerData, setRegisterData] = useState({
      bills: [],
      incomes: {
         otherIncomes: 0,
         otherIncomesList: [],
         anteriorEfectivo: 0,
         anteriorCheques: 0,
         totalContado: 0,
         totalCheques: 0,
         totalPos: 0,
         totalLinea: 0,
         totalCreditoPendiente: 0,
         totalDuraznosContado: 0,
         totalDuraznosCheques: 0,
         totalSalesEfectivo: 0,
         totalSalesCheques: 0,
         totalSales: 0,
      },
      outcomes: {
         outcomesList: [],
         totalEgresosEfectivo: 0,
         totalEgresosBancoEfectivo: 0,
         totalEgresosBancoCheques: 0,
         totalGastosJefe: 0,
         totalEfectivo: 0,
         totalCheques: 0,
      },
   });
   const [showMonthModal, setShowMonthModal] = useState(false);
   const [targetDate, setTargetDate] = useState({
      year: '',
      month: '',
      monthNumber: undefined
   });
   const [editBill, setEditBill] = useState(false);

   return (
      <>
         <Routes>
            <Route
               path="/login"
               element={
                  <Login
                     setAlertState={ setAlertState }
                     setAlertContent={ setAlertContent }
                  />
               }
            />
            <Route element={ <PrivateRoute /> }>
               <Route
                  path='/'
                  element={
                     <YearProvider>
                        <Home
                           setAlertState={ setAlertState }
                           setAlertContent={ setAlertContent }
                           setShowMonthModal={ setShowMonthModal }
                           targetDate={ targetDate }
                           setTargetDate={ setTargetDate }
                        />
                     </YearProvider>
                  }
               />
               <Route
                  path='/register/:year/:month/:day'
                  element={
                     <NewBillProvider>
                        <Register
                           setAlertState={ setAlertState }
                           setAlertContent={ setAlertContent }
                           targetDate={ targetDate }
                           setTargetDate={ setTargetDate }
                           setEditBill={ setEditBill }
                           registerData={ registerData }
                           setRegisterData={ setRegisterData }
                           setShowMonthModal={ setShowMonthModal }
                        />
                     </NewBillProvider>
                  }
               />
               <Route
                  path='/new-bill/:year/:month/:day'
                  element={
                     <NewBillProvider>
                        <NewBill
                           setAlertState={ setAlertState }
                           setAlertContent={ setAlertContent }
                           editBill={ editBill }
                           setEditBill={ setEditBill }
                           registerData={ registerData }
                           setRegisterData={ setRegisterData }
                        />
                     </NewBillProvider>
                  }
               />
               <Route
                  path='/all-registers/:year/:month'
                  element={
                     <MonthRegistersContext
                        setAlertState={ setAlertState }
                        setAlertContent={ setAlertContent }
                     />
                  }
               />
               <Route
                  path='/costumers'
                  element={
                     <Costumers
                        setAlertState={ setAlertState }
                        setAlertContent={ setAlertContent }
                     />
                  }
               />
            </Route>
         </Routes>

         { showMonthModal &&
            <YearRegister
               setShowMonthModal={ setShowMonthModal }
               targetDate={ targetDate }
               setTargetDate={ setTargetDate }
            />
         }

         <Alert
            type={ alertContent.type }
            message={ alertContent.message }
            alertState={ alertState }
            setAlertState={ setAlertState }
         />
      </>
   );
};