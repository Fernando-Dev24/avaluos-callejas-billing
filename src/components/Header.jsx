import React, { useState } from 'react';
/* hooks */
import { useNavigate, useLocation, Link } from 'react-router-dom';
/* helpers */
import { authSignOut, saveData } from '../helpers/firebaseHelpers';
/* components */
import { AsideMenu } from './AsideMenu';
/* assets */
import { FiMenu } from 'react-icons/fi';

export const Header = ({
   registerData,
   date,
   setAlertState,
   setAlertContent,
}) => {
   /* hooks */
   const navigate = useNavigate();
   const { pathname } = useLocation();

   /* states */
   const [showAsideMenu, setShowAsideMenu] = useState(false);

   /* handleBack */
   const handleBack = async () => {
      try {
         await saveData(registerData, date);
         setAlertState(true);
         setAlertContent({
            type: 'success',
            message: 'Datos guardados con éxito',
         });
         navigate('/', { replace: true, });
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
      <>
         <header className='header'>
            <section className="header-content container">
               <article className="header-title">
                  <span>FACTURACIÓN</span>
                  <h4>Avalúos Callejas & Asociados</h4>
               </article>
               <nav className='header-nav'>
                  <button
                     className='btn btn-option icon'
                     onClick={ () => setShowAsideMenu(true) }>
                     <FiMenu className='btn-icon' />
                  </button>
               </nav>
            </section>
         </header>

         { showAsideMenu &&
            <AsideMenu
               setShowAsideMenu={ setShowAsideMenu }
               setAlertState={ setAlertState }
               setAlertContent={ setAlertContent }
               registerData={ registerData }
               date={ date }
            />
         }
      </>
   );
};