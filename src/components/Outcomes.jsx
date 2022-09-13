/* helpers */
import { formatPrice } from '../helpers/formatPrice';
import { removeOutcome } from "../helpers/outcomesActions";
/* assets */
import { FiEdit2, FiTrash } from 'react-icons/fi';

export const Outcomes = ({
   registerData,
   date,
   setRegisterData,
   setAlertState,
   setAlertContent,
   setEditOutcome,
}) => {
   /* props */
   const { outcomes: { outcomesList } } = registerData;

   /* functions */
   const handleEditOutcome = async (id) => {
      // DONE: Filter the index of the targetOutcome by its id, and calculate totals again
      try {
         // Filter the target outcome by its id and set a new outcome to id on state
         const [ targetOutcome ] = outcomesList.filter(({ id: outcomeId }) => outcomeId === id);
         setEditOutcome({ state: true, content: targetOutcome });
      } catch(error) {
         console.log(error);
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Hubo un error, vuelve a intentarlo',
         });
      };
   };

   const handleDeleteOutcome = async (id) => {
      // DONE: Delete outcome and calculate totals again
      try {
         await removeOutcome(registerData, setRegisterData, date, id);
         setAlertState(true);
         setAlertContent({
            type: 'success',
            message: 'Salida eliminada con éxito',
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

   return (
      <table className="outcomes-table">
         <thead>
            <tr
               className="table-row-header">
               <th>TIPO</th>
               <th>METODO DE PAGO</th>
               <th>DESCRIPCIÓN</th>
               <th>VALOR DE SALIDA</th>
               <th>Editar</th>
               <th>Eliminar</th>
            </tr>
         </thead>
         <tbody>
            { outcomesList.length > 0 ?
               outcomesList.map(({ type, payMethod, description, price, id }) => (
                  <tr key={ id } className="table-row-body">
                     <td>{ type }</td>
                     <td>{ payMethod }</td>
                     <td>{ description === '' ? '-' : description }</td>
                     <td>{ formatPrice(price) }</td>
                     <td>
                        <button
                           className="btn btn-option"
                           onClick={ () => handleEditOutcome(id) }>
                           <FiEdit2 className="btn-icon" />
                        </button>
                     </td>
                     <td>
                        <button
                           className="btn btn-option"
                           onClick={ () => handleDeleteOutcome(id) }>
                           <FiTrash className="btn-icon" />
                        </button>
                     </td>
                  </tr>
               ))
               :
               <tr className="table-row-body">
                  <td
                     colSpan={ 6 }
                     className='empty-cell'>
                     No existe ninguna salida
                  </td>
               </tr>
            }
         </tbody>
      </table>
   );
};