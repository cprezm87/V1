import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  serverTimestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
  Timestamp,
  setDoc,
} from "firebase/firestore"
import { db } from "./firebase"
import type { CollectionItem, UserSettings } from "../types/collection"

// Convertidores para manejar fechas y tipos específicos
const itemConverter = {
  toFirestore(item: CollectionItem): DocumentData {
    return {
      name: item.name,
      brand: item.brand,
      category: item.category,
      series: item.series,
      releaseDate: item.releaseDate,
      purchaseDate: item.purchaseDate,
      price: item.price,
      condition: item.condition,
      notes: item.notes,
      imageUrl: item.imageUrl,
      inWishlist: item.inWishlist,
      inCollection: item.inCollection,
      isCustom: item.isCustom,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      userId: item.userId,
    }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): CollectionItem {
    const data = snapshot.data(options)
    return {
      id: snapshot.id,
      name: data.name,
      brand: data.brand,
      category: data.category,
      series: data.series,
      releaseDate: data.releaseDate,
      purchaseDate: data.purchaseDate,
      price: data.price,
      condition: data.condition,
      notes: data.notes,
      imageUrl: data.imageUrl,
      inWishlist: data.inWishlist,
      inCollection: data.inCollection,
      isCustom: data.isCustom,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
      userId: data.userId,
    }
  },
}

// Colecciones
const COLLECTIONS = {
  ITEMS: "items",
  USERS: "users",
}

// Funciones para items de colección
export async function addItem(item: CollectionItem): Promise<string> {
  const itemsRef = collection(db, COLLECTIONS.ITEMS).withConverter(itemConverter)
  const docRef = await addDoc(itemsRef, item)
  return docRef.id
}

export async function updateItem(id: string, item: Partial<CollectionItem>): Promise<void> {
  const itemRef = doc(db, COLLECTIONS.ITEMS, id)
  await updateDoc(itemRef, {
    ...item,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteItem(id: string): Promise<void> {
  const itemRef = doc(db, COLLECTIONS.ITEMS, id)
  await deleteDoc(itemRef)
}

export async function getItem(id: string): Promise<CollectionItem | null> {
  const itemRef = doc(db, COLLECTIONS.ITEMS, id).withConverter(itemConverter)
  const docSnap = await getDoc(itemRef)

  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    return null
  }
}

export async function getUserItems(
  userId: string,
  filter?: {
    inCollection?: boolean
    inWishlist?: boolean
    isCustom?: boolean
    category?: string
  },
): Promise<CollectionItem[]> {
  // Consulta básica sin ordenamiento para evitar problemas de índice
  let q = query(collection(db, COLLECTIONS.ITEMS).withConverter(itemConverter), where("userId", "==", userId))

  // Aplicar filtros adicionales si existen
  if (filter) {
    if (filter.inCollection !== undefined) {
      q = query(q, where("inCollection", "==", filter.inCollection))
    }
    if (filter.inWishlist !== undefined) {
      q = query(q, where("inWishlist", "==", filter.inWishlist))
    }
    if (filter.isCustom !== undefined) {
      q = query(q, where("isCustom", "==", filter.isCustom))
    }
    if (filter.category) {
      q = query(q, where("category", "==", filter.category))
    }
  }

  const querySnapshot = await getDocs(q)
  const items = querySnapshot.docs.map((doc) => doc.data())

  // Ordenar los resultados en memoria en lugar de en la consulta
  return items.sort((a, b) => {
    const dateA = a.updatedAt instanceof Date ? a.updatedAt : new Date(0)
    const dateB = b.updatedAt instanceof Date ? b.updatedAt : new Date(0)
    return dateB.getTime() - dateA.getTime() // Orden descendente
  })
}

// Funciones para usuarios
export async function saveUserSettings(userId: string, settings: UserSettings): Promise<void> {
  const userRef = doc(db, COLLECTIONS.USERS, userId)
  const docSnap = await getDoc(userRef)

  if (docSnap.exists()) {
    await updateDoc(userRef, { settings })
  } else {
    await setDoc(userRef, { settings })
  }
}

export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  const userRef = doc(db, COLLECTIONS.USERS, userId)
  const docSnap = await getDoc(userRef)

  if (docSnap.exists() && docSnap.data().settings) {
    return docSnap.data().settings as UserSettings
  } else {
    return null
  }
}

// Funciones para estadísticas
export async function getCollectionStats(userId: string) {
  const items = await getUserItems(userId)

  const collectionCount = items.filter((item) => item.inCollection).length
  const wishlistCount = items.filter((item) => item.inWishlist).length
  const customCount = items.filter((item) => item.isCustom).length

  const brands = [...new Set(items.map((item) => item.brand))]
  const categories = [...new Set(items.map((item) => item.category))]

  const brandCounts = brands
    .map((brand) => ({
      brand,
      count: items.filter((item) => item.brand === brand && item.inCollection).length,
    }))
    .sort((a, b) => b.count - a.count)

  const categoryCounts = categories
    .map((category) => ({
      category,
      count: items.filter((item) => item.category === category && item.inCollection).length,
    }))
    .sort((a, b) => b.count - a.count)

  // Calcular valor total de la colección
  const totalValue = items
    .filter((item) => item.inCollection && item.price)
    .reduce((sum, item) => sum + (item.price || 0), 0)

  return {
    collectionCount,
    wishlistCount,
    customCount,
    brandCounts,
    categoryCounts,
    totalValue,
  }
}
