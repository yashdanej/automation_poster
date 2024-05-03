import { useState } from 'react';
import './App.css';
import Poster from './components/Poster';
import Login from './components/login/Login';
import { Route, Routes } from 'react-router-dom';

function App() {
  const [user, setUser] = useState({
    username: "",
    password: ""
  })
  
  return (
    <div className='bg-slate-200 md:h-[100vh] max:h-[100%]' >
      <Routes>
        <Route exact path="/" element={<Login user={user} setUser={setUser} />} />
        <Route exact path="/poster" element={<Poster/>} />
      </Routes>
    </div>
  );
}

export default App;
