import { useState,useEffect,React } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SettingUp from './pages/SettingUp';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Homepage from './pages/Homepage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
function App() {
const {authUser,checkAuth,isCheckingAuth} = useAuthStore();

useEffect(()=>{
  checkAuth()
},[checkAuth])

if (isCheckingAuth && !authUser) {
    return (
     <div className="flex items-center justify-center h-screen">
        <Loader className='size-10 animate-spin'></Loader>
      </div>
    ); // If authUser is null, show (or if isCheckingAuth is true, show
  }

  return (
    <div>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={authUser ? <Homepage /> : <Navigate to="/login"/>} />
        <Route path="/login" element={!authUser ? <Login />:<Navigate to="/"/> } />
        <Route path="/signup" element={!authUser?<Signup />:<Navigate to="/"/>} />
        <Route path="/settingup" element={<SettingUp />} />
        <Route path="/profilepage" element={authUser ? <ProfilePage />: <Navigate to="/login"/>} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;