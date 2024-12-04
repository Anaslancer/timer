"use client";

import styled from 'styled-components';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Link, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import './index.css';
import { TimerProvider } from './utils/context';
import TimersView from './views/AddTimer';
import DocumentationView from './views/DocumentationView';
import Home from './views/Home';

function fallbackRender({ error, resetErrorBoundary }: FallbackProps) {
    // Call resetErrorBoundary() to reset the error boundary and retry the render.
    setTimeout(() => {
        resetErrorBoundary();
    }, 4000);
    
    return (
        <div role="alert">
            <p>Something went wrong:</p>
            <pre style={{ color: "red" }}>{error.message}</pre>
        </div>
    );
}
  
const Container = styled.div`
  padding: 20px;
  text-align: center;
  background-color: f5f5f5;
  min-height: 100vh;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 2.5rem;
  color: #234;
  text-align: center;
`;

const ButtonLink = styled(Link)`
  display: flex;
  text-decoration: none;
  font-size: 0.6rem;
  color: white;
  background-color: #007bff;
  padding: 15px 25px
  border-radius: 5px;
  transition: background-color 0.3s, transform 0.2s;
  width: 140px;
  height: 25px;
  background-color: #e0e0e0;
  border: 2px solid #ccc;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 20%;

  &:hover {
    background-color: #d0d0d0;
    transform: scale(1.05);
  }

  &.active {
    background-color: #c0c0c0;
  }
`;

const PageIndex = () => {
    return (
        <Container>
            <Title>ANIKET'S TIMECLOCK ASSIGNMENT</Title>
            <ButtonLink to="/">Workout</ButtonLink>
            <ButtonLink to="/docs">Documentation</ButtonLink>
            <ButtonLink to="/add">Add Timers</ButtonLink>
            <Outlet />
        </Container>
    );
};

const router = createBrowserRouter([
    {
        path: '/',
        element: <PageIndex />,
        children: [
            {
                path: '/',
                element: <Home />,
                index: true,
            },
            {
                path: '/docs',
                element: <DocumentationView />,
            },
            {
                path: '/add',
                element: <TimersView />,
            },
        ],
    },
]);

createRoot(document.getElementById('root')!).render(
    <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
            console.log("zzz onReset", details);
            // Reset the state of your app so the error doesn't happen again
        }}
    >
        <StrictMode>
            <TimerProvider>
                <RouterProvider router={router} />
            </TimerProvider>
        </StrictMode>
    </ErrorBoundary>    
);
