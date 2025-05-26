import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SettingUp from './pages/SettingUp';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Homepage from './pages/Homepage';
import ProfilePage from './pages/ProfilePage';
function App() {
  return (
    <div>
      <h1 className="text-red-500">Welcome to WeeChat</h1>
      <Navbar />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/settingup" element={<SettingUp />} />
        <Route path="/profilepage" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;