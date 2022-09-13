import React, { useEffect } from 'react';
/* hooks */
import { useNavigate } from 'react-router-dom';
import { useNewBill } from '../contexts/NewBillContext';
/* assets */
import { FiX } from 'react-icons/fi';
import { uploadNewBill } from '../helpers/firebaseHelpers';

export const CancelModal = ({
   setShowCancelModal,
   date: { year, month, day },
   resetBill,
   editBill,
   setEditBill,
   registerData,
   setAlertState,
   setAlertContent,
}) => {
   /* hooks */
   const navigate = useNavigate();
   const { newBill } = useNewBill();
   
   /* handleWithoutSave */
   const handleWithoutSave = () => {
      setEditBill(false);
      resetBill();
      navigate(`/register/${ year }/${ month }/${ day }`, { replace: true });
   };

   /* handleSaveAndQuit */
   const handleSaveAndQuit = async () => {
      if( newBill.costumer === '' || newBill.costumer === undefined ) {
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Asegurate de escribir el nombre del cliente',
         });
         return;
      };

      try {
         await uploadNewBill(newBill, registerData, year, month, day, editBill);
         resetBill();
         setAlertState(true);
         setAlertContent({
            type: 'success',
            message: 'Factura guardada con éxito',
         });
         setEditBill();
         navigate(`/register/${ year }/${ month }/${ day }/`, { replace: true });
      } catch(error) {
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Hubo un error, vuelve a intentarlo',
         });
      };
   };

   /* Effect that will close the modal */
   useEffect(() => {
      window.addEventListener('keydown', ({ key }) => key === 'Escape' && setShowCancelModal(false));
      return () => {
         window.addEventListener('keydown', ({ key }) => key === 'Escape' && setShowCancelModal(false));
      };
   }, []);

   return (
      <section className="shadow-modal">
         <article className="modal cancel-modal half-modal">
            <h3>¿Qué quieres al salir?</h3>
            <nav className='cancel-modal-nav'>
               <button
                  className='btn btn-option active'
                  onClick={ handleSaveAndQuit }>
                  Guardar y salir
               </button>
               <button
                  className='btn btn-option'
                  onClick={ handleWithoutSave }>
                  Salir sin guardar
               </button>
            </nav>
            <FiX
               className='btn btn-close-modal icon'
               onClick={ () => setShowCancelModal(false) }
            />
         </article>
      </section>
   );
};