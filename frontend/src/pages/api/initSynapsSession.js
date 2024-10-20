// pages/api/initSynapsSession.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const response = await fetch('https://api.synaps.io/v4/session/init', {
      method: 'POST',
      headers: {
        'Api-Key': process.env.SYNAPSE_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        alias: 'notarize',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error initializing session:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}