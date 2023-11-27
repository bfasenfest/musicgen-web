import axios from "axios";

export default async function handler(req, res) {
  const API_URL = process.env.VAST_SERVER_URL;

  console.log(req.body);
  try {
    const { prompt, length, user } = req.body;

    if (!user.id) {
      res.status(401).send("Unauthorized");
    }

    if (!API_URL) {
      res.status(500).send("Api not configured");
    }

    if (!prompt) {
      res.status(400).send("No Prompt");
    }

    console.log("here");
    const response = await axios.get(
      `${API_URL}/?prompt=${prompt}&length=${length}`,
      {
        headers: {
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );
    console.log(response);
    res.statusCode = 200;
    res.end(JSON.stringify(response.data));
  } catch (error) {
    console.error("[ERROR]", error);
    res.status(500).send("Internal Error");
  }
}
