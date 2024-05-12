import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JoinPage from './pages/JoinPage';
import RoomPage from './pages/RoomPage';
import GamePage from './pages/GamePage';
import TestPage from './pages/TestPage';

const App: React.FC = () => {
  return (
    <>
          <Routes>
            <Route path={"/"} element={<HomePage />} />
            <Route path={"/test"} element={<TestPage />} />
            <Route path={"/join"} element={<JoinPage />} />
            <Route path={"/room/:roomId"} element={<RoomPage />} />
            <Route path={"/game/:roomId"} element={<GamePage />} />
          </Routes>
    </>
  );
}

export default App;
