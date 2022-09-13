import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
/* assets */
import { FiX } from 'react-icons/fi';
import { authSignOut, saveData } from '../helpers/firebaseHelpers';

export const AsideMenu = ({
   setShowAsideMenu,
   setAlertState,
   setAlertContent,
   registerData,
   date,
}) => {
   /* hooks */
   const navigate = useNavigate()
   const { pathname } = useLocation();

   /* functions */
   const handleSaveData = async () => {
      try {
         await saveData(registerData, date);
         setAlertState(true);
         setAlertContent({
            type: 'success',
            message: 'Datos guardados con éxito',
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

   const handleWatchMonth = async () => {
      try {
         await handleSaveData();
         navigate(`/all-registers/${ date.year }/${ date.month }`, { replace: true });
      } catch(error) {
         console.log(error);
         setAlertState(true);
         setAlertContent({
            type: 'error',
            message: 'Hubo un problema vuelve a intentarlo',
         });
      };
   };

   const handleSignOut = async () => {
      try {
         await authSignOut();
         navigate('/login', { replace: true, });
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
      <section className="shadow">
         <aside className="aside-menu">
            <nav className="navbar-wrapper">
               <button
                  className='btn btn-aside close'
                  onClick={ () => setShowAsideMenu(false) }>
                  <FiX className='icon' />
               </button>
               <Link
                  className='btn btn-aside'
                  to="/costumers">
                  Ver registros de clientes
               </Link>
               { pathname.includes('register') &&
                  <button
                     className='btn btn-aside'
                     onClick={ handleWatchMonth }>
                     Ver Ingresos del mes
                  </button>
               }
               <button
                  className='btn btn-aside logout'
                  onClick={ handleSignOut }>
                  Cerrar sesión
               </button>
            </nav>
         </aside>
      </section>
   );
};