"use client"

// Importar el componente original de la página Add
import OriginalAddPage from "./original-add-page"

export default function AddPage() {
  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add</h1>
      </div>

      <OriginalAddPage />
    </div>
  )
}
