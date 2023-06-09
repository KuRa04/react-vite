import { RecoilRoot } from 'recoil';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignUpPage } from './features/auth/signUp';
import { SignInPage } from './features/auth/signIn';
import { FaceFormPage } from './features/face/faceForm';
import { ReserveFormPage } from './features/reserve/reserveForm';
import { PureTonePage } from './features/check/puretone';
import { PureToneFormPage } from './features/check/puretone/pureToneForm';
import { VoicePage } from './features/check/voice';
import { VoiceFormPage } from './features/check/voice/voiceForm';
import { HistoryPage } from './features/history';
import { ExperimentPureTonePage } from './features/experiment';
import { ExperimentPureToneFormPage } from './features/experiment/pureToneForm';
import { HomePage } from './features/home';

function App() {
  console.log(import.meta.env.MODE);
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="sign_up" element={<SignUpPage />} />
          <Route path="sign_in" element={<SignInPage />} />
          <Route path="face" element={<FaceFormPage />} />
          <Route path="reserve" element={<ReserveFormPage />} />
          <Route path="check/pure_tone" element={<PureTonePage />} />
          <Route path="check/pure_tone/detail" element={<PureToneFormPage />} />
          <Route path="check/voice" element={<VoicePage />} />
          <Route path="check/voice/detail" element={<VoiceFormPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route
            path="experiment/pure_tone"
            element={<ExperimentPureTonePage />}
          />
          <Route
            path="experiment/pure_tone/detail"
            element={<ExperimentPureToneFormPage />}
          />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
