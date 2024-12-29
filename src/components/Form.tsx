import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function RollNoForm() {
  const [rollNo, setRollNo] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/user/update', { rollNo });
      router.push('/dashboard'); // Redirect to the dashboard or another page
    } catch (error) {
      console.error('Error updating roll number:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Roll Number:
        <input
          type="text"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          required
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}