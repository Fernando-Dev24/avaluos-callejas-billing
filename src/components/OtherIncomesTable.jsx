import React from 'react';
/* helpers */
import { formatPrice } from '../helpers/formatPrice';
import { deleteOtherIncome } from '../helpers/otherIncomesTriggers';
/* assets */
import { FiEdit2, FiTrash } from 'react-icons/fi';

export const OtherIncomesTable = ({
   date,
   registerData,
   setRegisterData,
   setAlertState,
   setAlertContent,
   setEditOtherIncome,
}) => {
   const { incomes: { otherIncomesList } } = registerData;

   /* handleDeleteOtherIncome */
   const handleDeleteOtherIncome = async (otherIncomeId) => {
      // Filter the target otherIncome item to delete it
      const restOfOtherIncomes = otherIncomesList.filter(({ id }) => id !== otherIncomeId);

      // DONE: Now, we need to calculate everything again
      try {
         await deleteOtherIncome(registerData, setRegisterData, restOfOtherIncomes, date);
         setAlertState(true);
         setAlertContent({
            type: 'success',
            message: 'Ingreso eliminado con éxito',
         });
      } catch(error) {
         console.log(error);
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Hubo un error, vuelve a intentarlo',
         });
      };
   };

   /* handleEditOtherIncome */
   const handleEditOtherIncome = async (otherIncomeId) => {
      // Filter the target other income to edit it
      const [ targetOtherIncome ] = otherIncomesList.filter(({ id }) => id === otherIncomeId);
      setEditOtherIncome({ state: true, content: targetOtherIncome });
   };

   return (
      <>
         <article className="other-incomes-wrapper">
            <h3>Otros Ingresos</h3>
            <table className='other-incomes-table'>
               <thead>
                  <tr className="table-row-header">
                     <th>DESCRIPCIÓN</th>
                     <th>VALOR</th>
                     <th>EDITAR</th>
                     <th>ELIMINAR</th>
                  </tr>
               </thead>
               <tbody>
                  { otherIncomesList.length > 0 ?
                     otherIncomesList.map(({ id, description, incomeValue }) => (
                        <tr key={ id } className='table-row-body'>
                           <td>{ description }</td>
                           <td>{ formatPrice(incomeValue) }</td>
                           <td>
                        <button
                           className='btn btn-option'
                           onClick={ () => handleEditOtherIncome(id) }>
                           <FiEdit2 className='btn-icon' />
                        </button>
                     </td>
                     <td>
                        <button
                           className='btn btn-option'
                           onClick={ () => handleDeleteOtherIncome(id) }>
                           <FiTrash className='btn-icon' />
                        </button>
                     </td>
                        </tr>
                     ))
                     :
                     <tr className='table-row-body'>
                        <td
                           colSpan={ 4 }
                           className="empty-cell">
                           No existen Otros Ingresos
                        </td>
                     </tr>
                  }
               </tbody>
            </table>
         </article>
      </>
   );
};