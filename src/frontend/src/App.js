import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/login';
import 'bootstrap/dist/css/bootstrap.min.css';
import StompWrapper from './components/chatpage';
import Register from './components/register';
import LogOut from './components/logout';

function App() {
  
  return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/chat" element={<StompWrapper />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/logout' element={<LogOut />} />
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
