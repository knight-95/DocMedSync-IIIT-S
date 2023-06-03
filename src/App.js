import './App.css';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import useDarkMode from 'use-dark-mode';
import Home from './pages/home';

import Dashboard from './pages/dashboard/dashboard';
import { Nav } from './components/navbar/navbar'
import Footer from './components/footer';
import {
  Routes,
  Route,
} from "react-router-dom";

import Owner from './pages/dashboard/Owner/Owner';


import HospitalsTable from './pages/dashboard/Public/HospitalsTable';
import About from './pages/about/about';

const lightTheme = createTheme({
  type: 'light'

})

const darkTheme = createTheme({
  type: 'dark'

})





function App() {

  const darkMode = useDarkMode(false);
  return (
    <NextUIProvider theme={darkMode.value ? darkTheme : lightTheme} >
      <Nav />
      <Routes>

        <Route exact path="/" element={<Home />} />
        <Route exact path="/dashboard/*" element={<Dashboard />} />
        <Route exact path="/about" element={<About/>} />


      </Routes>

      <Footer />

    </NextUIProvider>
  );
}

export default App;
