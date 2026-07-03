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

  // Retrieve token from Vercel environment variables
  const token = process.env.GITHUB_TOKEN;
  const headers = {
    'User-Agent': 'Mozilla/5.0'
  };
  
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  try {
    // If token exists, fetch all public & private repos of the authenticated user.
    // If not, fetch public repos of aniket532015.
    const url = token 
      ? 'https://api.github.com/user/repos?visibility=all&sort=updated&per_page=100' 
      : 'https://api.github.com/users/aniket532015/repos?sort=updated&per_page=100';

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      const errMsg = await response.text();
      throw new Error(`GitHub API returned status ${response.status}: ${errMsg}`);
    }

    const data = await response.json();
    
    // Strip sensitive GitHub data, return only necessary presentation fields
    const formattedRepos = data.map(repo => ({
      name: repo.name,
      private: repo.private,
      description: repo.description || '',
      url: repo.html_url
    }));

    res.status(200).json(formattedRepos);
  } catch (error) {
    console.error('Error in get-repos endpoint:', error);
    res.status(500).json({ message: 'Failed to fetch repositories', error: error.message });
  }
}
