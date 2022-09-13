import React, { useState, useEffect, useCallback } from 'react';
/* helpers */
import { formatPrice } from '../helpers/formatPrice';
import { calculateOutcomes } from '../helpers/calculateOutcomes';
/* components */
import { Incomes } from './Incomes';
import { OtherIncomesTable } from './OtherIncomesTable';
import { Outcomes } from './Outcomes';
import { ModalAddPrice } from './ModalAddPrice';
import { ModalAddOutcome } from './ModalAddOutcome';
import { EditIncomeModal } from './EditIncomeModal';
import { OtherIncomesModal } from './OtherIncomesModal';
import { calculateIncomes } from '../helpers/calculateIncomes';

export const IncomesWrapper = ({
   setAlertState,
   setAlertContent,
   date,
   registerData,
   setRegisterData,
}) => {
   /* props */
   const {
      bills,
      incomes,
      outcomes,
      incomes: { totalSales },
      outcomes: { totalEfectivo, totalCheques, totalEgresos },
   } = registerData;
   
   /* states */
   const [showAddIncome, setShowAddIncome] = useState(false);
   const [showAddOutcome, setShowAddOutcome] = useState(false);
   const [showOtherIncomesModal, setShowOtherIncomesModal] = useState(false);
   const [editOutcome, setEditOutcome] = useState({ state: false, content: undefined });
   const [editIncome, setEditIncome] = useState({ state: false, type: undefined });
   const [editOtherIncome, setEditOtherIncome] = useState({ state: false, content: undefined });
   
   /* handleCalculateOutcomes */
   /* const handleCalculateOutcomes = useCallback(() => {
      const newIncomes = calculateIncomes(bills, incomes);
      const newOutcomes = calculateOutcomes(outcomes, newIncomes);
      setRegisterData({
         ...registerData,
         incomes: newIncomes,
         outcomes: newOutcomes,
      });
   }, []);

   useEffect(() => {
      // DONE: By using useCallback hook we need to calculate the outcomes
      handleCalculateOutcomes();
   }, []); */

   return (
      <>
         <section className="incomes">
            <article className='incomes-wrapper'>
               <article className="totals-on-day">
                  <p>VENTAS DEL DÍA: { formatPrice(totalSales) }</p>
                  <p>TOTAL EFECTIVO: { formatPrice(totalEfectivo) }</p>
                  <p>TOTAL CHEQUES: { formatPrice(totalCheques) }</p>
                  <p>TOTAL: { formatPrice(totalEgresos) }</p>
               </article>
               <header className="wrapper-header">
                  <h3>Ingresos y egresos</h3>
                  <nav className='wrapper-header-nav'>
                     <button
                        className='btn btn-add'
                        onClick={ () => setShowOtherIncomesModal(true) }>
                        Agregar Entrada con detalle
                     </button>
                     <button
                        className='btn btn-add'
                        onClick={ () => setShowAddIncome(true) }>
                        Agregar Entrada
                     </button>
                     <button
                        className='btn btn-add'
                        onClick={ () => setShowAddOutcome(true) }>
                        Agregar Salida
                     </button>
                  </nav>
               </header>
               <Incomes
                  registerData={ registerData }
                  incomes={ incomes }
                  date={ date }
                  setRegisterData={ setRegisterData }
                  setAlertState={ setAlertState }
                  setAlertContent={ setAlertContent }
                  setEditIncome={ setEditIncome }
               />
               <OtherIncomesTable
                  registerData={ registerData }
                  setRegisterData={ setRegisterData }
                  setAlertState={ setAlertState }
                  setAlertContent={ setAlertContent }
                  setEditOtherIncome={ setEditOtherIncome }
                  date={ date }
               />
               <Outcomes
                  registerData={ registerData }
                  date={ date }
                  setRegisterData={ setRegisterData }
                  setAlertState={ setAlertState }
                  setAlertContent={ setAlertContent }
                  setEditOutcome={ setEditOutcome }
               />
            </article>
         </section>

         { showAddIncome &&
            <ModalAddPrice
               setShowAddIncome={ setShowAddIncome }
               setAlertState={ setAlertState }
               setAlertContent={ setAlertContent }
               date={ date }
               registerData={ registerData }
               setRegisterData={ setRegisterData }
            />
         }

         { editIncome.state &&
            <EditIncomeModal
               registerData={ registerData }
               editIncome={ editIncome }
               setEditIncome={ setEditIncome }
               setAlertState={ setAlertState }
               setAlertContent={ setAlertContent }
               setRegisterData={ setRegisterData }
               date={ date }
            />
         }

         { (showOtherIncomesModal || editOtherIncome.state ) &&
            <OtherIncomesModal
               registerData={ registerData }
               setRegisterData={ setRegisterData }
               setShowOtherIncomesModal={ setShowOtherIncomesModal }
               setAlertState={ setAlertState }
               setAlertContent={ setAlertContent }
               editOtherIncome={ editOtherIncome }
               setEditOtherIncome={ setEditOtherIncome }
               date={ date }
            />
         }

         { (showAddOutcome || editOutcome.state === true) &&
            <ModalAddOutcome
               setShowAddOutcome={ setShowAddOutcome }
               setAlertState={ setAlertState }
               setAlertContent={ setAlertContent }
               date={ date }
               registerData={ registerData }
               setRegisterData={ setRegisterData }
               editOutcome={ editOutcome }
               setEditOutcome={ setEditOutcome }
            />
         }
      </>
   );
};