export default async function handler(req, res) {
    try {
        const response = await fetch(
            `${process.env.VITE_SUPABASE_URL}/rest/v1/`,
            {
                headers: {
                    apikey: process.env.VITE_SUPABASE_ANON_KEY,
                },
            }
        );

        return res.status(200).json({
            status: "ping success",
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
}