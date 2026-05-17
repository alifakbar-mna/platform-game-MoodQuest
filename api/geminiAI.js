export default async function handler(req, res) {

    // CEK METHOD
    if (req.method !== "POST") {

        return res.status(405).json({
            error: "Method tidak diizinkan"
        });
    }

    try {

        // AMBIL MESSAGE
        const { message } = req.body;

        // CEK API KEY
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {

            return res.status(500).json({
                error: "API KEY tidak terbaca dari Vercel"
            });
        }

        // REQUEST KE GEMINI
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
                                    text:
                                    `Kamu adalah MoodAI.
                                    Jawab santai dan singkat.
                                    User: ${message}`
                                }
                            ]
                        }
                    ]
                })
            }
        );

        // AMBIL DATA
        const data = await response.json();

        console.log(data);

        // CEK ERROR GEMINI
        if (data.error) {

            return res.status(500).json({
                error: data.error.message
            });
        }

        // AMBIL TEXT
        const reply =
            data.candidates?.[0]?.content?.parts?.[0]?.text
            || "Tidak ada balasan";

        // RETURN
        return res.status(200).json({
            reply
        });

    }
    catch (error) {

        console.log(error);

        return res.status(500).json({
            error: "Server error"
        });
    }
}