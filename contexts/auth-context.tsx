"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

// Definir el tipo para el usuario
export interface User {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
}

// Definir el tipo para el contexto
type AuthContextType = {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

// Proveedor del contexto
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Registrar un nuevo usuario
  const signUp = async (email: string, password: string) => {
    // Simular un retraso para imitar una llamada a la API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Crear nuevo usuario
    const newUser: User = {
      uid: Date.now().toString(),
      email,
      displayName: email.split("@")[0],
    }

    // Guardar en localStorage
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  // Iniciar sesión
  const signIn = async (email: string, password: string) => {
    // Simular un retraso para imitar una llamada a la API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Crear usuario
    const loggedInUser: User = {
      uid: Date.now().toString(),
      email,
      displayName: email.split("@")[0],
    }

    // Guardar en localStorage
    setUser(loggedInUser)
    localStorage.setItem("user", JSON.stringify(loggedInUser))
  }

  // Cerrar sesión
  const logout = async () => {
    // Eliminar usuario del localStorage
    localStorage.removeItem("user")
    setUser(null)
  }

  // Restablecer contraseña
  const resetPassword = async (email: string) => {
    // Simular un retraso para imitar una llamada a la API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(`Se enviaría un correo de restablecimiento a ${email}`)
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    logout,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
