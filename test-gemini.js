require('dotenv').config({ path: '.env.local' });
const { GoogleGenAI } = require('@google/genai');

async function main() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: "draw a cat",
      config: {
        responseModalities: ['IMAGE'],
        aspectRatio: "1:1"
      }
    });
    console.log("Success", res.candidates?.[0]?.content?.parts?.[0]?.inlineData ? "Got Image" : "No image");
  } catch(e) {
    console.error("Error", e.message);
  }
}
main();
