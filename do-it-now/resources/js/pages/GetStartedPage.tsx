'use client';

import { CheckCircle, ChevronRight, Clock, List, Star } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Define interface for slide object
interface Slide {
    title: string;
    description: string;
    icon: React.JSX.Element;
}

export default function GetStartedPage(): React.JSX.Element {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const slides: Slide[] = [
        {
            title: 'Selamat Datang di Do It Now',
            description: 'Aplikasi pengelola tugas yang membantu Anda tetap produktif dan terorganisir.',
            icon: <List className="h-16 w-16 text-teal-600" />,
        },
        {
            title: 'Kelola Tugas dengan Mudah',
            description: 'Buat, edit, dan selesaikan tugas Anda dengan antarmuka yang sederhana dan intuitif.',
            icon: <CheckCircle className="h-16 w-16 text-teal-600" />,
        },
        {
            title: 'Tetap Tepat Waktu',
            description: 'Dapatkan pengingat untuk tugas yang mendekati tenggat waktu agar Anda tidak melewatkan hal penting.',
            icon: <Clock className="h-16 w-16 text-teal-600" />,
        },
        {
            title: 'Mulai Sekarang',
            description: 'Siap untuk menjadi lebih produktif? Daftar atau masuk untuk mulai menggunakan Do It Now.',
            icon: <Star className="h-16 w-16 text-teal-600" />,
        },
    ];

    const nextSlide = (): void => {
        if (isAnimating) return;

        if (currentSlide < slides.length - 1) {
            setDirection('next');
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentSlide(currentSlide + 1);
                setTimeout(() => {
                    setIsAnimating(false);
                }, 500);
            }, 200);
        } else {
            navigate('/login');
        }
    };

    const prevSlide = (): void => {
        if (isAnimating || currentSlide === 0) return;

        setDirection('prev');
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentSlide(currentSlide - 1);
            setTimeout(() => {
                setIsAnimating(false);
            }, 500);
        }, 200);
    };

    const goToLogin = (): void => {
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-teal-100 to-teal-50">
            {/* Header */}
            <header className="flex items-center justify-between p-4">
                <img src="/do-it-now-logo.png" className="w-48" />
                <button className="cursor-pointer rounded px-4 py-2 text-teal-700 transition-colors hover:bg-teal-50" onClick={goToLogin}>
                    Lewati
                </button>
            </header>

            {/* Main Content */}
            <main className="flex flex-1 flex-col items-center justify-center p-4">
                <div className="mb-8 flex w-full justify-center">
                    <div className="flex space-x-3">
                        {slides.map((_, index) => (
                            <div
                                key={index}
                                className={`h-2 w-2 rounded-full transition-all duration-500 ${
                                    index === currentSlide ? 'w-6 bg-teal-600' : 'bg-teal-200 hover:bg-teal-300'
                                }`}
                                onClick={() => {
                                    if (!isAnimating && index !== currentSlide) {
                                        setDirection(index > currentSlide ? 'next' : 'prev');
                                        setIsAnimating(true);
                                        setTimeout(() => {
                                            setCurrentSlide(index);
                                            setTimeout(() => {
                                                setIsAnimating(false);
                                            }, 500);
                                        }, 200);
                                    }
                                }}
                                style={{ cursor: 'pointer' }}
                            />
                        ))}
                    </div>
                </div>

                <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-lg border-none bg-white/80 shadow-lg backdrop-blur-sm">
                    <div className="flex flex-col items-center p-8 text-center">
                        <div
                            className={`mb-6 transform rounded-full bg-teal-100 p-4 transition-all duration-500 ${isAnimating ? (direction === 'next' ? 'scale-0 opacity-0' : '-translate-x-full opacity-0') : 'scale-100 opacity-100'}`}
                        >
                            {slides[currentSlide].icon}
                        </div>
                        <h2
                            className={`mb-4 text-2xl font-bold text-teal-800 transition-all duration-500 ${isAnimating ? (direction === 'next' ? 'translate-y-10 opacity-0' : '-translate-x-full opacity-0') : 'translate-y-0 opacity-100'}`}
                        >
                            {slides[currentSlide].title}
                        </h2>
                        <p
                            className={`mb-8 text-gray-600 transition-all delay-100 duration-500 ${isAnimating ? (direction === 'next' ? 'translate-y-10 opacity-0' : '-translate-x-full opacity-0') : 'translate-y-0 opacity-100'}`}
                        >
                            {slides[currentSlide].description}
                        </p>
                        <div className="flex w-full space-x-4">
                            {currentSlide > 0 && (
                                <button
                                    className="flex w-1/4 cursor-pointer items-center justify-center rounded-md bg-teal-100 px-4 py-3 font-medium text-teal-700 transition-colors hover:bg-teal-200"
                                    onClick={prevSlide}
                                    disabled={isAnimating}
                                >
                                    Kembali
                                </button>
                            )}
                            <button
                                className={`flex items-center justify-center rounded-md bg-teal-600 px-4 py-3 font-medium text-white transition-all duration-300 hover:bg-teal-700 ${currentSlide > 0 ? 'w-3/4' : 'w-full'} ${isAnimating ? 'opacity-70' : 'opacity-100'} cursor-pointer`}
                                onClick={nextSlide}
                                disabled={isAnimating}
                            >
                                {currentSlide < slides.length - 1 ? 'Lanjutkan' : 'Mulai Sekarang'}
                                <ChevronRight className={`ml-2 h-4 w-4 transition-transform duration-300 ${isAnimating ? 'translate-x-2' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-muted-foreground p-4 text-center text-sm">
                <p>© 2025 Do It Now. Semua hak dilindungi.</p>
            </footer>
        </div>
    );
}
