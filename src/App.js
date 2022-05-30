import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import Wallet from './components/Wallet';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Wallet />
      </Router>
      <ToastContainer />
    </>


  );
}

export default App;
