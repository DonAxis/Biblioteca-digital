import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { app } from './config'

export const storage = getStorage(app)

export const uploadPDF = (file, onProgress) => {
  const fileName = `${crypto.randomUUID()}-${file.name.replace(/\s+/g, '_')}`
  const storageRef = ref(storage, `documents/${fileName}`)
  const task = uploadBytesResumable(storageRef, file)

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      snapshot => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        onProgress?.(pct)
      },
      reject,
      async () => {
        const fileUrl = await getDownloadURL(task.snapshot.ref)
        resolve({ fileUrl, storagePath: `documents/${fileName}` })
      }
    )
  })
}

export const deletePDF = (storagePath) =>
  deleteObject(ref(storage, storagePath))
