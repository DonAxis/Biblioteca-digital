# HALL — Tu sala de estudio digital

Portal del ecosistema HALL (`digitalhall.com.mx`). Este repo contiene la portada (la "puerta"),
Orientación vocacional y la Biblioteca (repositorio científico). Frontend estático en GitHub Pages, backend en Firebase.

## Mapa del sitio (acordado nov 2026)
```
digitalhall.com.mx  ─  HALL, tu sala de estudio digital  (la puerta, src/pages/Home.jsx)
 ├─ Orientación   ¿Qué estudiar?          /#/orientacion   (este repo)
 ├─ Campus        Aprende y certifícate   campus.digitalhall.com.mx  ← el que vende (otro repo)
 ├─ Biblioteca    Consulta e investiga    /#/biblioteca    (este repo; documentos en /#/browse)
 └─ Noticias      NotiWeb                 donaxis.github.io/NotiWeb (externo)
```
- Marca: **HALL** + lema *"Tu sala de estudio digital"*. Ya no se usa "HALL Educación Digital".
- El orden de las tarjetas es el camino del estudiante; Campus va destacado (dorado).
- URLs llevan `#` por HashRouter (GitHub Pages). Quitarlo requiere migrar a Firebase Hosting.
- Pendientes a decidir: login único entre Biblioteca y Campus (hoy son Firebase distintos);
  mover Noticias a `noticias.digitalhall.com.mx`.

## Stack
- React 18 + Vite + Tailwind CSS
- React Router v6 (HashRouter — requerido para GitHub Pages)
- Firebase v10: Auth (email/password), Firestore (metadatos), Storage (PDFs)
- GitHub Actions para deploy automático

## URL producción
`https://digitalhall.com.mx`

## Estructura
```
src/
  firebase/     config.js, auth.js, firestore.js, storage.js
  contexts/     AuthContext.jsx  — sesión de usuario + isAdmin
  hooks/        useDocuments.js  — carga documentos con estado
  components/   Header, Footer, SearchBar, SectionFilter, DocumentCard, PDFViewer, ProtectedRoute,
                CareerRadar, AreaFilter (Orientación)
  data/         careers.json — carreras y puntaje por área (Orientación)
  pages/        Home (portal), Orientacion, Biblioteca (portada de la biblioteca),
                Browse, Document, Login, Admin
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
3. Agregar `digitalhall.com.mx` en Auth → Authorized domains
4. Crear Firestore en modo producción
5. Habilitar Storage en modo producción
6. Agregar app web y copiar config a `.env.local` y GitHub Secrets
7. Crear cuenta admin en Auth → Users con el email de `VITE_ADMIN_EMAIL`
8. Desplegar reglas: `firebase deploy --only firestore,storage`

## Firebase — CORS para Storage (obligatorio en producción)
Sin esto los PDFs no se cargan desde el dominio custom:
```bash
# Crear cors.json
[{"origin": ["https://digitalhall.com.mx"], "method": ["GET"], "maxAgeSeconds": 3600}]
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

## Proyecto hermano: DigitalHall Campus (cursos) — en desarrollo

> ⚠️ **LÍMITE DE ÁREAS — NO CRUZAR**
> Campus es donde se imparten los cursos. **Todo lo interno de Campus le corresponde a la otra sesión**:
> su código, diseño, nombre/marca, cursos, contenido, precios, pagos, registro de alumnos,
> certificados, su Firebase (`digitalhall-campus`), su hosting y su DNS.
> **Esta sesión solo se encarga de cómo se *presenta y enlaza* Campus desde `digitalhall.com.mx`**
> (tarjeta en la portada y enlace del menú). Si algo de Campus parece necesitar cambios,
> no lo hagas ni lo propongas como tarea propia: díselo al usuario para que lo lleve a la otra sesión.

- URL: `https://campus.digitalhall.com.mx` (portada publicada, nov 2026)
- Proyecto **separado**: repo `github.com/DonAxis/digitalhall-campus`, Firebase propio (`digitalhall-campus`), Firebase Hosting (no GitHub Pages).
- Se construye en **otra sesión de VS Code** (`D:\trabajando\cursitos\plataforma`). Desde aquí **no se toca su código**; los cambios se piden a través del usuario.
- Su nombre y su marca los decide la otra sesión. Aquí se muestra como "Campus".
- Desde aquí solo se enlaza a Campus (menú del header y tarjeta destacada en Home).

## Secciones disponibles
Ciencias Básicas · Ingeniería y Tecnología · Ciencias de la Salud · Ciencias Sociales · Humanidades · Computación/TI · Tesis y Grado · Revistas y Artículos

## Colección Firestore: `documents`
```
title, author, abstract, year, section, keywords[], fileUrl,
storagePath, fileSize, uploadedAt, uploadedBy, downloads
```
