import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';

const upload = multer();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Adiciona CORS para todos os métodos
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }

  upload.single('file')(req, res, async function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: 'Arquivo de áudio é obrigatório.' });
      return;
    }

    const formData = new FormData();
    formData.append('file', req.file.buffer, req.file.originalname);
    formData.append('model', 'whisper-1');
    formData.append('language', 'pt');
    formData.append('response_format', 'text');

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
          }
        }
      );
      res.status(200).json({ transcription: response.data });
    } catch (err) {
      res.status(500).json({ error: err.response?.data || err.message });
    }
  });
}
