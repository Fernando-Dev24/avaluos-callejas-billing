import React, { useState, useEffect } from 'react';
/* hooks */
import { useParams, useNavigate } from 'react-router-dom';
/* helpers */
import { getSpanishMonth } from '../helpers/getSpanishMonth';
import { getMonthNumber } from '../helpers/getMonthNumber';
/* context */
import { RegisterProvider } from '../contexts/RegisterContext';
/* components */
import { Header } from './Header';
import { Bills } from './Bills';
import { IncomesWrapper } from './IncomesWrapper';

export const Register = ({
   setAlertState,
   setAlertContent,
   registerData,
   setRegisterData,
   setEditBill,
   setShowMonthModal,
   setTargetDate,
}) => {
   /* hooks */
   const { year, month, day } = useParams();
   const navigate = useNavigate();

   /* states */
   const [registerType, setRegisterType] = useState('bills');

   /* handleChangeDay */
   const handleChangeDay = () => {
      // DONE: Need to get the month number by a helper or external function
      const monthId = getMonthNumber(month);
      setTargetDate({ year: year, month: month, monthNumber: monthId });
      setShowMonthModal(true);
   };

   /* handleToogleType */
   const handleToogleType = ({ target }) => {
      // toogle 'active' class when pressed a button
      const registerButtons = [...document.querySelectorAll('.btn-option')];
      registerButtons.forEach((button) => button.classList.remove('active'));
      target.classList.add('active');

      // Change state accordingly to which button user press
      setRegisterType(target.id);
   };
   
   /* Effect that will go back to Home component if year, month, day are undefined */
   useEffect(() => {
      if( year === undefined || month === undefined || day === undefined ) {
         navigate('/');
      };
   }, []);
   
   return (
      <>
         <Header
            registerData={ registerData }
            date={{ year: year, month: month, day: day }}
            setAlertState={ setAlertState }
            setAlertContent={ setAlertContent }
         />
         <section className="register container">
            <header className="register-header">
               <h2>Registro de { day } { getSpanishMonth(month) } { year }</h2>
               <nav className='register-nav'>
                  <button
                     className='btn btn-option'
                     onClick={ handleChangeDay }>
                     Cambiar día
                  </button>
                  <button
                     className='btn btn-option active'
                     id="bills"
                     onClick={ handleToogleType }>
                     Facturación
                  </button>
                  <button
                     className='btn btn-option'
                     id='incomes-outcomes'
                     onClick={ handleToogleType }>
                     Ingresos y egresos
                  </button>
               </nav>
            </header>
            <RegisterProvider
               date={{ year: year, month: month, day: day }}
               registerData={ registerData }
               setRegisterData={ setRegisterData }>
               { registerType === 'bills' ?
                  <Bills
                     date={{ year: year, month: month, day: day }}
                     setEditBill={ setEditBill }
                     registerData={ registerData }
                     setRegisterData={ setRegisterData }
                     setAlertState={ setAlertState }
                     setAlertContent={ setAlertContent }
                  />
                  :
                  <IncomesWrapper
                     date={{ year: year, month: month, day: day }}
                     registerData={ registerData }
                     setRegisterData={ setRegisterData }
                     setAlertState={ setAlertState }
                     setAlertContent={ setAlertContent }
                  />
               }
            </RegisterProvider>
         </section>
      </>
   );
};