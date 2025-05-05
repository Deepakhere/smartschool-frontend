import { useEffect, useState } from 'react';
import { parentApi } from '../../../services/api';
import { INotice } from '../../../types/api';

const ParentNotices = () => {
  const [notices, setNotices] = useState<INotice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await parentApi.notices.getAll();
        setNotices(response.data);
      } catch {
        // TODO: Add error handling
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Notices</h1>
      <div className="space-y-4">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="bg-white p-4 rounded-lg shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">{notice.title}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(notice.date).toLocaleDateString()}
                </p>
              </div>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {notice.type}
              </span>
            </div>
            <p className="mt-2 text-gray-700">{notice.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParentNotices; 