import React, { useState } from 'react';
/* hooks */
import { useMonthRegisters } from '../contexts/MonthContexts';
/* components */
import { MonthHeader } from './MonthHeader';
import { RegisterTable } from './RegisterTable';
import { IncomesOutcomes } from './IncomesOutcomes';
/* assets */
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export const MonthRegisters = ({ date }) => {
   /* contexts */
   const { data } = useMonthRegisters();
   
   /* useState */
   const [showBills, setShowBills] = useState(true);
   const [showData, setShowData] = useState(true);
   return (
      <>
         <MonthHeader
            date={ date }
            data={ data }
         />

         <section className='register-wrapper container'>
            <header className='registers-header'>
               <h3>{ data.length > 0 ? 'Ingresos y egresos del mes' : 'No hay datos para mostrar' }</h3>
               <button
                  className='btn btn-icon'
                  onClick={ () => setShowData(!showData) }>
                  { showData
                     ? <FiChevronDown className='icon' />
                     : <FiChevronUp className="icon" />
                  }
               </button>
            </header>

            { showData &&
               <IncomesOutcomes
                  data={ data }
                  date={ date }
               />
            }
         </section>

         <section className='registers-wrapper container'>
            <header className="registers-header">
               <h3>{ data.length > 0 ? 'Facturas hechas en el mes' : 'No hay facturas de este mes' }</h3>
               <button
                  className='btn btn-icon'
                  onClick={ () => setShowBills(!showBills) }>
                  { showBills
                     ? <FiChevronDown className='icon' />
                     : <FiChevronUp className="icon" />
                  }
               </button>
            </header>

            { showBills &&
               <section className='register-content'>
                  <table className='register-table'>
                     <thead>
                        <tr className='table-row-header'>
                           <th>N°</th>
                           <th>CLIENTE</th>
                           <th>REF</th>
                           <th>PAGO</th>
                           <th>CONTADO</th>
                           <th>CHEQUE</th>
                           <th>POS</th>
                           <th>LINEA</th>
                           <th>CREDITO PENDIENTE</th>
                        </tr>
                     </thead>
                     <tbody>
                        { data.length > 0 &&
                           data.map((register) => (
                              <RegisterTable
                                 key={ register.id }
                                 register={ register }
                              />
                           ))
                        }
                     </tbody>
                  </table>
               </section>
            }
         </section>
      </>
   );
};