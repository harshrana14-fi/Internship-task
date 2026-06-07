'use client';

import Link from 'next/link';

export default function Home() {
	return (
		<div className="flex items-center justify-between gap-4 mb-8">
			<Link
				href="/certifications"
				className="inline-flex items-center rounded-lg px-4 py-2 text-3xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
			>
				Certifications
			</Link>
		</div>
	);
}
