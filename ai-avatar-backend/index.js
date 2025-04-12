import { GoogleGenAI } from "@google/genai";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import sdk from "microsoft-cognitiveservices-speech-sdk";
import fs from "fs/promises";

dotenv.config();

const speechKey = process.env.AZURE_SPEECH_KEY;
const serviceRegion = process.env.AZURE_REGION;

// Audio to base64
const audioFileToBase64 = async (file) => {
  try {
    const data = await fs.readFile(file);
    return data.toString("base64");
  } catch (error) {
    console.error(`Error converting audio to base64 ${file}:`, error);
    return null;
  }
};

// Azure lip sync generator
const generateVisemesAzure = async (text, filename, gender) => {
  return new Promise((resolve, reject) => {
    const visemes = [];

    const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, serviceRegion);
    speechConfig.speechSynthesisVoiceName = gender === "male" ? "en-US-GuyNeural" : "en-US-JennyNeural";;
    speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz128KBitRateMonoMp3;


    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(filename);
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.visemeReceived = (s, e) => {
      visemes.push({
        start: e.audioOffset / 10000000, // convert to seconds
        visemeId: e.visemeId,
        value: visemeIdToMouthShape(e.visemeId)
      });
    };

    synthesizer.speakTextAsync(
      text,
      result => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          // Convert visemes to mouthCues style
          const mouthCues = [];
          for (let i = 0; i < visemes.length; i++) {
            const current = visemes[i];
            const next = visemes[i + 1];
            mouthCues.push({
              start: parseFloat(current.start.toFixed(2)),
              end: next ? parseFloat(next.start.toFixed(2)) : parseFloat((current.start + 0.3).toFixed(2)),
              value: current.value,
            });
          }

          resolve({
            metadata: {
              soundFile: filename,
              duration: mouthCues.at(-1)?.end || 1.5,
            },
            mouthCues,
          });
          console.log(`Generated visemes for ${filename}:`, mouthCues);

        } else {
          reject("Speech synthesis failed.");
        }
        synthesizer.close();
      },
      err => {
        console.error("Azure speech error:", err);
        synthesizer.close();
        reject(err);
      }
    );
  });
};

// Map Azure visemeId to basic mouth shapes (tweak as needed)
const visemeIdToMouthShape = (id) => {
  const visemeMap = {
    0: "X", 1: "A", 2: "B", 3: "C", 4: "D", 5: "E", 6: "F", 7: "G", 8: "H", 9: "I",
    10: "J", 11: "K", 12: "L", 13: "M", 14: "N", 15: "O", 16: "P", 17: "Q", 18: "R", 19: "S", 20: "T"
  };
  return visemeMap[id] || "X";
};

const setupVirtualFriendApp = () => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const app = express();
  app.use(express.json());
  app.use(cors());
  const port = process.env.PORT || 3000;

  const parseResponseMessages = (responseText) => {
    try {
      const jsonMatch = responseText.match(/```json\s*(\[[\s\S]*?\])\s*```/);
      if (!jsonMatch) throw new Error("No JSON content found");

      let messages = JSON.parse(jsonMatch[1]);
      if (!Array.isArray(messages)) messages = [messages];
      return messages;
    } catch (error) {
      console.error("Error parsing messages:", error);
      return [{
        text: "I'm having trouble understanding that.",
        facialExpression: "default",
        animation: "Talking_1",
      }];
    }
  };

  app.get("/", (req, res) => {
    res.send("Virtual Teacher Backend with Azure Lip Sync");
  });

  app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;
    const gender = req.body.gender;

    if (!userMessage) {
      // Default intro messages
      return res.send({
        messages: [
          {
            text: "Hey there! I'm your 3D AI buddy. Wanna chat?",
            audio: await audioFileToBase64("audios/intro_0.wav"),
            lipsync: await readJsonTranscript("audios/intro_0.json"),
            facialExpression: "smile",
            animation: "Talking_1",
          }
        ]
      });
    }

    try {
      const prompt = `
      You are a virtual teacher. 
      Respond to the following message: "${userMessage}"
      
      Provide your response as a JSON array with the following structure:
      [
        {
          "text": "Your response text",
          "facialExpression": "smile/sad/angry/surprised/funnyFace/neutral",
          "animation": 'Asking', 'Concluding', 'Dissapointed', 'Explaining', 'Idle', 'QuickFormalBow', 'SoftSpeaking', 'Talking', 'ThumbsUp'
        }
      ]

      Only use the specified facial expressions and animations without emojis.
      Dont give too long answers, be concise and to the point.
      Maximum 3 messages in the array.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const messages = parseResponseMessages(response.text);
      const processedMessages = [];

      for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        const fileName = `audios/message_${i}.mp3`;

        const lipsyncData = await generateVisemesAzure(msg.text, fileName, gender);

        msg.audio = await audioFileToBase64(fileName);
        msg.lipsync = lipsyncData;

        processedMessages.push(msg);
      }

      res.send({ messages: processedMessages });
    } catch (err) {
      console.error("Chat error:", err);
      res.status(500).send({
        messages: [{
          text: "Sorry, I'm having trouble responding.",
          facialExpression: "neutral",
          animation: "Idle",
        }]
      });
    }
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  return app;
};

const app = setupVirtualFriendApp();
export default app;
