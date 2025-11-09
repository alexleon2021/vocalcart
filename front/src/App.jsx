import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Shop } from './components/Shop'
import './App.css'

function App() {
  return (
    <div className="App">
      <Shop />
      <ToastContainer />
    </div>
  )
}

export default App

