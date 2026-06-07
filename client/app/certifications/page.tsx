//client/app/certifications/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Certification {
  id: number;
  [key: string]: any;
}
function Certification() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/certifications');
        const result = await response.json();
        
        if (result.success) {
          setCertifications(result.data);
        } else {
          setError(result.error || 'Failed to fetch certifications');
        }
      } catch (err) {
        setError('Error connecting to server. Make sure the backend is running on port 4000.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <main className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-black dark:text-white">
          Certifications
        </h1>

        {loading && (
          <div className="text-center py-12">
            <p className="text-lg text-zinc-600 dark:text-zinc-400">Loading certifications...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {!loading && !error && certifications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-zinc-600 dark:text-zinc-400">No certifications found.</p>
          </div>
        )}

        {!loading && !error && certifications.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              Found {certifications.length} certification{certifications.length !== 1 ? 's' : ''}
            </p>
            
            <div className="grid gap-4">
              {certifications.map((cert, index) => (
                <div
                  key={`cert-${cert.id}-${index}`}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-[180px_1fr]">
                    {/* Image Section */}
                    {cert.certification_image_path && (
                      <div className="relative md:h-full h-40 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center p-3">
                        <div className="relative w-full h-full max-h-40 md:max-h-40">
                          <Image
                            src={cert.certification_image_path}
                            alt={cert.certification_name || 'Certification'}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 180px"
                            priority={index < 4}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Content Section */}
                    <div className="p-4 md:p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(cert).map(([key, value]) => {
                          // Skip showing the image path as text since we're displaying it
                          if (key === 'certification_image_path') return null;
                          
                          return (
                            <div key={`${cert.id}-${key}`} className="text-sm">
                              <span className="font-medium text-zinc-700 dark:text-zinc-300 capitalize">
                                {key.replace(/_/g, ' ')}:
                              </span>{' '}
                              <span className="text-zinc-900 dark:text-zinc-100 wrap-break-word">
                                {value !== null ? String(value) : 'N/A'}
                              </span>
                            </div>
                          );
                        }).filter(Boolean)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Certification