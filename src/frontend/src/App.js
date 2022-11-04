import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/login';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChatPage from './components/chatpage';
import Register from './components/register';
import { QueryClient, QueryClientProvider } from 'react-query';

function App() {
  const queryClient = new QueryClient();
  return (
      <QueryClientProvider client={queryClient} >
          <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path='/register' element={<Register />} />
              <Route path='/login' element={<Login />} />
            </Routes>
          </BrowserRouter>
        </div>
      </QueryClientProvider>
  );
}

export default App;
