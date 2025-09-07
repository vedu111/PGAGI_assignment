'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface ReduxProviderProps {
  children: React.ReactNode;
}

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate 
        loading={<LoadingSpinner fullScreen text="Loading your preferences..." />} 
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
