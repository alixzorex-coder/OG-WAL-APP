import { GoogleGenAI, Type } from "@google/genai";
import { PaymentVerificationResult } from "../types";

// Helper to get AI instance safely
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Verifies a payment screenshot using Gemini Vision capabilities.
 * It checks for keywords like 'JazzCash', 'Easypaisa', 'Sent', 'Successful' and the amount.
 */
export const verifyPaymentScreenshot = async (
  base64Image: string,
  expectedAmount: number
): Promise<PaymentVerificationResult> => {
  const ai = getAIClient();
  
  if (!ai) {
    // Fallback for demo purposes if no key is present, to allow UI testing
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                success: true,
                message: "Demo Mode: Verified successfully (No API Key)",
                amount: expectedAmount
            });
        }, 2000);
    });
  }

  try {
    const prompt = `
      Analyze this payment receipt screenshot commonly used in Pakistan (JazzCash or Easypaisa).
      I am expecting a payment of ${expectedAmount} PKR.
      
      Please extract:
      1. The amount paid.
      2. The service provider (JazzCash or Easypaisa).
      3. Whether the transaction looks successful.
      
      Return JSON with this schema:
      {
        "verified": boolean,
        "detectedAmount": number,
        "provider": string,
        "reason": string
      }

      Strictly return valid JSON. If the image is not a receipt or unclear, set verified to false.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming jpeg/png for simplicity
              data: base64Image
            }
          }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                verified: { type: Type.BOOLEAN },
                detectedAmount: { type: Type.NUMBER },
                provider: { type: Type.STRING },
                reason: { type: Type.STRING }
            }
        }
      }
    });

    if (!response.text) {
        throw new Error("No response text from AI");
    }

    const result = JSON.parse(response.text);

    if (result.verified && result.detectedAmount >= expectedAmount) {
      return {
        success: true,
        amount: result.detectedAmount,
        method: result.provider,
        message: "Payment verified successfully!"
      };
    } else {
      return {
        success: false,
        message: result.reason || `Amount mismatch. Detected ${result.detectedAmount}, expected ${expectedAmount}.`
      };
    }

  } catch (error) {
    console.error("Gemini Verification Error:", error);
    return {
      success: false,
      message: "Could not analyze screenshot. Please try again or contact support."
    };
  }
};

/**
 * Gets wallpaper recommendations based on user preferences using Gemini.
 */
export const getAIRecommendations = async (
  likedTags: string[]
): Promise<string[]> => {
    // This is a mock implementation of logic that would typically ask Gemini for 
    // suggested keywords based on user history to filter the DB.
    // For this frontend-only demo, we'll return a static list or random list if API fails.
    return ['Nature', 'Cyberpunk', 'Neon'];
};
