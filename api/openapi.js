import { readFileSync } from 'fs';
import { join } from 'path';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  try {
    const specPath = join(process.cwd(), 'api', 'openapi.json');
    const fileContent = readFileSync(specPath, 'utf8');
    const spec = JSON.parse(fileContent);

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).json(spec);
  } catch (error) {
    console.error('Error serving openapi.json:', error);
    res.status(500).json({ message: 'Failed to load OpenAPI specification', error: error.message });
  }
}
