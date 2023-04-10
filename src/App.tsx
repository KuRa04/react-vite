import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignUpPage } from './features/auth/signUp';
import { SignInPage } from './features/auth/signIn';
import { FaceFormPage } from './features/face/faceForm';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<SignInPage />} />
        <Route path="sign_up" element={<SignUpPage />} />
        <Route path="faces" element={<FaceFormPage />} /> 
         {/* <Route path="posts/:id" element={<PostDetail />} /> */}
      </Routes>
  </BrowserRouter>
  )
}

export default App
