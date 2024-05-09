import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JoinPage from './pages/JoinPage';
import RoomPage from './pages/RoomPage';
import GamePage from './pages/GamePage';
import UserProvider from './contexts/UserProvider';
import RoomProvider from './contexts/RoomProvider';

const App: React.FC = () => {
  const routes = [
    { path: "/", element: <HomePage /> },
    { path: "/join", element: <JoinPage /> },
    { path: "/room/:roomId", element: <RoomPage /> },
    { path: "/game", element: <GamePage /> },
  ];

  return (
    <>
      <UserProvider>
        <RoomProvider>
          <Routes>
            <Route path={"/"} element={<HomePage />} />
            <Route path={"/join"} element={<JoinPage />} />
            <Route path={"/room/:roomId"} element={<RoomPage />} />
            <Route path={"/game/:roomId"} element={<GamePage />} />
          </Routes>
        </RoomProvider>
      </UserProvider>
    </>
  );
}

export default App;
