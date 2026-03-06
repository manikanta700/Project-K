import multer from 'multer';

// Use memoryStorage so files go directly into memory as buffers
// This avoids disk writes and prevents accidental re-uploads from stale temp files
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;