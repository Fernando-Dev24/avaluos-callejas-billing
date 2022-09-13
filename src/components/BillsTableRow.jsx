import React from 'react';
/* hooks */
import { useNewBill } from '../contexts/NewBillContext';
/* helpers */
import { formatPrice } from '../helpers/formatPrice';
import { useNavigate } from 'react-router-dom';
/* assets */
import { FiEdit2 } from 'react-icons/fi';

export const BillsTableRow = ({
   bill: { costumer, ref, state, contado, cheque, pos, linea, creditoPendiente, id },
   index,
   setEditBill,
   bills,
   date: { year, month, day }
}) => {
   /* hooks */
   const { setNewBill } = useNewBill();
   const navigate = useNavigate();

   /* handleEditBill */
   const handleEditBill = (id) => {
      // Filter bill accordingly to id parameter
      const [ targetBill ] = bills.filter(({ id: billId }) => billId === id);
      // Setting to editBill
      setNewBill({ ...targetBill });
      setEditBill(true);
      navigate(`/new-bill/${ year }/${ month }/${ day }`);
   };

   return (
      <>
         <tr
            className='table-row-body'>
            <td>{ index + 1 }</td>
            <td>{ costumer }</td>
            <td>{ ref }</td>
            <td>{ state }</td>
            <td>{ formatPrice(contado) }</td>
            <td>{ formatPrice(cheque) }</td>
            <td>{ formatPrice(pos) }</td>
            <td>{ formatPrice(linea) }</td>
            <td>{ formatPrice(creditoPendiente) }</td>
            <td>
               <button
                  className='btn btn-option'
                  onClick={ () => handleEditBill(id) }>
                  <FiEdit2 className='btn-icon' />
               </button>
            </td>
         </tr>
      </>
   );
};