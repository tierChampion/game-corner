import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JoinPage from './pages/JoinPage';
import RoomPage from './pages/RoomPage';
import GamePage from './pages/GamePage';
import UserProvider from './contexts/UserProvider';

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
        <Routes>
          {routes.map((route, index) => {
            return <Route key={index} path={route.path} element={route.element} />
          })}
        </Routes>
      </UserProvider>
    </>
  );
}

export default App;
