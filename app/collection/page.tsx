import { CollectionManager } from "@/components/collection-manager"

export default function CollectionPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Colección</h1>
      <CollectionManager />
    </div>
  )
}
