import React, { useState, useEffect, useCallback } from 'react';
/* hooks */
import { useCostumers } from '../contexts/CostumersContext';
/* helpers */
import { formatPrice } from '../helpers/formatPrice';
/* components */
import { Link } from 'react-router-dom';
import { BillsTableRow } from './BillsTableRow';
/* helpers */
import { calculateIncomes } from '../helpers/calculateIncomes';
import { calculateOutcomes } from '../helpers/calculateOutcomes';
/* assets */
import { FiChevronDown } from 'react-icons/fi';

export const Bills = ({
   date: { year, month, day },
   setEditBill,
   registerData,
   setRegisterData,
   setAlertState,
   setAlertContent,
}) => {
   /* hooks */
   const { bills, incomes, outcomes } = registerData;

   /* states */
   const [totalsOnDay, setTotalsOnDay] = useState({});
   const [showFilterBy, setShowFilterBy] = useState(false);
   const [filterBy, setFilterBy] = useState({ label: 'TODOS', results: [] });

   /* handleFilterBy */
   const handleFilterBy = (id) => {
      // Filter bills that match with the id parameter
      const filteredBills = bills.filter(({ ref }) => ref.includes(id));
      setFilterBy({ label: id, results: filteredBills });
   };

   /* handleCalculateTotal */
   const handleCalculateTotal = useCallback(() => {
      // Reset alert state.
      setAlertState(false);
      setAlertContent({});

      /* global functions variables */
      let count = {
         totalValuos: 0,
         totalValuosSm: 0,
         totalRecuperados: 0,
         totalTallerMatriz: 0,
         totalTallerSm: 0,
      };

      if( bills.length > 0 ) {
         // DONE: We need to calculate the incomes depending on bills arrays and its values
         let valuos = 0;
         let valuosSm = 0;
         let recuperados = 0;
         let diagnostico = 0;
         let tallerMatriz = 0;
         let tallerSm = 0;

         // Now we need to loop on every item to get its values and type to sum to the corresponnding total let variable
         bills.forEach(({ ref }) => {
            // Sum +1 according to ref value
            switch( ref ) {
               case 'VALÚO':
                  valuos += 1;
               break;
               case 'RECUPERADO':
                  recuperados += 1;
               break;
               case 'CONSIGNA':
                  valuos += 1;
               break;
               case 'BANDESAL':
                  valuos += 1;
               break;
               case 'DOMICILIO':
                  valuos += 1;
               break;
               case 'DOMICILIO RECUPERADO':
                  recuperados += 1;
               break;
               case 'TALLER CASA MATRIZ':
                  tallerMatriz += 1;
               break;
               case 'SM VALUOS':
                  valuosSm += 1;
               break;
               case 'SM TALLER':
                  tallerSm += 1;
               break;
               default:
                  break;
            };
         });

         // Now, we need to update the totalsOnDay state and registerData to storage totals data, but DO NOT UPLOAD CHANGES TO FIREBASE
         count = {
            totalValuos: valuos,
            totalValuosSm: valuosSm,
            totalRecuperados: recuperados,
            totalTaller: diagnostico,
            totalTallerMatriz: tallerMatriz, 
            totalTallerSm: tallerSm,
         };
         setTotalsOnDay({ ...count });

         // Update the incomes and outcomes to update registerData
         const newIncomes = calculateIncomes(bills, incomes);
         const newOutcomes = calculateOutcomes(outcomes, newIncomes);
         
         // Update the registerData context
         setRegisterData({
            ...registerData,
            incomes: newIncomes,
            outcomes: newOutcomes,
         });

         setAlertState(true);
         setAlertContent({
            type: 'success',
            message: 'Registro calculado con éxito',
         });
      } else if ( bills.length === 0 ) {
         // DONE: When there is no bills we need to calculate all totals to zero
         setTotalsOnDay({ ...count });
      };
   }, []);

   /* Effect that will calculate the totals through day */
   useEffect(() => {
      handleCalculateTotal();
   }, []);

   return (
      <section className="bills">
         <Link to={ `/new-bill/${ year }/${ month }/${ day }` } className='btn btn-new-bill'>Crear nueva factura</Link>
         <section className="bills-wrapper">
            <header className="bills-header">
               { bills.length > 0 && <h3>Últimas facturas creadas</h3> }
               { bills.length > 0 &&
                  <div className="btn btn-filter" onClick={ () => setShowFilterBy(!showFilterBy) }>
                     <p>{ filterBy.label }</p>
                     <FiChevronDown className='btn-icon' />
                     { showFilterBy &&
                        <nav className='filter-options'>
                           <button
                              className='btn btn-option'
                              onClick={ () => handleFilterBy('TODOS') }>
                              TODOS
                           </button>
                           <button
                              className='btn btn-option'
                              onClick={ () => handleFilterBy('VALÚO') }>
                              VALÚO
                           </button>
                           <button
                              className='btn btn-option'
                              onClick={ () => handleFilterBy('RECUPERADO') }>
                              RECUPERADO
                           </button>
                           <button
                              className='btn btn-option'
                              onClick={ () => handleFilterBy('DOMICILIO') }>
                              DOMICILIO
                           </button>
                           <button
                              className='btn btn-option'
                              onClick={ () => handleFilterBy('DIAGNÓSTICO MECANICO') }>
                              DIAGNÓSTICO MECANICO
                           </button>
                           <button
                              className='btn btn-option'
                              onClick={ () => handleFilterBy('TALLER') }>
                              TALLER
                           </button>
                           <button
                              className='btn btn-option'
                              onClick={ () => handleFilterBy('SAN MIGUEL') }>
                              SAN MIGUEL
                           </button>
                           <button
                              className='btn btn-option'
                              onClick={ () => handleFilterBy('DURAZNOS') }>
                              DURAZNOS
                           </button>
                        </nav>
                     }
                  </div>
               }
            </header>
            { bills.length > 0 ?
               <>
                  <table className='bills-table'>
                     <thead>
                        <tr className="table-row-header">
                           <th>N°</th>
                           <th>CLIENTE</th>
                           <th>REF</th>
                           <th>PAGO</th>
                           <th>CONTADO</th>
                           <th>CHEQUE</th>
                           <th>POS</th>
                           <th>LINEA</th>
                           <th>CREDITO PTE</th>
                           <th>EDITAR</th>
                        </tr>
                     </thead>
                     <tbody>
                        { filterBy.results.length > 0 ?
                           filterBy.results.map((bill, index) => (
                              <BillsTableRow
                                 key={ bill.id }
                                 bill={ bill }
                                 index={ index }
                                 bills={ bills }
                                 setEditBill={ setEditBill }
                                 date={{ year: year, month: month, day: day }}
                              />
                           ))
                           :
                           bills.length > 0 &&
                              bills.map((bill, index) => (
                                 <BillsTableRow
                                    key={ bill.id }
                                    bill={ bill }
                                    index={ index }
                                    bills={ bills }
                                    setEditBill={ setEditBill }
                                    date={{ year: year, month: month, day: day }}
                                 />
                              ))
                        }
                     </tbody>
                  </table>
                  <article className="bills-info">
                     <p>CONTADO: { formatPrice(incomes.totalContado) }</p>
                     <p>CHEQUE: { formatPrice(incomes.totalCheques) }</p>
                     <p>POS: { formatPrice(incomes.totalPos) }</p>
                     <p>TRANSFERENCIA: { formatPrice(incomes.totalLinea) }</p>
                     <p>CREDITO PTE: { formatPrice(incomes.totalCreditoPendiente) }</p>
                     <p>VALÚOS: { totalsOnDay.totalValuos }</p>
                     <p>VALÚOS SAN MIGUEL: { totalsOnDay.totalValuosSm }</p>
                     <p>RECUPERADOS: { totalsOnDay.totalRecuperados }</p>
                     <p>TALLER CASA MATRIZ: { totalsOnDay.totalTallerMatriz }</p>
                     <p>TALLER SAN MIGUEL: { totalsOnDay.totalTallerSm }</p>
                  </article>
               </>
               :
               <article className='empty-bills'>
                  <h2>No hay facturas en este día</h2>
               </article>
            }
         </section>
      </section>
   );
};