import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import RoomPage from './pages/Room';
import GamePage from './pages/Game';
import UserProvider from './contexts/UserProvider';

const App = () => {
  const routes = [
    { path: "/", element: <HomePage /> },
    { path: "/room", element: <RoomPage /> },
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
