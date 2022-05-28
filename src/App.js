import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import MetaMaskWallet from './components/MetaMaskWallet';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <MetaMaskWallet />
      </Router>
      <ToastContainer />
    </>


  );
}

export default App;
