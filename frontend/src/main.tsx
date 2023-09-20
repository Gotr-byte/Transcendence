import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const colors = {
  brand: {
    900: '#171923',
    50: '#38B2AC'
  }
}

const theme = extendTheme({
  colors,
  fonts: {
    body: "'IM Fell English SC', serif",
    heading: "'IM Fell English SC', serif",
    mono: "'IM Fell English SC', serif",
  },
  styles: {
    global: {
      "body": {
        bgImage: 'url("/home/piotr/transcendence-4/frontend/public/paper.jpg")',
        bgSize: "cover",
        bgPosition: "center",
        bgRepeat: "no-repeat",
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
)
