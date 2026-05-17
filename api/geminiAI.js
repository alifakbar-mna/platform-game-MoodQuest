export default async function handler(req, res) {

    if(req.method !== "POST"){

        return res.status(405).json({
            reply: "Method tidak diizinkan"
        });
    }

    try{

        const { message } = req.body;

        const apiKey = process.env.GEMINI_API_KEY;

        if(!apiKey){

            return res.status(500).json({
                reply: "API KEY tidak ditemukan"
            });
        }

        const response = await fetch(

            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,

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
                                    Jawab singkat, santai, ramah.
                                    User: ${message}`
                                }
                            ]
                        }
                    ]

                })
            }
        );

        const data = await response.json();

        console.log(data);

        if(data.error){

            return res.status(500).json({
                reply: data.error.message
            });
        }

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