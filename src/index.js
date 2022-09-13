import React from 'react';
import ReactDOM from 'react-dom/client';
/* contexts */
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CostumersProvider } from './contexts/CostumersContext';
/* components */
import { BillApp } from './BillApp';
/* styles */
import './scss/index.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <HashRouter>
      <AuthProvider>
         <CostumersProvider>
            <BillApp />
         </CostumersProvider>
      </AuthProvider>
   </HashRouter>
);