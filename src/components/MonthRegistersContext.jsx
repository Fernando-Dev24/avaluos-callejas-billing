import React from 'react';
/* context */
import { MonthRegistersProvider } from '../contexts/MonthContexts';
/* hooks */
import { useParams } from 'react-router-dom';
/* components */
import { MonthRegisters } from './MonthRegisters';

export const MonthRegistersContext = ({ setAlertState, setAlertContent }) => {
   const { year, month } = useParams();

   return (
      <MonthRegistersProvider
         date={{ year: year, month: month }}
         setAlertState={ setAlertState }
         setAlertContent={ setAlertContent }>
         <MonthRegisters date={{ year: year, month: month }} />
      </MonthRegistersProvider>
   );
};