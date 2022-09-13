/* helpers */
import { formatPrice } from "../helpers/formatPrice";
/* assets */
import { FiEdit2 } from 'react-icons/fi';

export const Incomes = ({
   registerData,
   setEditIncome,
}) => {
   /* props */
   const { incomes } = registerData;

   /* handleEditIncomes */
   const handleEditIncome = (incomeType) => {
      setEditIncome({ state: true, content: incomeType });
   };
   
   return (
      <>
         <table className="incomes-table">
            <thead>
               <tr
                  className="table-row-header">
                  <th>DESCRIPCIÓN</th>
                  <th>ENTRADA</th>
                  <th>EDITAR</th>
               </tr>
            </thead>
            <tbody>
               <tr className='table-row-body'>
                  <td>OTROS INGRESOS</td>
                  <td colSpan={ 2 }>{ formatPrice(incomes.otherIncomes) }</td>
               </tr>
               <tr className='table-row-body matriz'>
                  <td>SALDO ANTERIOR - EFECTIVO (CASA MATRIZ)</td>
                  <td>{ formatPrice(incomes.anteriorEfectivo) }</td>
                  <td>
                     <button
                        className="btn btn-option"
                        onClick={ () => handleEditIncome('SALDO ANTERIOR EFECTIVO') }>
                        <FiEdit2 className="btn-icon" />
                     </button>
                  </td>
               </tr>
               <tr className='table-row-body matriz'>
                  <td>SALDO ANTERIOR - CHEQUES (CASA MATRIZ)</td>
                  <td>{ formatPrice(incomes.anteriorCheques) }</td>
                  <td>
                     <button
                        className="btn btn-option"
                        onClick={ () => handleEditIncome('SALDO ANTERIOR CHEQUES') }>
                        <FiEdit2 className="btn-icon" />
                     </button>
                  </td>
               </tr>
               <tr className='table-row-body san-miguel'>
                  <td>SALDO ANTERIOR - EFECTIVO (SAN MIGUEL)</td>
                  <td>{ formatPrice(incomes.anteriorEfectivoSm) }</td>
                  <td>
                     <button
                        className="btn btn-option"
                        onClick={ () => handleEditIncome('SALDO ANTERIOR EFECTIVO SAN MIGUEL') }>
                        <FiEdit2 className="btn-icon" />
                     </button>
                  </td>
               </tr>
               <tr className='table-row-body san-miguel'>
                  <td>SALDO ANTERIOR - CHEQUES (SAN MIGUEL)</td>
                  <td>{ formatPrice(incomes.anteriorChequeSm) }</td>
                  <td>
                     <button
                        className="btn btn-option"
                        onClick={ () => handleEditIncome('SALDO ANTERIOR CHEQUES SAN MIGUEL') }>
                        <FiEdit2 className="btn-icon" />
                     </button>
                  </td>
               </tr>
               <tr className='table-row-body'>
                  <td>TOTAL CONTADO</td>
                  <td colSpan={ 2 }>{ formatPrice(incomes.totalContado) }</td>
               </tr>
               <tr className='table-row-body'>
                  <td>TOTAL CHEQUES</td>
                  <td colSpan={ 2 }>{ formatPrice(incomes.totalCheques) }</td>
               </tr>
               <tr className='table-row-body'>
                  <td>TOTAL TARJETA</td>
                  <td colSpan={ 2 }>{ formatPrice(incomes.totalPos) }</td>
               </tr>
               <tr className='table-row-body'>
                  <td>TOTAL TRANSFERENCIAS</td>
                  <td colSpan={ 2 }>{ formatPrice(incomes.totalLinea) }</td>
               </tr>
               <tr className='table-row-body'>
                  <td>PENDIENTE</td>
                  <td colSpan={ 2 }>{ formatPrice(incomes.totalCreditoPendiente) }</td>
               </tr>
               <tr className='table-row-body duraznos'>
                  <td>DURAZNOS EFECTIVO</td>
                  <td>{ formatPrice(incomes.totalDuraznosContado) }</td>
                  <td>
                     <button
                        className="btn btn-option"
                        onClick={ () => handleEditIncome('DURAZNOS EFECTIVO') }>
                        <FiEdit2 className="btn-icon" />
                     </button>
                  </td>
               </tr>
               <tr className='table-row-body duraznos'>
                  <td>DURAZNOS CHEQUES</td>
                  <td>{ formatPrice(incomes.totalDuraznosCheques) }</td>
                  <td>
                     <button
                        className="btn btn-option"
                        onClick={ () => handleEditIncome('DURAZNOS CHEQUES') }>
                        <FiEdit2 className="btn-icon" />
                     </button>
                  </td>
               </tr>
               <tr className="table-row-body matriz">
                  <td>TOTAL CASA MATRIZ EFECTIVO</td>
                  <td colSpan={ 2 }>{ formatPrice(incomes.totalMatrizEfectivo) }</td>
               </tr>
               <tr className="table-row-body matriz">
                  <td>TOTAL CASA MATRIZ CHEQUES</td>
                  <td colSpan={ 2 }>{ formatPrice(incomes.totalMatrizCheques) }</td>
               </tr>
               <tr className="table-row-body san-miguel">
                  <td>TOTAL SAN MIGUEL EFECTIVO</td>
                  <td colSpan={ 2 }>{ formatPrice(incomes.totalSanMiguelEfectivo) }</td>
               </tr>
               <tr className="table-row-body san-miguel">
                  <td>TOTAL SAN MIGUEL CHEQUES</td>
                  <td colSpan={ 2 }>{ formatPrice(incomes.totalSanMiguelCheques) }</td>
               </tr>
               <tr className="table-row-body matriz">
                  <td>TOTAL CASA MATRIZ VALUOS</td>
                  <td colSpan={ 2 }>{ formatPrice(incomes.totalMatrizValuos) }</td>
               </tr>
               <tr className="table-row-body matriz">
                  <td>TOTAL CASA MATRIZ TALLER</td>
                  <td colSpan={ 2 }>{ formatPrice(incomes.totalMatrizTaller) }</td>
               </tr>
               <tr className="table-row-body san-miguel">
                  <td>TOTAL SAN MIGUEL VALUOS</td>
                  <td colSpan={ 2 }>{ formatPrice(incomes.totalSanMiguelValuos) }</td>
               </tr>
               <tr className="table-row-body san-miguel">
                  <td>TOTAL SAN MIGUEL TALLER</td>
                  <td colSpan={ 2 }>{ formatPrice(incomes.totalSanMiguelTaller) }</td>
               </tr>
               <tr className='table-row-body'>
                  <td>TOTAL VENTAS EFECTIVO</td>
                  <td colSpan={ 2 }>{ formatPrice(incomes.totalSalesEfectivo) }</td>
               </tr>
               <tr className='table-row-body'>
                  <td>TOTAL VENTAS CHEQUES</td>
                  <td colSpan={ 2 }>{ formatPrice(incomes.totalSalesCheques) }</td>
               </tr>
               <tr className='table-row-body'>
                  <td>TOTAL VENTAS</td>
                  <td colSpan={ 2 }>{ formatPrice(incomes.totalSales) }</td>
               </tr>
            </tbody>
         </table>
      </>
   );
};