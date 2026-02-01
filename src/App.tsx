import { useState, useCallback, useEffect, useRef } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  type: 'circle' | 'square' | 'triangle' | 'star'
  rotation: number
  rotationSpeed: number
  opacity: number
  life: number
}

interface Experiment {
  id: number
  name: string
  color: string
  timestamp: Date
}

const NEON_COLORS = [
  '#00ffff', // cyan
  '#ff00ff', // magenta
  '#00ff00', // lime
  '#ff0080', // hot pink
  '#80ff00', // chartreuse
  '#ff8000', // orange
  '#00ff80', // spring green
  '#8000ff', // purple
]

const EXPERIMENT_NAMES = [
  'QUANTUM CHAOS',
  'NEON STORM',
  'PIXEL RAIN',
  'GRAVITY FLIP',
  'COLOR BURST',
  'GLITCH WAVE',
  'PARTICLE NOVA',
  'MATRIX FLOW',
  'CYBER BLOOM',
  'VOID SPIRAL',
  'PLASMA DANCE',
  'BYTE TORNADO',
  'SYNTH ERUPTION',
  'DATA CASCADE',
  'RETRO BURST',
]

function App() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [isHovering, setIsHovering] = useState(false)
  const [bgEffect, setBgEffect] = useState<string>('')
  const [shakeScreen, setShakeScreen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])

  const getRandomColor = () => NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)]
  
  const getRandomType = (): Particle['type'] => {
    const types: Particle['type'][] = ['circle', 'square', 'triangle', 'star']
    return types[Math.floor(Math.random() * types.length)]
  }

  const createExplosion = useCallback((centerX: number, centerY: number) => {
    const newParticles: Particle[] = []
    const particleCount = 50 + Math.floor(Math.random() * 100)
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5
      const speed = 2 + Math.random() * 8
      newParticles.push({
        id: Date.now() + i,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: getRandomColor(),
        size: 5 + Math.random() * 20,
        type: getRandomType(),
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 20,
        opacity: 1,
        life: 100 + Math.random() * 100,
      })
    }
    return newParticles
  }, [])

  const createRain = useCallback(() => {
    const newParticles: Particle[] = []
    const color = getRandomColor()
    
    for (let i = 0; i < 100; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: Math.random() * window.innerWidth,
        y: -50 - Math.random() * 500,
        vx: (Math.random() - 0.5) * 2,
        vy: 5 + Math.random() * 10,
        color: i % 3 === 0 ? color : getRandomColor(),
        size: 3 + Math.random() * 8,
        type: 'square',
        rotation: 0,
        rotationSpeed: 0,
        opacity: 0.8,
        life: 200 + Math.random() * 100,
      })
    }
    return newParticles
  }, [])

  const createSpiral = useCallback((centerX: number, centerY: number) => {
    const newParticles: Particle[] = []
    const color = getRandomColor()
    
    for (let i = 0; i < 80; i++) {
      const angle = (i / 80) * Math.PI * 8
      const radius = i * 2
      newParticles.push({
        id: Date.now() + i,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: Math.cos(angle + Math.PI / 2) * 3,
        vy: Math.sin(angle + Math.PI / 2) * 3,
        color: i % 2 === 0 ? color : getRandomColor(),
        size: 8 + Math.sin(i * 0.2) * 5,
        type: 'star',
        rotation: angle * (180 / Math.PI),
        rotationSpeed: 5,
        opacity: 1,
        life: 150,
      })
    }
    return newParticles
  }, [])

  const createWave = useCallback(() => {
    const newParticles: Particle[] = []
    
    for (let i = 0; i < 60; i++) {
      const x = (i / 60) * window.innerWidth
      newParticles.push({
        id: Date.now() + i,
        x,
        y: window.innerHeight / 2 + Math.sin(i * 0.3) * 100,
        vx: 0,
        vy: (Math.random() - 0.5) * 10,
        color: getRandomColor(),
        size: 15 + Math.sin(i * 0.2) * 10,
        type: 'circle',
        rotation: 0,
        rotationSpeed: 0,
        opacity: 1,
        life: 120,
      })
    }
    return newParticles
  }, [])

  const triggerExperiment = useCallback(() => {
    const experimentType = Math.floor(Math.random() * 4)
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    
    let newParticles: Particle[] = []
    
    switch (experimentType) {
      case 0:
        newParticles = createExplosion(centerX, centerY)
        break
      case 1:
        newParticles = createRain()
        break
      case 2:
        newParticles = createSpiral(centerX, centerY)
        break
      case 3:
        newParticles = createWave()
        break
    }
    
    particlesRef.current = [...particlesRef.current, ...newParticles]
    setParticles(particlesRef.current)
    
    // Add experiment to log
    const experimentName = EXPERIMENT_NAMES[Math.floor(Math.random() * EXPERIMENT_NAMES.length)]
    const newExperiment: Experiment = {
      id: Date.now(),
      name: experimentName,
      color: getRandomColor(),
      timestamp: new Date(),
    }
    setExperiments(prev => [newExperiment, ...prev].slice(0, 10))
    
    // Background effect
    setBgEffect(getRandomColor())
    setTimeout(() => setBgEffect(''), 300)
    
    // Screen shake
    setShakeScreen(true)
    setTimeout(() => setShakeScreen(false), 200)
  }, [createExplosion, createRain, createSpiral, createWave])

  // Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    
    const drawShape = (p: Particle) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      ctx.globalAlpha = p.opacity
      ctx.fillStyle = p.color
      ctx.shadowColor = p.color
      ctx.shadowBlur = 15
      
      switch (p.type) {
        case 'circle':
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
          break
        case 'square':
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
          break
        case 'triangle':
          ctx.beginPath()
          ctx.moveTo(0, -p.size / 2)
          ctx.lineTo(p.size / 2, p.size / 2)
          ctx.lineTo(-p.size / 2, p.size / 2)
          ctx.closePath()
          ctx.fill()
          break
        case 'star':
          ctx.beginPath()
          for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
            const r = i === 0 ? p.size / 2 : p.size / 2
            if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r)
            else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r)
          }
          ctx.closePath()
          ctx.fill()
          break
      }
      ctx.restore()
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particlesRef.current = particlesRef.current
        .map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.1, // gravity
          rotation: p.rotation + p.rotationSpeed,
          life: p.life - 1,
          opacity: Math.min(p.life / 50, 1),
        }))
        .filter(p => p.life > 0 && p.y < canvas.height + 100)
      
      particlesRef.current.forEach(drawShape)
      setParticles([...particlesRef.current])
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <div 
      className={`min-h-screen relative overflow-hidden transition-all duration-100 ${shakeScreen ? 'translate-x-1' : ''}`}
      style={{
        background: bgEffect 
          ? `radial-gradient(circle at center, ${bgEffect}22 0%, #0a0a0f 70%)` 
          : 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)',
      }}
    >
      {/* Animated background grid */}
      <div 
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Canvas for particles */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-10"
      />
      
      {/* Main content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 
            className={`font-orbitron text-4xl sm:text-6xl md:text-7xl font-black text-cyan-400 tracking-wider mb-4 ${isHovering ? 'glitch-text' : ''}`}
            style={{
              textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 80px #00ffff',
            }}
          >
            LET'S SEE
          </h1>
          <h2 
            className="font-orbitron text-3xl sm:text-5xl md:text-6xl font-black text-fuchsia-400 tracking-widest neon-pulse"
            style={{
              textShadow: '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff',
            }}
          >
            WHAT HAPPENS
          </h2>
        </div>
        
        {/* Counter */}
        <div className="mb-8 text-center">
          <p className="text-gray-500 text-sm tracking-widest mb-2">EXPERIMENTS TRIGGERED</p>
          <div 
            className="font-orbitron text-5xl sm:text-7xl font-black text-lime-400"
            style={{
              textShadow: '0 0 20px #00ff00, 0 0 40px #00ff00',
            }}
          >
            {experiments.length.toString().padStart(3, '0')}
          </div>
        </div>
        
        {/* Main button */}
        <button
          onClick={triggerExperiment}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="group relative px-12 py-6 sm:px-16 sm:py-8 font-orbitron text-xl sm:text-2xl font-bold tracking-widest transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)',
            clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
            boxShadow: isHovering 
              ? '0 0 30px #ff00ff, 0 0 60px #00ffff, inset 0 0 30px rgba(255,255,255,0.2)' 
              : '0 0 20px #ff00ff, 0 0 40px #00ffff',
          }}
        >
          <span className="relative z-10 text-black">
            WHAT HAPPENS?
          </span>
          
          {/* Button glow effect */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)',
              clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
              filter: 'blur(20px)',
            }}
          />
        </button>
        
        {/* Experiment log */}
        {experiments.length > 0 && (
          <div className="mt-12 w-full max-w-md">
            <p className="text-gray-500 text-xs tracking-widest mb-4 text-center">// EXPERIMENT LOG</p>
            <div className="space-y-2">
              {experiments.slice(0, 5).map((exp, index) => (
                <div 
                  key={exp.id}
                  className="flex items-center gap-3 px-4 py-2 rounded border border-gray-800 bg-black/50 backdrop-blur-sm"
                  style={{
                    opacity: 1 - index * 0.15,
                    borderColor: index === 0 ? exp.color : undefined,
                    boxShadow: index === 0 ? `0 0 10px ${exp.color}40` : undefined,
                  }}
                >
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: exp.color, boxShadow: `0 0 10px ${exp.color}` }}
                  />
                  <span 
                    className="font-mono text-sm flex-1"
                    style={{ color: exp.color }}
                  >
                    {exp.name}
                  </span>
                  <span className="text-gray-600 text-xs">
                    {exp.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Hint */}
        <p className="mt-12 text-gray-600 text-sm tracking-wider animate-pulse">
          [ CLICK THE BUTTON TO UNLEASH CHAOS ]
        </p>
      </div>
      
      {/* Decorative corner elements */}
      <div className="fixed top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-cyan-500/50" />
      <div className="fixed top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-fuchsia-500/50" />
      <div className="fixed bottom-16 left-4 w-16 h-16 border-l-2 border-b-2 border-lime-500/50" />
      <div className="fixed bottom-16 right-4 w-16 h-16 border-r-2 border-b-2 border-orange-500/50" />
      
      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-4 text-center z-30">
        <p className="text-gray-600 text-xs tracking-wider">
          Requested by <span className="text-gray-500">@elion_shahini</span> · Built by <span className="text-gray-500">@clonkbot</span>
        </p>
      </footer>
    </div>
  )
}

export default App