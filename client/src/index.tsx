import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { UserProvider } from './contexts/UserContext';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { QueryClientProvider, QueryClient } from "react-query";
import { ChoiceProvider } from './contexts/DialogContext';
import reportWebVitals from './reportWebVitals';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnMount: true,
      retryDelay: 5000
    }
  }
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <UserProvider>
        <ChoiceProvider>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </ChoiceProvider>
      </UserProvider>
    </BrowserRouter>
  </QueryClientProvider>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
