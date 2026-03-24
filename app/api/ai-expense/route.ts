import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Allow up to 30 seconds for AI processing
export const maxDuration = 30;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: Request) {
  try {
    const { text } = await req.json()
    if (!text) return NextResponse.json({ error: 'Matn kiritilmadi' }, { status: 400 })

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    })

    const prompt = `Siz aqlli moliyaviy yordamchisiz. Quyidagi o'zbek (yoki ingliz) tilidagi matnni o'qing va qancha pul (amount) qaysi turkumga (category) sarflanganini tahlil qiling. 
Agar valyuta aytilmasa, default olib "summa" deb hisoblang. Masalan "20 ming" = 20000.
Faqatgina quyidagi JSON strukturani javob qilib qaytaring:
{
  "amount": ruxsat etilgan son (masalan: 20000),
  "category": qat'iy ravishda quyidagi qiymatlardan biri: ["food", "transport", "shopping", "entertainment", "bills", "health", "education", "other"],
  "title": matndan olingan qisqacha mazmun (masalan: "Tushlik" yoki "Yandex Go")
}
Matn: "${text}"`

    const result = await model.generateContent(prompt)
    const response = await result.response;
    let jsonString = response.text()
    
    // Tozalash (agar AI markdown backticks qoshib yuborgan bolsa)
    jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const data = JSON.parse(jsonString)
    
    // Validation
    if (!data.amount || !data.category || !data.title) {
      throw new Error("Invalid schema from AI")
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('AI Expense Parse Error:', error)
    return NextResponse.json({ error: 'Matnni tahlil qilishda xatolik yuz berdi. Iltimos qayta urinib ko\'ring.' }, { status: 500 })
  }
}
