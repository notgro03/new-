import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        'como-funciona': 'pages/como-funciona.html',
        'red-servicios': 'pages/red-servicios.html',
        'planes': 'pages/planes.html',
        'productos': 'pages/productos.html',
        'contacto': 'pages/contacto.html',
        'tutoriales': 'pages/tutoriales.html',
        'telemandos': 'pages/telemandos.html',
        'blog': 'pages/blog.html',
        'faq': 'pages/faq.html',
        'privacidad': 'pages/privacidad.html',
        'terminos': 'pages/terminos.html'
      }
    }
  },
  base: '',
  server: {
    open: true
  }
})