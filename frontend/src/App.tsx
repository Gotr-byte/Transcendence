import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route, 
  RouterProvider 
} from 'react-router-dom'
// layouts and pages
import RootLayout from './layouts/RootLayout'
// import Dashboard, { tasksLoader } from './pages/Dashboard'
import Create, {createAction} from './pages/Create'
import Profile from './pages/Profile'
import Chat from './pages/Chat'
import Game from './pages/Game'
import AuthFetch from './components/AuthFetch'

// router and routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      {/* <Route index element={<Dashboard />} loader={tasksLoader}/> */}
      <Route index element={<AuthFetch />} />
      <Route path="create" element={<Create />} action={createAction}/>
      <Route path="profile" element={<Profile />} />
      <Route path="chat" element={<Chat />} />
      <Route path="game" element={<Game />} />
    </Route>
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
