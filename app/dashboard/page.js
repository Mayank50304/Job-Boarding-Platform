"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status]);

    if (status === "loading") return <p>Loading...</p>;

    const { role } = session?.user || {};
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            padding: '2rem',
            backgroundColor: '#1E3A8A', 
            color: '#ffffff',
            fontFamily: 'Andreas Larson, sans-serif'
        }}>
            <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold'
            }}>
                Welcome to the Dashboard
            </h1>
    
            <p style={{ color: '#D1D5DB' }}>
                Select your profile to proceed:
            </p>
    
            <div style={{
                display: 'flex',
                gap: '1rem'
            }}>
                {role === "admin" && (
                    <button
                        style={{
                            backgroundColor: '#2563EB',
                            color: '#ffffff',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#1E40AF'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#2563EB'}
                        onClick={() => router.push("/dashboard/admin")}
                    >
                        Admin Dashboard
                    </button>
                )}
    
                {role === "company" && (
                    <button
                        style={{
                            backgroundColor: '#10B981',
                            color: '#ffffff',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#10B981'}
                        onClick={() => router.push("/dashboard/company")}
                    >
                        Company Dashboard
                    </button>
                )}
    
                {role === "jobseeker" && (
                    <button
                        style={{
                            backgroundColor: '#FBBF24',
                            color: '#1E3A8A',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#F59E0B'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#FBBF24'}
                        onClick={() => router.push("/dashboard/job-seeker")}
                    >
                        Job Seeker Dashboard
                    </button>
                )}
            </div>
        </div>
    );
    
}
