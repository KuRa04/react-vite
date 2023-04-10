import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignUpPage } from './features/auth/signUp';
import { SignInPage } from './features/auth/signIn';
import { FaceFormPage } from './features/face/faceForm';
import { ReserveFormPage } from './features/reserve/reserveForm';
import { PureTonePage } from './features/check/puretone';
import { PureToneFormPage } from './features/check/puretone/pureToneForm';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<SignInPage />} />
        <Route path="sign-up" element={<SignUpPage />} />
        <Route path="face" element={<FaceFormPage />} /> 
        <Route path="reserve" element={<ReserveFormPage />} /> 
        <Route path="check/pure-tone" element={<PureTonePage />} />
        <Route path="check/pure-tone/detail" element={<PureToneFormPage />} />
      </Routes>
  </BrowserRouter>
  )
}

export default App
