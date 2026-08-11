import Background3D from './components/three/Background3D'
import Navbar from './components/Navbar'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Experience from './components/sections/Experience'
import Projects from './components/sections/Projects'
import Credentials from './components/sections/Credentials'
import Contact from './components/sections/Contact'

function App() {
  return (
    <div className="noise relative">
      <Background3D />
      <div className="fixed inset-0 z-[1] grid-overlay pointer-events-none [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Credentials />
        <Contact />
      </main>
    </div>
  )
}

export default App
