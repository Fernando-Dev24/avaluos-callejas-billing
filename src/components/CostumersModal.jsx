import React, { useEffect } from 'react';
/* hooks */
import { useCostumers } from '../contexts/CostumersContext';
/* helpers */
import { editCostumer, deleteCostumer } from '../helpers/costumerTriggers';
/* assets */
import { FiX } from 'react-icons/fi';

export const CostumersModal = ({
   setShowModal,
   costumerOptions,
   costumers,
   setCostumerOptions,
   setAlertState,
   setAlertContent,
}) => {
   /* hooks */
   const { setCostumers } = useCostumers();

   /* props */
   const {
      name,
      registerNumber,
      personalId,
      adress,
      giro
   } = costumerOptions.editContent;

   /* closeModal */
   const closeModal = () => {
      setCostumerOptions({});
      setShowModal(false);
   };

   /* handleEditRegister */
   const handleEditRegister = ({ target }) => {
      setCostumerOptions({
         ...costumerOptions,
         editContent: {
            ...costumerOptions.editContent,
            [target.name]: target.value,
         },
      });
   };

   /* handleDeleteCostumer */
   const handleDeleteCostumer = async (e) => {
      e.preventDefault();
      
      try {
         // Destructure for easy to use access
         const { id } = costumerOptions.editContent;
         await deleteCostumer(id);
         // Close modal
         setCostumerOptions({});
         setShowModal(false);
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

   /* handleEditSubmit */
   const handleEditSubmit = async (e) => {
      e.preventDefault();
      
      /* Validations */
      if( name === '' || registerNumber === '' || personalId === '' || adress === '' || giro === '' ) {
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Asegurate de rellenar todos los campos',
         });
         return;
      };

      try {
         await editCostumer(costumerOptions.editContent, costumers, setCostumers);
         // Now, we need to execute the alert state and its content and close the modal
         setCostumerOptions({});
         setShowModal(false);
         setAlertState(true);
         setAlertContent({
            type: 'success',
            message: 'Registro editado con éxito',
         });
      } catch(error) {
         console.log(error);
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Hubo un error, vuelve a intentarlo',
         });
      };
   }

   /* Effect that will close the modal when press Escape key */
   useEffect(() => {
      const killEffect = window.addEventListener("keydown", ({ key }) => {
         if( key === 'Escape' ) {
            closeModal();
         };
      });
      return killEffect;
   }, []);

   return (
      <section className='shadow-modal'>
         <article className="modal income-modal overflow">
            <h3>Editar o eliminar un registro</h3>
            <form className='form-modal' onSubmit={ handleEditSubmit }>
               <article className="input-field">
                  <label htmlFor="name">Razón Social (Nombre)</label>
                  <input
                     type="text"
                     name='name'
                     id='name'
                     placeholder='Razón Social (Nombre)'
                     value={ name }
                     onChange={ handleEditRegister }
                  />
               </article>
               <article className="input-field">
                  <label htmlFor="registerNumber">N° de registro</label>
                  <input
                     type="text"
                     name='registerNumber'
                     id='registerNumber'
                     placeholder='N° de registro'
                     value={ registerNumber }
                     onChange={ handleEditRegister }
                  />
               </article>
               <article className="input-field">
                  <label htmlFor="personalId">NIT o DUI</label>
                  <input
                     type="text"
                     name='personalId'
                     id='personalId'
                     placeholder='NIT o DUI'
                     value={ personalId }
                     onChange={ handleEditRegister }
                  />
               </article>
               <article className="input-field">
                  <label htmlFor="adress">Dirección</label>
                  <input
                     type="text"
                     name='adress'
                     id='adress'
                     placeholder='Dirección'
                     value={ adress }
                     onChange={ handleEditRegister }
                  />
               </article>
               <article className="input-field">
                  <label htmlFor="giro">Giro</label>
                  <input
                     type="text"
                     name='giro'
                     id='giro'
                     placeholder='Giro'
                     value={ giro }
                     onChange={ handleEditRegister }
                  />
               </article>
               <article className='modal-row'>
                  <button
                     className='btn btn-option danger'
                     onClick={ handleDeleteCostumer }>
                     Eliminar registro
                  </button>
                  <button className='btn btn-submit'>Editar registro</button>
               </article>
            </form>
            <FiX
               className='btn btn-close-modal icon'
               onClick={ closeModal }
            />
         </article>
      </section>
   );
};