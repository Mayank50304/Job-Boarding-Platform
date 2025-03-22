"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';


export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "jobseeker", // Default role
    });
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const router = useRouter();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (res.ok) {
            alert("✅ Registration successful!");
            router.push('/login'); // Redirect to login page
        } else {
            alert(`❌ Error: ${data.error}`);
        }
    };

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f4f8',
            fontFamily: 'Andreas Larson, sans-serif'
        }}>
            <form 
                onSubmit={handleSubmit} 
                style={{ 
                    display: 'grid', 
                    gap: '1rem', 
                    maxWidth: '400px', 
                    width: '100%', 
                    backgroundColor: '#ffffff',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center'
                }}
            >
                <h1 style={{
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    color: '#1E3A8A',
                    marginBottom: '1.5rem'
                }}>
                    Register
                </h1>
    
                <input 
                    name="name" 
                    onChange={handleChange} 
                    placeholder="Name" 
                    required 
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px'
                    }}
                />
                <input 
                    name="email" 
                    onChange={handleChange} 
                    placeholder="Email" 
                    required 
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px'
                    }}
                />
                <input 
                    name="password" 
                    type="password" 
                    onChange={handleChange} 
                    placeholder="Password" 
                    required 
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px'
                    }}
                />
                <select 
                    name="role" 
                    onChange={handleChange} 
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px'
                    }}
                >
                    <option value="jobseeker">Job Seeker</option>
                    <option value="company">Company</option>
                    
                </select>
    
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
                    Register
                </button>
                <p style={{
    marginTop: '1rem',
    fontSize: '0.875rem',
    color: '#64748B',
    textAlign: 'center'
}}>
    Note: Company accounts require admin approval before login access.
</p>

            </form>
        </div>
    );
    
}
