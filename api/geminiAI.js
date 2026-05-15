export default async function handler(req, res) {

    // Hanya izinkan POST
    if(req.method !== "POST"){

        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try{

        const { message } = req.body;

        // API KEY DARI VERCEL ENV
        const API_KEY = process.env.GEMINI_API_KEY;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    contents: [{

                        parts: [{

                            text: `
                            Kamu adalah MoodAI, asisten empati di game MoodQuest.

                            Jawab user dengan:
                            - hangat
                            - santai
                            - pendek
                            - maksimal 2 kalimat
                            - bahasa Indonesia

                            User: ${message}
                            `
                        }]
                    }]
                })
            }
        );

        const data = await response.json();

        // DEBUG
        console.log(data);

        if(
            data.candidates &&
            data.candidates[0] &&
            data.candidates[0].content
        ){

            const reply =
                data.candidates[0].content.parts[0].text;

            return res.status(200).json({
                reply
            });
        }

        return res.status(500).json({
            reply: "MoodAI lagi tidur 😴"
        });

    }
    catch(error){

        console.error(error);

        return res.status(500).json({
            reply: "Server error 😢"
        });
    }
}