"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Invalid email or password");
        } else {
            router.push("/dashboard");
        }
    };
    return (
        <div style={{ 
            display: 'flex', 
            minHeight: '100vh', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: '#f0f4f8' 
        }}>
            <div style={{ 
                backgroundColor: '#ffffff', 
                padding: '2rem', 
                borderRadius: '12px', 
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', 
                width: '100%', 
                maxWidth: '400px',
                fontFamily: 'Andreas Larson, sans-serif'
            }}>
                <h1 style={{ 
                    fontSize: '1.8rem', 
                    fontWeight: 'bold', 
                    textAlign: 'center', 
                    marginBottom: '1.5rem', 
                    color: '#1E3A8A' 
                }}>
                    Login
                </h1>
    
                {error && (
                    <p style={{ 
                        color: '#EF4444', 
                        textAlign: 'center', 
                        marginBottom: '1rem' 
                    }}>{error}</p>
                )}
    
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ 
                                width: '100%', 
                                padding: '0.5rem', 
                                border: '1px solid #D1D5DB', 
                                borderRadius: '6px' 
                            }}
                        />
                    </div>
    
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ 
                                width: '100%', 
                                padding: '0.5rem', 
                                border: '1px solid #D1D5DB', 
                                borderRadius: '6px' 
                            }}
                        />
                    </div>
    
                    <button
                        type="submit"
                        style={{ 
                            width: '100%', 
                            backgroundColor: '#1E3A8A', 
                            color: '#ffffff', 
                            padding: '0.75rem', 
                            borderRadius: '6px', 
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#1E40AF'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#1E3A8A'}
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );}