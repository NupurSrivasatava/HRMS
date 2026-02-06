import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <div className="container">
      <h1>HRMS Lite</h1>
      <Dashboard />
    </div>
  );
}

