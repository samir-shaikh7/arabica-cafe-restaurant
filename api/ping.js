export default async function handler(req, res) {
    try {
        const response = await fetch(
            `${process.env.VITE_SUPABASE_URL}/rest/v1/settings_site2?select=*&limit=1`,
            {
                method: "GET",
                headers: {
                    "apikey": process.env.VITE_SUPABASE_ANON_KEY,
                    "Authorization": `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
                    "Content-Type": "application/json"
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Supabase error ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        console.log("Ping successful. DB response:", data);

        return res.status(200).json({
            status: "success",
            message: "Database activity generated successfully",
            timestamp: new Date().toISOString(),
            records_found: data.length
        });

    } catch (err) {
        console.error("Cron Ping Error:", err);

        return res.status(500).json({
            status: "error",
            error: err.message,
            timestamp: new Date().toISOString()
        });
    }
}
