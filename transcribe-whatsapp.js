import { downloadContentFromMessage } from '@adiwajshing/baileys';
import axios from 'axios';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
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

  // Lê o body bruto (porque bodyParser está desativado)
  let body = '';
  for await (const chunk of req) body += chunk;
  let audioMessage;
  try {
    const parsed = JSON.parse(body);
    audioMessage = parsed.audioMessage;
  } catch (e) {
    res.status(400).json({ error: 'JSON inválido' });
    return;
  }

  if (!audioMessage) {
    res.status(400).json({ error: 'audioMessage é obrigatório' });
    return;
  }

  try {
    // Descriptografa o áudio do WhatsApp
    const stream = await downloadContentFromMessage(audioMessage, 'audio');
    const buffer = [];
    for await (const chunk of stream) buffer.push(chunk);
    const audioBuffer = Buffer.concat(buffer);

    // Envia para a OpenAI Whisper
    const formData = new FormData();
    formData.append('file', audioBuffer, 'audio.ogg');
    formData.append('model', 'whisper-1');
    formData.append('language', 'pt');
    formData.append('response_format', 'text');

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
}
