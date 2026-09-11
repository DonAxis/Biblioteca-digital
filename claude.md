# Biblioteca Digital Universitaria

Repositorio científico para la universidad. Frontend estático en GitHub Pages, backend en Firebase.

## Stack
- React 18 + Vite + Tailwind CSS
- React Router v6 (HashRouter — requerido para GitHub Pages)
- Firebase v10: Auth (email/password), Firestore (metadatos), Storage (PDFs)
- GitHub Actions para deploy automático

## URL producción
`https://DonAxis.github.io/Biblioteca-digital/`

## Estructura
```
src/
  firebase/     config.js, auth.js, firestore.js, storage.js
  contexts/     AuthContext.jsx  — sesión de usuario + isAdmin
  hooks/        useDocuments.js  — carga documentos con estado
  components/   Header, Footer, SearchBar, SectionFilter, DocumentCard, PDFViewer, ProtectedRoute
  pages/        Home, Browse, Document, Login, Admin
  constants.js  — SECTIONS array
```

## Setup local
1. Copiar `.env.example` → `.env.local` y completar valores de Firebase
2. `npm install`
3. `npm run dev`

## Variables de entorno (también como GitHub Secrets)
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_ADMIN_EMAIL      ← email del administrador que puede subir PDFs
```

## Firebase — pasos de configuración (una sola vez)
1. Crear proyecto en console.firebase.google.com
2. Habilitar Auth → Email/Password
3. Agregar `donaxis.github.io` en Auth → Authorized domains
4. Crear Firestore en modo producción
5. Habilitar Storage en modo producción
6. Agregar app web y copiar config a `.env.local` y GitHub Secrets
7. Crear cuenta admin en Auth → Users con el email de `VITE_ADMIN_EMAIL`
8. Desplegar reglas: `firebase deploy --only firestore,storage`

## Firebase — CORS para Storage (obligatorio en producción)
Sin esto los PDFs no se cargan desde GitHub Pages:
```bash
# Crear cors.json
[{"origin": ["https://DonAxis.github.io"], "method": ["GET"], "maxAgeSeconds": 3600}]
# Aplicar
gsutil cors set cors.json gs://TU_STORAGE_BUCKET
```

## GitHub Pages
1. Settings → Pages → Source: GitHub Actions
2. Agregar los 7 secrets de arriba
3. Push a `main` → deploy automático (~2 min)

## Admin
Solo el usuario con `VITE_ADMIN_EMAIL` puede subir y eliminar documentos.
El control está tanto en el UI (solo ese email ve el panel Admin) como en las Firebase Security Rules (server-side).

## Integración Moodle (Fase 2)
Los usuarios se autentican vía Moodle (unibravo.org/moodle). El flujo planeado:
- Plugin PHP en Moodle genera un Firebase Custom Token
- Redirige a `/#/login?token=TOKEN`
- La app llama `signInWithCustomToken(auth, token)` automáticamente
- El código para esto ya está en src/pages/Login.jsx y src/firebase/auth.js

## Secciones disponibles
Ciencias Básicas · Ingeniería y Tecnología · Ciencias de la Salud · Ciencias Sociales · Humanidades · Computación/TI · Tesis y Grado · Revistas y Artículos

## Colección Firestore: `documents`
```
title, author, abstract, year, section, keywords[], fileUrl,
storagePath, fileSize, uploadedAt, uploadedBy, downloads
```
