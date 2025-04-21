"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"
type Language = "en" | "es" | "fr" | "de" | "pt" | "zh" | "ru" | "it"

interface ThemeContextType {
  theme: Theme
  language: Language
  toggleTheme: () => void
  setLanguage: (lang: Language) => void
  translations: Record<string, Record<string, string>>
  t: (key: string) => string
}

// Crear el contexto con un valor por defecto para evitar errores
const defaultContext: ThemeContextType = {
  theme: "dark",
  language: "en",
  toggleTheme: () => {},
  setLanguage: () => {},
  translations: {},
  t: (key: string) => key,
}

const ThemeContext = createContext<ThemeContextType>(defaultContext)

// Hook personalizado para usar el contexto
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    "app.name": "OpacoVault",
    "app.tagline": "Your personal collection management system",

    // Navigation
    "nav.home": "Home",
    "nav.checklist": "Checklist",
    "nav.wishlist": "Wishlist",
    "nav.customs": "Customs",
    "nav.display": "Display",
    "nav.add": "Add",
    "nav.rewind": "Rewind",
    "nav.insights": "Insights",
    "nav.about": "About",
    "nav.settings": "Settings",
    "nav.signout": "Sign Out",

    // Settings
    "settings.profile": "Profile",
    "settings.appearance": "Appearance",
    "settings.language": "Language",
    "settings.notifications": "Notifications",
    "settings.security": "Security",
    "settings.backup": "Backup",
    "settings.sync": "Sync",
    "settings.reset": "Reset",
    "settings.updates": "Updates",
    "settings.darkMode": "Dark Mode",
    "settings.theme": "Theme",
    "settings.font": "Font",
    "settings.saveAppearance": "Save Appearance",
    "settings.preview": "Preview",
    "settings.themePreview": "Theme Preview",
    "settings.primary": "Primary",
    "settings.secondary": "Secondary",
    "settings.chooseLanguage": "Choose your preferred language",
    "settings.restartLanguage": "The application will restart to apply language changes",
    "settings.applyLanguage": "Apply Language",

    // Add
    "add.figures": "Figures",
    "add.wishlist": "Wishlist",
    "add.customs": "Customs",
    "add.id": "ID",
    "add.name": "Name",
    "add.type": "Type",
    "add.franchise": "Franchise",
    "add.brand": "Brand",
    "add.serie": "Serie",
    "add.yearReleased": "Year Released",
    "add.condition": "Condition",
    "add.price": "Price (COP)",
    "add.yearPurchase": "Year Purchase",
    "add.upc": "UPC",
    "add.logo": "Logo",
    "add.photo": "Photo",
    "add.tagline": "Tagline",
    "add.review": "Review",
    "add.shelf": "Shelf",
    "add.display": "Display",
    "add.ranking": "Ranking",
    "add.comments": "Comments",
    "add.cancel": "Cancel",
    "add.addToChecklist": "Add to Checklist",
    "add.addToWishlist": "Add to Wishlist",
    "add.addToCustoms": "Add to Customs",
    "add.added": "Added!",
    "add.itemAdded": "Item added successfully.",

    // Profile
    "profile.changePhoto": "Change Photo",
    "profile.updateLogo": "Update Logo",
    "profile.name": "Name",
    "profile.email": "Email",
    "profile.bio": "Bio",
    "profile.saveChanges": "Save Changes",
    "profile.photoChanged": "Photo Changed",
    "profile.photoUpdated": "Your profile photo has been updated.",
    "profile.uploadImage": "Upload Image",
    "profile.dragDrop": "Drag and drop an image, or click to select",
    "profile.maxSize": "Maximum file size: 5MB",

    // Web Preview
    "preview.visitWebsite": "Visit Website",
    "preview.openInNewTab": "Open in new tab",
    "preview.loading": "Loading preview...",
    "preview.error": "Could not load preview",
    "preview.latestNews": "Latest news from",
    "preview.latestProducts": "Latest products from",
    "preview.shopAt": "Shop at",
    "preview.visit": "Visit",

    // Home
    "home.recentAdditions": "Recent Additions",
    "home.latestFigures": "Latest figures added to your collection",
    "home.upcomingReleases": "Upcoming Releases",
    "home.horrorFigures": "Horror figures coming soon",
    "home.favoriteItems": "Favorite Items",
    "home.topRated": "Your top-rated items",
    "home.figureNews": "Figure News",
    "home.figureBrands": "Figure Brands",
    "home.figureStores": "Figure Stores",
    "home.noRecent": "No recent additions yet.",
    "home.noFavorites": "No favorite items yet. Rate your items with 5 stars to see them here.",
    "home.releasesIn": "Releases in",
    "home.weeks": "weeks",
    "home.month": "month",
    "home.months": "months",
    "home.starRating": "5-star rating",
    "home.addedRecently": "Added recently",
  },
  es: {
    // Common
    "app.name": "OpacoVault",
    "app.tagline": "Tu sistema personal de gestión de colecciones",

    // Navigation
    "nav.home": "Inicio",
    "nav.checklist": "Checklist",
    "nav.wishlist": "Lista de Deseos",
    "nav.customs": "Personalizados",
    "nav.display": "Exhibición",
    "nav.add": "Añadir",
    "nav.rewind": "Rewind",
    "nav.insights": "Estadísticas",
    "nav.about": "Acerca de",
    "nav.settings": "Configuración",
    "nav.signout": "Cerrar Sesión",

    // Settings
    "settings.profile": "Perfil",
    "settings.appearance": "Apariencia",
    "settings.language": "Idioma",
    "settings.notifications": "Notificaciones",
    "settings.security": "Seguridad",
    "settings.backup": "Respaldo",
    "settings.sync": "Sincronización",
    "settings.reset": "Restablecer",
    "settings.updates": "Actualizaciones",
    "settings.darkMode": "Modo Oscuro",
    "settings.theme": "Tema",
    "settings.font": "Fuente",
    "settings.saveAppearance": "Guardar Apariencia",
    "settings.preview": "Vista Previa",
    "settings.themePreview": "Vista previa del tema",
    "settings.primary": "Primario",
    "settings.secondary": "Secundario",
    "settings.chooseLanguage": "Elige tu idioma preferido",
    "settings.restartLanguage": "La aplicación se reiniciará para aplicar los cambios de idioma",
    "settings.applyLanguage": "Aplicar Idioma",

    // Add
    "add.figures": "Figuras",
    "add.wishlist": "Lista de Deseos",
    "add.customs": "Personalizados",
    "add.id": "ID",
    "add.name": "Nombre",
    "add.type": "Tipo",
    "add.franchise": "Franquicia",
    "add.brand": "Marca",
    "add.serie": "Serie",
    "add.yearReleased": "Año de Lanzamiento",
    "add.condition": "Condición",
    "add.price": "Precio (COP)",
    "add.yearPurchase": "Año de Compra",
    "add.upc": "UPC",
    "add.logo": "Logo",
    "add.photo": "Foto",
    "add.tagline": "Eslogan",
    "add.review": "Reseña",
    "add.shelf": "Estante",
    "add.display": "Exhibición",
    "add.ranking": "Clasificación",
    "add.comments": "Comentarios",
    "add.cancel": "Cancelar",
    "add.addToChecklist": "Añadir a Checklist",
    "add.addToWishlist": "Añadir a Lista de Deseos",
    "add.addToCustoms": "Añadir a Personalizados",
    "add.added": "¡Añadido!",
    "add.itemAdded": "Elemento añadido con éxito.",

    // Profile
    "profile.changePhoto": "Cambiar Foto",
    "profile.updateLogo": "Actualizar Logo",
    "profile.name": "Nombre",
    "profile.email": "Correo Electrónico",
    "profile.bio": "Biografía",
    "profile.saveChanges": "Guardar Cambios",
    "profile.photoChanged": "Foto Cambiada",
    "profile.photoUpdated": "Tu foto de perfil ha sido actualizada.",
    "profile.uploadImage": "Subir Imagen",
    "profile.dragDrop": "Arrastra y suelta una imagen, o haz clic para seleccionar",
    "profile.maxSize": "Tamaño máximo de archivo: 5MB",

    // Web Preview
    "preview.visitWebsite": "Visitar Sitio Web",
    "preview.openInNewTab": "Abrir en nueva pestaña",
    "preview.loading": "Cargando vista previa...",
    "preview.error": "No se pudo cargar la vista previa",
    "preview.latestNews": "Últimas noticias de",
    "preview.latestProducts": "Últimos productos de",
    "preview.shopAt": "Comprar en",
    "preview.visit": "Visitar",

    // Home
    "home.recentAdditions": "Adiciones Recientes",
    "home.latestFigures": "Últimas figuras añadidas a tu colección",
    "home.upcomingReleases": "Próximos Lanzamientos",
    "home.horrorFigures": "Figuras de horror próximamente",
    "home.favoriteItems": "Elementos Favoritos",
    "home.topRated": "Tus elementos mejor valorados",
    "home.figureNews": "Noticias de Figuras",
    "home.figureBrands": "Marcas de Figuras",
    "home.figureStores": "Tiendas de Figuras",
    "home.noRecent": "Aún no hay adiciones recientes.",
    "home.noFavorites": "Aún no hay elementos favoritos. Califica tus elementos con 5 estrellas para verlos aquí.",
    "home.releasesIn": "Lanzamiento en",
    "home.weeks": "semanas",
    "home.month": "mes",
    "home.months": "meses",
    "home.starRating": "Calificación de 5 estrellas",
    "home.addedRecently": "Añadido recientemente",
  },
  fr: {
    // Common
    "app.name": "OpacoVault",
    "app.tagline": "Votre système de gestion de collection personnel",

    // Navigation
    "nav.home": "Accueil",
    "nav.checklist": "Liste de contrôle",
    "nav.wishlist": "Liste de souhaits",
    "nav.customs": "Personnalisés",
    "nav.display": "Affichage",
    "nav.add": "Ajouter",
    "nav.rewind": "Rembobiner",
    "nav.insights": "Statistiques",
    "nav.about": "À propos",
    "nav.settings": "Paramètres",
    "nav.signout": "Déconnexion",

    // Settings
    "settings.profile": "Profil",
    "settings.appearance": "Apparence",
    "settings.language": "Langue",
    "settings.notifications": "Notifications",
    "settings.security": "Sécurité",
    "settings.backup": "Sauvegarde",
    "settings.sync": "Synchronisation",
    "settings.reset": "Réinitialiser",
    "settings.updates": "Mises à jour",
    "settings.darkMode": "Mode Sombre",
    "settings.theme": "Thème",
    "settings.font": "Police",
    "settings.saveAppearance": "Enregistrer l'apparence",
    "settings.preview": "Aperçu",
    "settings.themePreview": "Aperçu du thème",
    "settings.primary": "Primaire",
    "settings.secondary": "Secondaire",
    "settings.chooseLanguage": "Choisissez votre langue préférée",
    "settings.restartLanguage": "L'application redémarrera pour appliquer les changements de langue",
    "settings.applyLanguage": "Appliquer la langue",

    // Add
    "add.figures": "Figurines",
    "add.wishlist": "Liste de souhaits",
    "add.customs": "Personnalisés",
    "add.id": "ID",
    "add.name": "Nom",
    "add.type": "Type",
    "add.franchise": "Franchise",
    "add.brand": "Marque",
    "add.serie": "Série",
    "add.yearReleased": "Année de sortie",
    "add.condition": "État",
    "add.price": "Prix (COP)",
    "add.yearPurchase": "Année d'achat",
    "add.upc": "UPC",
    "add.logo": "Logo",
    "add.photo": "Photo",
    "add.tagline": "Slogan",
    "add.review": "Critique",
    "add.shelf": "Étagère",
    "add.display": "Affichage",
    "add.ranking": "Classement",
    "add.comments": "Commentaires",
    "add.cancel": "Annuler",
    "add.addToChecklist": "Ajouter à la liste de contrôle",
    "add.addToWishlist": "Ajouter à la liste de souhaits",
    "add.addToCustoms": "Ajouter aux personnalisés",
    "add.added": "Ajouté!",
    "add.itemAdded": "Élément ajouté avec succès.",

    // Profile
    "profile.changePhoto": "Changer la photo",
    "profile.updateLogo": "Mettre à jour le logo",
    "profile.name": "Nom",
    "profile.email": "Email",
    "profile.bio": "Biographie",
    "profile.saveChanges": "Enregistrer les modifications",
    "profile.photoChanged": "Photo modifiée",
    "profile.photoUpdated": "Votre photo de profil a été mise à jour.",
    "profile.uploadImage": "Télécharger une image",
    "profile.dragDrop": "Glissez et déposez une image, ou cliquez pour sélectionner",
    "profile.maxSize": "Taille maximale du fichier: 5MB",

    // Web Preview
    "preview.visitWebsite": "Visiter le site",
    "preview.openInNewTab": "Ouvrir dans un nouvel onglet",
    "preview.loading": "Chargement de l'aperçu...",
    "preview.error": "Impossible de charger l'aperçu",
    "preview.latestNews": "Dernières nouvelles de",
    "preview.latestProducts": "Derniers produits de",
    "preview.shopAt": "Acheter à",
    "preview.visit": "Visiter",

    // Home
    "home.recentAdditions": "Ajouts Récents",
    "home.latestFigures": "Dernières figurines ajoutées à votre collection",
    "home.upcomingReleases": "Prochaines Sorties",
    "home.horrorFigures": "Figurines d'horreur à venir",
    "home.favoriteItems": "Articles Favoris",
    "home.topRated": "Vos articles les mieux notés",
    "home.figureNews": "Actualités des Figurines",
    "home.figureBrands": "Marques de Figurines",
    "home.figureStores": "Magasins de Figurines",
    "home.noRecent": "Pas d'ajouts récents pour le moment.",
    "home.noFavorites": "Pas d'articles favoris pour le moment. Notez vos articles avec 5 étoiles pour les voir ici.",
    "home.releasesIn": "Sortie dans",
    "home.weeks": "semaines",
    "home.month": "mois",
    "home.months": "mois",
    "home.starRating": "Note 5 étoiles",
    "home.addedRecently": "Ajouté récemment",
  },
  de: {
    // Common
    "app.name": "OpacoVault",
    "app.tagline": "Ihr persönliches Sammlungsverwaltungssystem",

    // Navigation
    "nav.home": "Startseite",
    "nav.checklist": "Checkliste",
    "nav.wishlist": "Wunschliste",
    "nav.customs": "Benutzerdefiniert",
    "nav.display": "Anzeige",
    "nav.add": "Hinzufügen",
    "nav.rewind": "Zurückspulen",
    "nav.insights": "Einblicke",
    "nav.about": "Über",
    "nav.settings": "Einstellungen",
    "nav.signout": "Abmelden",

    // Settings
    "settings.profile": "Profil",
    "settings.appearance": "Erscheinungsbild",
    "settings.language": "Sprache",
    "settings.notifications": "Benachrichtigungen",
    "settings.security": "Sicherheit",
    "settings.backup": "Sicherung",
    "settings.sync": "Synchronisierung",
    "settings.reset": "Zurücksetzen",
    "settings.updates": "Updates",
    "settings.darkMode": "Dunkelmodus",
    "settings.theme": "Thema",
    "settings.font": "Schriftart",
    "settings.saveAppearance": "Erscheinungsbild speichern",
    "settings.preview": "Vorschau",
    "settings.themePreview": "Themenvorschau",
    "settings.primary": "Primär",
    "settings.secondary": "Sekundär",
    "settings.chooseLanguage": "Wählen Sie Ihre bevorzugte Sprache",
    "settings.restartLanguage": "Die Anwendung wird neu gestartet, um Sprachänderungen anzuwenden",
    "settings.applyLanguage": "Sprache anwenden",

    // Add
    "add.figures": "Figuren",
    "add.wishlist": "Wunschliste",
    "add.customs": "Benutzerdefiniert",
    "add.id": "ID",
    "add.name": "Name",
    "add.type": "Typ",
    "add.franchise": "Franchise",
    "add.brand": "Marke",
    "add.serie": "Serie",
    "add.yearReleased": "Erscheinungsjahr",
    "add.condition": "Zustand",
    "add.price": "Preis (COP)",
    "add.yearPurchase": "Kaufjahr",
    "add.upc": "UPC",
    "add.logo": "Logo",
    "add.photo": "Foto",
    "add.tagline": "Slogan",
    "add.review": "Bewertung",
    "add.shelf": "Regal",
    "add.display": "Anzeige",
    "add.ranking": "Rangfolge",
    "add.comments": "Kommentare",
    "add.cancel": "Abbrechen",
    "add.addToChecklist": "Zur Checkliste hinzufügen",
    "add.addToWishlist": "Zur Wunschliste hinzufügen",
    "add.addToCustoms": "Zu Benutzerdefiniert hinzufügen",
    "add.added": "Hinzugefügt!",
    "add.itemAdded": "Element erfolgreich hinzugefügt.",

    // Profile
    "profile.changePhoto": "Foto ändern",
    "profile.updateLogo": "Logo aktualisieren",
    "profile.name": "Name",
    "profile.email": "E-Mail",
    "profile.bio": "Biografie",
    "profile.saveChanges": "Änderungen speichern",
    "profile.photoChanged": "Foto geändert",
    "profile.photoUpdated": "Ihr Profilfoto wurde aktualisiert.",
    "profile.uploadImage": "Bild hochladen",
    "profile.dragDrop": "Ziehen Sie ein Bild hierher oder klicken Sie zum Auswählen",
    "profile.maxSize": "Maximale Dateigröße: 5MB",

    // Web Preview
    "preview.visitWebsite": "Website besuchen",
    "preview.openInNewTab": "In neuem Tab öffnen",
    "preview.loading": "Vorschau wird geladen...",
    "preview.error": "Vorschau konnte nicht geladen werden",
    "preview.latestNews": "Neueste Nachrichten von",
    "preview.latestProducts": "Neueste Produkte von",
    "preview.shopAt": "Einkaufen bei",
    "preview.visit": "Besuchen",

    // Home
    "home.recentAdditions": "Neueste Ergänzungen",
    "home.latestFigures": "Zuletzt zu Ihrer Sammlung hinzugefügte Figuren",
    "home.upcomingReleases": "Kommende Veröffentlichungen",
    "home.horrorFigures": "Horror-Figuren in Kürze",
    "home.favoriteItems": "Lieblingselemente",
    "home.topRated": "Ihre am besten bewerteten Elemente",
    "home.figureNews": "Figuren-Neuigkeiten",
    "home.figureBrands": "Figuren-Marken",
    "home.figureStores": "Figuren-Geschäfte",
    "home.noRecent": "Noch keine neuen Ergänzungen.",
    "home.noFavorites": "Noch keine Lieblingselemente. Bewerten Sie Ihre Elemente mit 5 Sternen, um sie hier zu sehen.",
    "home.releasesIn": "Erscheint in",
    "home.weeks": "Wochen",
    "home.month": "Monat",
    "home.months": "Monaten",
    "home.starRating": "5-Sterne-Bewertung",
    "home.addedRecently": "Kürzlich hinzugefügt",
  },
  pt: {
    // Common
    "app.name": "OpacoVault",
    "app.tagline": "Seu sistema pessoal de gerenciamento de coleções",

    // Navigation
    "nav.home": "Início",
    "nav.checklist": "Lista de Verificação",
    "nav.wishlist": "Lista de Desejos",
    "nav.customs": "Personalizados",
    "nav.display": "Exibição",
    "nav.add": "Adicionar",
    "nav.rewind": "Retroceder",
    "nav.insights": "Insights",
    "nav.about": "Sobre",
    "nav.settings": "Configurações",
    "nav.signout": "Sair",

    // Settings
    "settings.profile": "Perfil",
    "settings.appearance": "Aparência",
    "settings.language": "Idioma",
    "settings.notifications": "Notificações",
    "settings.security": "Segurança",
    "settings.backup": "Backup",
    "settings.sync": "Sincronização",
    "settings.reset": "Redefinir",
    "settings.updates": "Atualizações",
    "settings.darkMode": "Modo Escuro",
    "settings.theme": "Tema",
    "settings.font": "Fonte",
    "settings.saveAppearance": "Salvar Aparência",
    "settings.preview": "Pré-visualização",
    "settings.themePreview": "Pré-visualização do tema",
    "settings.primary": "Primário",
    "settings.secondary": "Secundário",
    "settings.chooseLanguage": "Escolha seu idioma preferido",
    "settings.restartLanguage": "O aplicativo será reiniciado para aplicar as alterações de idioma",
    "settings.applyLanguage": "Aplicar Idioma",

    // Add
    "add.figures": "Figuras",
    "add.wishlist": "Lista de Desejos",
    "add.customs": "Personalizados",
    "add.id": "ID",
    "add.name": "Nome",
    "add.type": "Tipo",
    "add.franchise": "Franquia",
    "add.brand": "Marca",
    "add.serie": "Série",
    "add.yearReleased": "Ano de Lançamento",
    "add.condition": "Condição",
    "add.price": "Preço (COP)",
    "add.yearPurchase": "Ano de Compra",
    "add.upc": "UPC",
    "add.logo": "Logo",
    "add.photo": "Foto",
    "add.tagline": "Slogan",
    "add.review": "Avaliação",
    "add.shelf": "Prateleira",
    "add.display": "Exibição",
    "add.ranking": "Classificação",
    "add.comments": "Comentários",
    "add.cancel": "Cancelar",
    "add.addToChecklist": "Adicionar à Lista de Verificação",
    "add.addToWishlist": "Adicionar à Lista de Desejos",
    "add.addToCustoms": "Adicionar aos Personalizados",
    "add.added": "Adicionado!",
    "add.itemAdded": "Item adicionado com sucesso.",

    // Profile
    "profile.changePhoto": "Alterar Foto",
    "profile.updateLogo": "Atualizar Logo",
    "profile.name": "Nome",
    "profile.email": "Email",
    "profile.bio": "Biografia",
    "profile.saveChanges": "Salvar Alterações",
    "profile.photoChanged": "Foto Alterada",
    "profile.photoUpdated": "Sua foto de perfil foi atualizada.",
    "profile.uploadImage": "Carregar Imagem",
    "profile.dragDrop": "Arraste e solte uma imagem, ou clique para selecionar",
    "profile.maxSize": "Tamanho máximo do arquivo: 5MB",

    // Web Preview
    "preview.visitWebsite": "Visitar Site",
    "preview.openInNewTab": "Abrir em nova aba",
    "preview.loading": "Carregando pré-visualização...",
    "preview.error": "Não foi possível carregar a pré-visualização",
    "preview.latestNews": "Últimas notícias de",
    "preview.latestProducts": "Últimos produtos de",
    "preview.shopAt": "Comprar em",
    "preview.visit": "Visitar",

    // Home
    "home.recentAdditions": "Adições Recentes",
    "home.latestFigures": "Últimas figuras adicionadas à sua coleção",
    "home.upcomingReleases": "Próximos Lançamentos",
    "home.horrorFigures": "Figuras de horror em breve",
    "home.favoriteItems": "Itens Favoritos",
    "home.topRated": "Seus itens mais bem avaliados",
    "home.figureNews": "Notícias de Figuras",
    "home.figureBrands": "Marcas de Figuras",
    "home.figureStores": "Lojas de Figuras",
    "home.noRecent": "Ainda não há adições recentes.",
    "home.noFavorites": "Ainda não há itens favoritos. Avalie seus itens com 5 estrelas para vê-los aqui.",
    "home.releasesIn": "Lançamento em",
    "home.weeks": "semanas",
    "home.month": "mês",
    "home.months": "meses",
    "home.starRating": "Avaliação 5 estrelas",
    "home.addedRecently": "Adicionado recentemente",
  },
  zh: {
    // Common
    "app.name": "OpacoVault",
    "app.tagline": "您的个人收藏管理系统",

    // Navigation
    "nav.home": "首页",
    "nav.checklist": "清单",
    "nav.wishlist": "愿望清单",
    "nav.customs": "自定义",
    "nav.display": "展示",
    "nav.add": "添加",
    "nav.rewind": "回顾",
    "nav.insights": "统计",
    "nav.about": "关于",
    "nav.settings": "设置",
    "nav.signout": "退出登录",

    // Settings
    "settings.profile": "个人资料",
    "settings.appearance": "外观",
    "settings.language": "语言",
    "settings.notifications": "通知",
    "settings.security": "安全",
    "settings.backup": "备份",
    "settings.sync": "同步",
    "settings.reset": "重置",
    "settings.updates": "更新",
    "settings.darkMode": "暗黑模式",
    "settings.theme": "主题",
    "settings.font": "字体",
    "settings.saveAppearance": "保存外观",
    "settings.preview": "预览",
    "settings.themePreview": "主题预览",
    "settings.primary": "主要",
    "settings.secondary": "次要",
    "settings.chooseLanguage": "选择您偏好的语言",
    "settings.restartLanguage": "应用程序将重启以应用语言更改",
    "settings.applyLanguage": "应用语言",

    // Add
    "add.figures": "人偶",
    "add.wishlist": "愿望清单",
    "add.customs": "自定义",
    "add.id": "ID",
    "add.name": "名称",
    "add.type": "类型",
    "add.franchise": "系列",
    "add.brand": "品牌",
    "add.serie": "系列",
    "add.yearReleased": "发行年份",
    "add.condition": "状态",
    "add.price": "价格 (COP)",
    "add.yearPurchase": "购买年份",
    "add.upc": "UPC",
    "add.logo": "标志",
    "add.photo": "照片",
    "add.tagline": "标语",
    "add.review": "评论",
    "add.shelf": "货架",
    "add.display": "展示",
    "add.ranking": "排名",
    "add.comments": "评论",
    "add.cancel": "取消",
    "add.addToChecklist": "添加到清单",
    "add.addToWishlist": "添加到愿望清单",
    "add.addToCustoms": "添加到自定义",
    "add.added": "已添加！",
    "add.itemAdded": "项目添加成功。",

    // Profile
    "profile.changePhoto": "更改照片",
    "profile.updateLogo": "更新标志",
    "profile.name": "姓名",
    "profile.email": "电子邮件",
    "profile.bio": "简介",
    "profile.saveChanges": "保存更改",
    "profile.photoChanged": "照片已更改",
    "profile.photoUpdated": "您的个人资料照片已更新。",
    "profile.uploadImage": "上传图片",
    "profile.dragDrop": "拖放图片，或点击选择",
    "profile.maxSize": "最大文件大小：5MB",

    // Web Preview
    "preview.visitWebsite": "访问网站",
    "preview.openInNewTab": "在新标签页中打开",
    "preview.loading": "加载预览...",
    "preview.error": "无法加载预览",
    "preview.latestNews": "来自以下网站的最新消息",
    "preview.latestProducts": "来自以下网站的最新产品",
    "preview.shopAt": "在以下网站购物",
    "preview.visit": "访问",

    // Home
    "home.recentAdditions": "最近添加",
    "home.latestFigures": "最近添加到您收藏中的人偶",
    "home.upcomingReleases": "即将发布",
    "home.horrorFigures": "即将推出的恐怖人偶",
    "home.favoriteItems": "收藏项目",
    "home.topRated": "您评分最高的项目",
    "home.figureNews": "人偶新闻",
    "home.figureBrands": "人偶品牌",
    "home.figureStores": "人偶商店",
    "home.noRecent": "暂无最近添加项目。",
    "home.noFavorites": "暂无收藏项目。给您的项目评5星以在此处查看。",
    "home.releasesIn": "发布于",
    "home.weeks": "周",
    "home.month": "月",
    "home.months": "月",
    "home.starRating": "5星评分",
    "home.addedRecently": "最近添加",
  },
  ru: {
    // Common
    "app.name": "OpacoVault",
    "app.tagline": "Ваша персональная система управления коллекциями",

    // Navigation
    "nav.home": "Главная",
    "nav.checklist": "Список",
    "nav.wishlist": "Список желаний",
    "nav.customs": "Пользовательские",
    "nav.display": "Отображение",
    "nav.add": "Добавить",
    "nav.rewind": "Обзор",
    "nav.insights": "Статистика",
    "nav.about": "О программе",
    "nav.settings": "Настройки",
    "nav.signout": "Выйти",

    // Settings
    "settings.profile": "Профиль",
    "settings.appearance": "Внешний вид",
    "settings.language": "Язык",
    "settings.notifications": "Уведомления",
    "settings.security": "Безопасность",
    "settings.backup": "Резервное копирование",
    "settings.sync": "Синхронизация",
    "settings.reset": "Сброс",
    "settings.updates": "Обновления",
    "settings.darkMode": "Темный режим",
    "settings.theme": "Тема",
    "settings.font": "Шрифт",
    "settings.saveAppearance": "Сохранить внешний вид",
    "settings.preview": "Предпросмотр",
    "settings.themePreview": "Предпросмотр темы",
    "settings.primary": "Основной",
    "settings.secondary": "Вторичный",
    "settings.chooseLanguage": "Выберите предпочитаемый язык",
    "settings.restartLanguage": "Приложение перезапустится для применения изменений языка",
    "settings.applyLanguage": "Применить язык",

    // Add
    "add.figures": "Фигурки",
    "add.wishlist": "Список желаний",
    "add.customs": "Пользовательские",
    "add.id": "ID",
    "add.name": "Название",
    "add.type": "Тип",
    "add.franchise": "Франшиза",
    "add.brand": "Бренд",
    "add.serie": "Серия",
    "add.yearReleased": "Год выпуска",
    "add.condition": "Состояние",
    "add.price": "Цена (COP)",
    "add.yearPurchase": "Год покупки",
    "add.upc": "UPC",
    "add.logo": "Логотип",
    "add.photo": "Фото",
    "add.tagline": "Слоган",
    "add.review": "Обзор",
    "add.shelf": "Полка",
    "add.display": "Отображение",
    "add.ranking": "Рейтинг",
    "add.comments": "Комментарии",
    "add.cancel": "Отмена",
    "add.addToChecklist": "Добавить в список",
    "add.addToWishlist": "Добавить в список желаний",
    "add.addToCustoms": "Добавить в пользовательские",
    "add.added": "Добавлено!",
    "add.itemAdded": "Элемент успешно добавлен.",

    // Profile
    "profile.changePhoto": "Изменить фото",
    "profile.updateLogo": "Обновить логотип",
    "profile.name": "Имя",
    "profile.email": "Электронная почта",
    "profile.bio": "Биография",
    "profile.saveChanges": "Сохранить изменения",
    "profile.photoChanged": "Фото изменено",
    "profile.photoUpdated": "Ваше фото профиля было обновлено.",
    "profile.uploadImage": "Загрузить изображение",
    "profile.dragDrop": "Перетащите изображение или нажмите для выбора",
    "profile.maxSize": "Максимальный размер файла: 5MB",

    // Web Preview
    "preview.visitWebsite": "Посетить сайт",
    "preview.openInNewTab": "Открыть в новой вкладке",
    "preview.loading": "Загрузка предпросмотра...",
    "preview.error": "Не удалось загрузить предпросмотр",
    "preview.latestNews": "Последние новости от",
    "preview.latestProducts": "Последние продукты от",
    "preview.shopAt": "Купить в",
    "preview.visit": "Посетить",

    // Home
    "home.recentAdditions": "Недавние добавления",
    "home.latestFigures": "Последние фигурки, добавленные в вашу коллекцию",
    "home.upcomingReleases": "Предстоящие релизы",
    "home.horrorFigures": "Фигурки ужасов скоро",
    "home.favoriteItems": "Избранные элементы",
    "home.topRated": "Ваши лучшие элементы",
    "home.figureNews": "Новости фигурок",
    "home.figureBrands": "Бренды фигурок",
    "home.figureStores": "Магазины фигурок",
    "home.noRecent": "Пока нет недавних добавлений.",
    "home.noFavorites": "Пока нет избранных элементов. Оцените ваши элементы на 5 звезд, чтобы увидеть их здесь.",
    "home.releasesIn": "Выход через",
    "home.weeks": "недель",
    "home.month": "месяц",
    "home.months": "месяцев",
    "home.starRating": "5-звездочный рейтинг",
    "home.addedRecently": "Недавно добавлено",
  },
  it: {
    // Common
    "app.name": "OpacoVault",
    "app.tagline": "Il tuo sistema personale di gestione delle collezioni",

    // Navigation
    "nav.home": "Home",
    "nav.checklist": "Lista di controllo",
    "nav.wishlist": "Lista dei desideri",
    "nav.customs": "Personalizzati",
    "nav.display": "Visualizzazione",
    "nav.add": "Aggiungi",
    "nav.rewind": "Riavvolgi",
    "nav.insights": "Statistiche",
    "nav.about": "Informazioni",
    "nav.settings": "Impostazioni",
    "nav.signout": "Esci",

    // Settings
    "settings.profile": "Profilo",
    "settings.appearance": "Aspetto",
    "settings.language": "Lingua",
    "settings.notifications": "Notifiche",
    "settings.security": "Sicurezza",
    "settings.backup": "Backup",
    "settings.sync": "Sincronizzazione",
    "settings.reset": "Ripristina",
    "settings.updates": "Aggiornamenti",
    "settings.darkMode": "Modalità Scura",
    "settings.theme": "Tema",
    "settings.font": "Font",
    "settings.saveAppearance": "Salva aspetto",
    "settings.preview": "Anteprima",
    "settings.themePreview": "Anteprima tema",
    "settings.primary": "Primario",
    "settings.secondary": "Secondario",
    "settings.chooseLanguage": "Scegli la tua lingua preferita",
    "settings.restartLanguage": "L'applicazione si riavvierà per applicare le modifiche alla lingua",
    "settings.applyLanguage": "Applica lingua",

    // Add
    "add.figures": "Figure",
    "add.wishlist": "Lista dei desideri",
    "add.customs": "Personalizzati",
    "add.id": "ID",
    "add.name": "Nome",
    "add.type": "Tipo",
    "add.franchise": "Franchise",
    "add.brand": "Marca",
    "add.serie": "Serie",
    "add.yearReleased": "Anno di rilascio",
    "add.condition": "Condizione",
    "add.price": "Prezzo (COP)",
    "add.yearPurchase": "Anno di acquisto",
    "add.upc": "UPC",
    "add.logo": "Logo",
    "add.photo": "Foto",
    "add.tagline": "Slogan",
    "add.review": "Recensione",
    "add.shelf": "Scaffale",
    "add.display": "Visualizzazione",
    "add.ranking": "Classifica",
    "add.comments": "Commenti",
    "add.cancel": "Annulla",
    "add.addToChecklist": "Aggiungi alla lista di controllo",
    "add.addToWishlist": "Aggiungi alla lista dei desideri",
    "add.addToCustoms": "Aggiungi ai personalizzati",
    "add.added": "Aggiunto!",
    "add.itemAdded": "Elemento aggiunto con successo.",

    // Profile
    "profile.changePhoto": "Cambia foto",
    "profile.updateLogo": "Aggiorna logo",
    "profile.name": "Nome",
    "profile.email": "Email",
    "profile.bio": "Biografia",
    "profile.saveChanges": "Salva modifiche",
    "profile.photoChanged": "Foto cambiata",
    "profile.photoUpdated": "La tua foto profilo è stata aggiornata.",
    "profile.uploadImage": "Carica immagine",
    "profile.dragDrop": "Trascina e rilascia un'immagine, o clicca per selezionare",
    "profile.maxSize": "Dimensione massima del file: 5MB",

    // Web Preview
    "preview.visitWebsite": "Visita sito web",
    "preview.openInNewTab": "Apri in nuova scheda",
    "preview.loading": "Caricamento anteprima...",
    "preview.error": "Impossibile caricare l'anteprima",
    "preview.latestNews": "Ultime notizie da",
    "preview.latestProducts": "Ultimi prodotti da",
    "preview.shopAt": "Acquista su",
    "preview.visit": "Visita",

    // Home
    "home.recentAdditions": "Aggiunte recenti",
    "home.latestFigures": "Ultime figure aggiunte alla tua collezione",
    "home.upcomingReleases": "Prossime uscite",
    "home.horrorFigures": "Figure horror in arrivo",
    "home.favoriteItems": "Elementi preferiti",
    "home.topRated": "I tuoi elementi più votati",
    "home.figureNews": "Notizie figure",
    "home.figureBrands": "Marche figure",
    "home.figureStores": "Negozi figure",
    "home.noRecent": "Ancora nessuna aggiunta recente.",
    "home.noFavorites": "Ancora nessun elemento preferito. Valuta i tuoi elementi con 5 stelle per vederli qui.",
    "home.releasesIn": "Esce tra",
    "home.weeks": "settimane",
    "home.month": "mese",
    "home.months": "mesi",
    "home.starRating": "Valutazione 5 stelle",
    "home.addedRecently": "Aggiunto recentemente",
  },
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")
  // Cambiar el idioma predeterminado a inglés
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
      document.documentElement.classList.toggle("light", savedTheme === "light")
    } else {
      // Por defecto, usar tema oscuro
      document.documentElement.classList.add("dark")
    }

    // Load language from localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
    document.documentElement.classList.toggle("light", newTheme === "light")
  }

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  // Translation function
  const t = (key: string) => {
    return translations[language]?.[key] || translations.en?.[key] || key
  }

  // Definir un objeto de traducciones mínimo para evitar errores
  const translations: Record<Language, Record<string, string>> = {
    en: {
      "nav.home": "Home",
      "home.recentAdditions": "Recent Additions",
      "home.latestFigures": "Latest figures added to your collection",
      "home.favoriteItems": "Favorite Items",
      "home.topRated": "Your top-rated items",
      "home.noRecent": "No recent additions yet.",
      "home.noFavorites": "No favorite items yet. Rate your items with 5 stars to see them here.",
      "home.starRating": "5-star rating",
      "home.addedRecently": "Added recently",
    },
    es: {
      "nav.home": "Inicio",
      "home.recentAdditions": "Adiciones Recientes",
      "home.latestFigures": "Últimas figuras añadidas a tu colección",
      "home.favoriteItems": "Elementos Favoritos",
      "home.topRated": "Tus elementos mejor valorados",
      "home.noRecent": "Aún no hay adiciones recientes.",
      "home.noFavorites": "Aún no hay elementos favoritos. Califica tus elementos con 5 estrellas para verlos aquí.",
      "home.starRating": "Calificación de 5 estrellas",
      "home.addedRecently": "Añadido recientemente",
    },
    fr: {}, // Añadir traducciones según sea necesario
    de: {}, // Añadir traducciones según sea necesario
    pt: {}, // Añadir traducciones según sea necesario
    zh: {}, // Añadir traducciones según sea necesario
    ru: {}, // Añadir traducciones según sea necesario
    it: {}, // Añadir traducciones según sea necesario
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        language,
        toggleTheme,
        setLanguage,
        translations,
        t,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
