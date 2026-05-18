export default async function handler(req, res) {

    if(req.method !== "POST"){

        return res.status(405).json({
            reply: "Method tidak diizinkan"
        });
    }

    try{

        const { message } = req.body;

        const apiKey = process.env.GEMINI_API_KEY;

        const response = await fetch(

            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,

            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    contents: [
                        {
                            parts: [
                                {
                                    text: `
                                        Kamu adalah Mooru, AI companion yang hangat, suportif, dan nyaman diajak cerita.

                                        Tugasmu:
                                        - Validasi perasaan user dengan empati.
                                        - Gunakan kata-kata positif, menenangkan, dan membangun.
                                        - Jika user sedang memiliki masalah, berikan saran sederhana yang realistis dan suportif.
                                        - Jangan pernah memberikan diagnosis medis atau mengklaim kondisi mental tertentu.
                                        - Jangan terdengar seperti robot atau terlalu formal.
                                        - Jawaban singkat, natural, hangat, dan seperti teman dekat.

                                        Aturan bahasa:
                                        - Jika user menggunakan bahasa Indonesia, balas dalam bahasa Indonesia.
                                        - Jika user menggunakan bahasa Inggris, balas dalam bahasa Inggris.
                                        - Jika user menggunakan campuran Indonesia dan Inggris, balas dengan gaya campuran yang natural dan relate dengan cara bicara user.

                                        Gaya bicara:
                                        - Friendly
                                        - Soft
                                        - Santai
                                        - Tidak menghakimi
                                        - Kadang boleh memakai emoji lembut seperlunya seperti 🌿✨🤍

                                        User: ${message}
                                        `
                                }
                            ]
                        }
                    ]

                })
            }
        );

        const data = await response.json();

        console.log(data);

        const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text
        || "MoodAI bingung 😭";

        return res.status(200).json({
            reply
        });

    }
    catch(error){

        console.log(error);

        return res.status(500).json({
            reply: "Server error 😢"
        });
    }
}