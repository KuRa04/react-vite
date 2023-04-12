import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignUpPage } from './features/auth/signUp';
// import { SignInPage } from './features/auth/signIn';
import { FaceFormPage } from './features/face/faceForm';
import { ReserveFormPage } from './features/reserve/reserveForm';
import { PureTonePage } from './features/check/puretone';
import { PureToneFormPage } from './features/check/puretone/pureToneForm';
import { VoicePage } from './features/check/voice';
import { VoiceFormPage } from './features/check/voice/voiceForm';
import { HomePage } from './features/home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="sign_up" element={<SignUpPage />} />
        <Route path="face" element={<FaceFormPage />} /> 
        <Route path="reserve" element={<ReserveFormPage />} /> 
        <Route path="check/pure_tone" element={<PureTonePage />} />
        <Route path="check/pure_tone/detail" element={<PureToneFormPage />} />
        <Route path="check/voice" element={<VoicePage />} />
        <Route path="check/voice/detail" element={<VoiceFormPage />} />
      </Routes>
  </BrowserRouter>
  )
}

export default App
