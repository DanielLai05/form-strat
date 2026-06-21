import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../config/firebase'

const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

/**
 * Upload a form banner image to Firebase Storage and return its download URL.
 * Stored under banners/<uid>/<timestamp>-<filename>.
 */
export async function uploadBanner(file, uid) {
  if (!storage) throw new Error('Firebase Storage is not configured.')
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.')
  }
  if (file.size > MAX_BYTES) {
    throw new Error('Image is too large (max 5 MB).')
  }

  const safeName = file.name.replace(/[^\w.-]+/g, '_')
  const path = `banners/${uid || 'anon'}/${Date.now()}-${safeName}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}
