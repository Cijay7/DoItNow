import { useEffect, useState } from 'react';

export const EnhancedLoadingAnimation = ({ fullScreen = false, message = 'Memuat' }) => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => {
                if (prev.length >= 3) return '';
                return prev + '.';
            });
        }, 500);

        return () => clearInterval(interval);
    }, []);

    const containerClass = fullScreen
        ? 'fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-teal-100 to-teal-50'
        : 'flex min-h-40 w-full items-center justify-center bg-gradient-to-br from-teal-100 to-teal-50 rounded-lg shadow-md';

    return (
        <div className={containerClass}>
            <div className="text-center">
                <div className="relative mx-auto h-16 w-16">
                    {/* Outer pulse ring */}
                    <div className="absolute inset-0 animate-ping rounded-full bg-teal-400 opacity-30"></div>

                    {/* Middle pulse ring */}
                    <div className="absolute inset-2 animate-ping rounded-full bg-teal-500 opacity-40" style={{ animationDelay: '200ms' }}></div>

                    {/* Inner spinner */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
                    </div>

                    {/* App icon in center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-6 w-6 rounded-full bg-teal-600"></div>
                    </div>
                </div>

                <p className="mt-4 text-lg font-medium text-teal-700">
                    {message}
                    {dots}
                </p>
                <p className="mt-1 text-sm text-teal-600">Do It Now</p>
            </div>
        </div>
    );
};

export default EnhancedLoadingAnimation;
