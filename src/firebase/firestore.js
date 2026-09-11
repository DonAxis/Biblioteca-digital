import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  increment,
} from 'firebase/firestore'
import { app } from './config'

export const db = getFirestore(app)

const COL = 'documents'

export const getDocuments = async (section = null) => {
  let q = section
    ? query(collection(db, COL), where('section', '==', section), orderBy('uploadedAt', 'desc'))
    : query(collection(db, COL), orderBy('uploadedAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const getDocument = async (id) => {
  const snap = await getDoc(doc(db, COL, id))
  if (!snap.exists()) throw new Error('Documento no encontrado')
  return { id: snap.id, ...snap.data() }
}

export const addDocument = async (metadata) =>
  addDoc(collection(db, COL), {
    ...metadata,
    uploadedAt: serverTimestamp(),
    downloads: 0,
  })

export const deleteDocument = async (id) =>
  deleteDoc(doc(db, COL, id))

export const incrementDownloads = async (id) =>
  updateDoc(doc(db, COL, id), { downloads: increment(1) })
