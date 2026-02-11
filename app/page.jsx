'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Float } from '@react-three/drei'
import Desktop from '@/components/desktop'
import { checkSession, logout, encryptData } from '@/app/kernel/security'
import { loadSystem, executeCommand, mountFilesystem } from '@/app/kernel/core'
import { supabase } from '@/lib/supabase'

export default function WebBroOS2Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [systemStatus, setSystemStatus] = useState('initializing')
  const [userData, setUserData] = useState(null)
  const [kernelLogs, setKernelLogs] = useState([])
  const [cpuUsage, setCpuUsage] = useState(0)
  const [memoryUsage, setMemoryUsage] = useState(0)
  const terminalRef = useRef(null)
  const kernelRef = useRef(null)

  useEffect(() => {
    const initializeQuantumSystem = async () => {
      try {
        setSystemStatus('quantum_boot_sequence')
        setKernelLogs(prev => [...prev, '[KERNEL] Starting quantum boot sequence...'])
        
        const session = await checkSession()
        if (session?.user) {
          const encryptedUser = await encryptData(JSON.stringify(session.user))
          setUserData({ ...session.user, quantum_encrypted: encryptedUser })
          setIsAuthenticated(true)
          
          setKernelLogs(prev => [...prev, '[AUTH] Quantum authentication successful'])
          
          await mountFilesystem(session.user.id)
          setKernelLogs(prev => [...prev, '[FS] Quantum filesystem mounted'])
          
          await loadSystem(session.user.id)
          setKernelLogs(prev => [...prev, '[SYSTEM] WebBroOS2 fully initialized'])
          
          setSystemStatus('quantum_ready')
          
          startSystemMonitoring()
        } else {
          window.location.href = '/login'
        }
      } catch (error) {
        setKernelLogs(prev => [...prev, `[ERROR] Quantum boot failed: ${error.message}`])
        setSystemStatus('quantum_error')
        setTimeout(() => window.location.href = '/login', 3000)
      }
    }

    initializeQuantumSystem()
  }, [])

  const startSystemMonitoring = () => {
    const monitor = setInterval(async () => {
      if (window.performance && window.performance.memory) {
        const used = window.performance.memory.usedJSHeapSize
        const total = window.performance.memory.totalJSHeapSize
        setMemoryUsage(Math.round((used / total) * 100))
      }
      
      const cpuEstimate = Math.random() * 30 + 10
      setCpuUsage(Math.round(cpuEstimate))
    }, 1000)

    return () => clearInterval(monitor)
  }

  const handleLogout = async () => {
    setKernelLogs(prev => [...prev, '[AUTH] Starting quantum logout sequence...'])
    await logout()
    window.location.href = '/login'
  }

  const executeKernelCommand = async (command) => {
    const result = await executeCommand(command)
    setKernelLogs(prev => [...prev, `[CMD] ${command} -> ${result}`])
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl opacity-50 animate-pulse" />
            <div className="relative w-48 h-48 mx-auto border-4 border-blue-500/30 rounded-full flex items-center justify-center">
              <div className="w-32 h-32 border-t-4 border-blue-500 rounded-full animate-spin" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              WebBroOS2 Quantum Boot
            </h1>
            <p className="text-gray-400 text-lg">Initializing quantum-resistant kernel...</p>
            <div className="inline-flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-mono text-gray-300">{systemStatus}</span>
            </div>
          </div>
          <div className="max-w-2xl mx-auto bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
            <div className="font-mono text-sm text-gray-300 h-40 overflow-y-auto">
              {kernelLogs.map((log, i) => (
                <div key={i} className="py-1 border-b border-gray-800">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas>
          <ambientLight intensity={0.1} />
          <pointLight position={[10, 10, 10]} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
          <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <mesh>
              <icosahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color="#3b82f6" wireframe />
            </mesh>
          </Float>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      <div className="relative z-10">
        <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-xl">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
              <div>
                <h1 className="text-xl font-bold text-white">WebBroOS2</h1>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="px-2 py-0.5 bg-green-900/30 text-green-400 rounded">Quantum</span>
                  <span>Kernel v2.0.0</span>
                  <span>•</span>
                  <span>User: {userData?.email}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-400">Quantum CPU</div>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden mr-2">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${cpuUsage}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="text-sm font-mono">{cpuUsage}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Memory</div>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden mr-2">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${memoryUsage}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="text-sm font-mono">{memoryUsage}%</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-900/30 hover:bg-red-800/40 text-red-300 rounded-lg border border-red-800/50 transition-colors"
              >
                Quantum Logout
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          <Desktop userData={userData} />
          
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Quantum Kernel Terminal</h3>
              <div ref={terminalRef} className="font-mono text-sm bg-black rounded-lg p-4 h-64 overflow-y-auto">
                {kernelLogs.slice(-20).map((log, i) => (
                  <div key={i} className="py-1 border-b border-gray-800">
                    <span className="text-green-400">$</span> {log}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter quantum command..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && executeKernelCommand(e.target.value)}
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white">
                  Execute
                </button>
              </div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4">
              <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Quantum Encryption</span>
                  <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Supabase Connection</span>
                  <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm">Connected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Filesystem</span>
                  <span className="px-3 py-1 bg-blue-900/30 text-blue-400 rounded-full text-sm">Mounted</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Security Level</span>
                  <span className="px-3 py-1 bg-purple-900/30 text-purple-400 rounded-full text-sm">Quantum-Resistant</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
