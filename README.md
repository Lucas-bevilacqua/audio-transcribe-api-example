
# API de Transcrição de Áudio com Whisper (OpenAI) para Vercel

## Como usar

1. Suba este projeto para o GitHub.
2. Importe no Vercel.
3. Configure a variável de ambiente `OPENAI_API_KEY` com sua chave da OpenAI.
4. Faça um POST para `/api/transcribe` com um arquivo de áudio.

## Exemplo de uso no front-end

```js
const formData = new FormData();
formData.append('file', file, file.name);

const response = await fetch('https://SEU_PROJETO.vercel.app/api/transcribe', {
  method: 'POST',
  body: formData
});
const data = await response.json();
console.log(data.transcription);
```
```

---

## **3. Faça o commit e envie para o GitHub**

No terminal, dentro da pasta do projeto:

```bash
git add .
git commit -m "API de transcrição pronta para Vercel"
git branch -M main
git remote add origin https://github.com/Lucas-bevilacqua/audio-transcribe-api-example.git
git push -u origin main
```

---

## **4. Importe o projeto no Vercel**

1. Acesse https://vercel.com/new
2. Selecione o repositório `audio-transcribe-api-example`.
3. Configure a variável de ambiente `OPENAI_API_KEY` com sua chave da OpenAI.
4. Clique em **Deploy**.

---

## **5. Pronto!**

Sua API estará online e pronta para uso.  
Se quiser um exemplo de front-end para testar, só pedir!

Se tiver qualquer dúvida ou erro em algum passo, me envie o print ou mensagem que te ajudo imediatamente!
