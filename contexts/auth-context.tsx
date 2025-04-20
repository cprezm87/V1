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

// Usuario por defecto
const DEFAULT_USER: User = {
  uid: "default-user-id",
  email: "user@example.com",
  displayName: "Default User",
}

// Proveedor del contexto
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(DEFAULT_USER)
  const [loading, setLoading] = useState(true)

  // Cargar usuario desde localStorage al iniciar o usar el usuario por defecto
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      // Si no hay usuario en localStorage, usar el usuario por defecto
      setUser(DEFAULT_USER)
      localStorage.setItem("user", JSON.stringify(DEFAULT_USER))
    }
    setLoading(false)
  }, [])

  // Registrar un nuevo usuario (simulado)
  const signUp = async (email: string, password: string) => {
    // Simular un retraso para imitar una llamada a la API
    await new Promise((resolve) => setTimeout(resolve, 500))

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

  // Iniciar sesión (simulado)
  const signIn = async (email: string, password: string) => {
    // Simular un retraso para imitar una llamada a la API
    await new Promise((resolve) => setTimeout(resolve, 500))

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

  // Cerrar sesión (simulado)
  const logout = async () => {
    // En lugar de eliminar el usuario, volvemos al usuario por defecto
    setUser(DEFAULT_USER)
    localStorage.setItem("user", JSON.stringify(DEFAULT_USER))
  }

  // Restablecer contraseña (simulado)
  const resetPassword = async (email: string) => {
    // Simular un retraso para imitar una llamada a la API
    await new Promise((resolve) => setTimeout(resolve, 500))
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
