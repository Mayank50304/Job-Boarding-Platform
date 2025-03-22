"use client";

import Link from "next/link";

export default function HomePage() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'url("/images/job-board-bg.png")', // Add your image path here
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            color: '#ffffff',
            textAlign: 'center',
            padding: '2rem',
            position: 'relative'
        }}>
            {/* Overlay for better text visibility */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(30, 58, 138, 0.85)' // Deep blue overlay for contrast
            }} />
    
            {/* Content */}
            <div style={{
                position: 'relative',
                zIndex: 1,
                maxWidth: '500px'
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem'
                }}>
                    Welcome to the ZITHARA Job Boarding Platform
                </h1>
    
                <p style={{
                    fontSize: '1rem',
                    marginBottom: '2rem'
                }}>
                    Whether you're seeking your next career move or looking to build a team of talented professionals, our platform connects the right people with the right opportunities.
                </p>
    
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link href="/login">
                        <button style={{
                            backgroundColor: '#ffffff',
                            color: '#1E3A8A',
                            padding: '0.75rem 2rem',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#E0E7FF'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}>
                            Login
                        </button>
                    </Link>
    
                    <Link href="/register">
                        <button style={{
                            backgroundColor: '#16A34A',
                            color: '#ffffff',
                            padding: '0.75rem 2rem',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#15803D'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#16A34A'}>
                            Register
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
    
}
