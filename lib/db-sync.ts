/**
 * Utility functions for synchronizing data between localStorage and database
 */

// Function to normalize database column names to camelCase
export function normalizeDbItem(item: any) {
  return {
    id: item.id?.toString(),
    name: item.name || "",
    type: item.type || "",
    franchise: item.franchise || "",
    brand: item.brand || "",
    serie: item.serie || "",
    yearReleased: item.yearreleased || "",
    condition: item.condition || "",
    price: item.price || "",
    yearPurchase: item.yearpurchase || "",
    upc: item.upc || "",
    logo: item.logo || "",
    photo: item.photo || "",
    tagline: item.tagline || "",
    review: item.review || "",
    shelf: item.shelf || "",
    display: item.display || "",
    ranking: item.ranking || 0,
    comments: item.comments || "",
  }
}

// Function to normalize wishlist item from database
export function normalizeWishlistItem(item: any) {
  return {
    id: item.id?.toString(),
    name: item.name || "",
    type: item.type || "",
    franchise: item.franchise || "",
    brand: item.brand || "",
    serie: item.serie || "",
    yearReleased: item.yearreleased || "",
    price: item.price || "",
    logo: item.logo || "",
    photo: item.photo || "",
    tagline: item.tagline || "",
    review: item.review || "",
    released: item.released || false,
    buy: item.buy || false,
    comments: item.comments || "",
    trackingNumber: item.trackingnumber || "",
  }
}

// Function to normalize custom item from database
export function normalizeCustomItem(item: any) {
  return {
    id: item.id?.toString(),
    name: item.name || "",
    type: item.type || "",
    franchise: item.franchise || "",
    head: item.head || "",
    body: item.body || "",
    logo: item.logo || "",
    tagline: item.tagline || "",
    comments: item.comments || "",
  }
}
