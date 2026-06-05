import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';

import { EnvConfig } from '../../env.model';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenAI;

  constructor(configService: ConfigService<EnvConfig>) {
    const apiKey = configService.get<string>('GEMINI_API_KEY', { infer: true });
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    this.genAI = new GoogleGenAI({ apiKey });
  }

  async generateSummary(content: string) {
    const response = await this.genAI.models.generateContent({
      model: 'gemini-3.5-flash', // (2)
      contents: content, // (3)
      config: {
        systemInstruction: 'Generate a concise summary of the following content with a limit of 200 characters', // (3.1)
      },
    });
    return response.text; // (4)
  }

  /* (5)
  async generateImage(prompt: string) {
    const response = await this.genAI.models.generateContent({
      model: 'imagen-3.0-generate-001', // (2)
      contents: prompt, // (3)
      config: {
        systemInstruction: 'Generate an image based on the following prompt',
        responseModalities: ['IMAGE'],
      },
    });

    const imagenBase64 = response.candidates[0].content?.parts[0].inlineData?.data;

    return imagenBase64 ? `data:image/png;base64,${imagenBase64}` : null;
  }
  */
}

/****
 * (1).- Obtiene la clave API de Gemini desde las variables de entorno utilizando el ConfigService.
 * (2).- Especifica el modelo de lenguaje que se utilizará para generar el resumen. En este caso, se está utilizando 'gemini-3.5-flash', pero puedes elegir otro modelo disponible según tus necesidades.
 * (3).- Define el contenido que se enviará al modelo para generar el resumen. Aquí se le indica al modelo que genere un resumen conciso del contenido proporcionado.
 ** (3.1).- La instrucción del sistema es una indicación adicional para el modelo sobre cómo debe procesar el contenido. En este caso, se le dice al modelo que genere un resumen conciso.
 * (4).- Devuelve el texto generado por el modelo, que será el resumen del contenido original.
 * (5).- Generador de imagen. Este método utiliza un modelo de generación de imágenes para crear una imagen basada en un prompt dado. La respuesta se procesa para extraer la imagen en formato base64, que luego se devuelve como una URL de datos.
 */
