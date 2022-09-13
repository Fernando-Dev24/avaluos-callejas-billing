import React, { useEffect } from 'react';
/* hooks */
import { useCostumers } from '../contexts/CostumersContext';
/* helpers */
import { deleteCostumer } from '../helpers/costumerTriggers';
/* assets */
import { FiX, FiTrash } from 'react-icons/fi';

export const CostumersListModal = ({ setShowModal, setAlertState, setAlertContent }) => {
   /* hooks */
   const { costumers } = useCostumers();

   /* handleDelete */
   const handleDelete = async (id) => {
      try {
         await deleteCostumer(id);
         setAlertState(true);
         setAlertContent({
            type: 'success',
            message: 'Registro eliminado con éxito',
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

   /* Effect to close modal */
   useEffect(() => {
      const killEffect = window.addEventListener("keydown", ({ key }) => {
         if( key === 'Escape' ) setShowModal(false);
      });
      return killEffect;
   }, []);

   return (
      <section className='shadow-modal'>
         <article className="modal costumers-list overflow">
            <h3>Registro de clientes</h3>
            <article className="costumers-list">
               <table className="costumers-table">
                  <thead>
                     <tr className="table-row-header">
                        <th>Razón Social</th>
                        <th>N° de Registro</th>
                        <th>NIT o DUI</th>
                        <th>Dirección</th>
                        <th>Giro</th>
                        <th>Editar</th>
                     </tr>
                  </thead>
                  <tbody>
                     { costumers.length > 0 ?
                        costumers.map(({
                           id,
                           name,
                           registerNumber,
                           adress,
                           giro,
                           personalId,
                        }) => (
                           <tr key={ id } className='table-row-body'>
                              <td>{ name }</td>
                              <td>{ registerNumber }</td>
                              <td>{ personalId }</td>
                              <td>{ adress }</td>
                              <td>{ giro }</td>
                              <td>
                                 <button
                                    className='btn btn-option'
                                    onClick={ () => handleDelete(id) }>
                                    <FiTrash className='btn-icon' />
                                 </button>
                              </td>
                           </tr>
                        ))
                        :
                        <tr className="table-row-body">
                           <td colSpan={ 6 } style={{ fontSize: "18px" }}>
                              No hay registros de clientes en la base de datos
                           </td>
                        </tr>
                     }
                  </tbody>
               </table>
            </article>
            <FiX
               className='btn btn-close-modal icon'
               onClick={ () => setShowModal(false) }
            />
         </article>
      </section>
   );
};