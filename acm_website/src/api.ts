const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export async function deleteUser(uid: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/deleteUser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ uid })
  });

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
}

