"use client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
    const [pendingCompanies, setPendingCompanies] = useState([]);
    const [jobSeekers, setJobSeekers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("/api/admin");
            const data = await res.json();
            setPendingCompanies(data.pendingCompanies || []);
            setJobSeekers(data.jobSeekers || []);
        };
        fetchData();
    }, []);

    const handleApproval = async (id, approved, type) => {
        const res = await fetch("/api/admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: approved ? "approve" : "reject", // ✅ Uses true/false logic
                userId: id, // ✅ Uses dynamic user ID
            }),
        });
    
        if (res.ok) {
            if (type === "company") {
                setPendingCompanies(pendingCompanies.filter((c) => c._id !== id));
            } else if (type === "jobSeeker") {
                setJobSeekers(jobSeekers.filter((s) => s._id !== id));
            }
        } else {
            console.error("Error in action:", await res.json());
        }
    };
    
    return (
        <div style={{
            padding: '2rem',
            minHeight: '100vh',
            backgroundColor: '#1E3A8A', 
            color: '#ffffff',
            fontFamily: 'Andreas Larson, sans-serif'
        }}>
            <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                textAlign: 'center'
            }}>
                Admin Dashboard
            </h1>
    
            {/* Pending Companies */}
            <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginTop: '1.5rem'
            }}>
                Pending Companies
            </h2>
            {pendingCompanies.length > 0 ? (
                pendingCompanies.map((company) => (
                    <div key={company._id} style={{
                        backgroundColor: '#3B82F6',
                        padding: '1rem',
                        margin: '0.5rem 0',
                        borderRadius: '8px'
                    }}>
                        <p>{company.name}</p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                                style={{
                                    backgroundColor: '#22C55E',
                                    color: '#ffffff',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleApproval(company._id, true, "company")}
                            >
                                Approve
                            </button>
    
                            <button 
                                style={{
                                    backgroundColor: '#DC2626',
                                    color: '#ffffff',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleApproval(company._id, false, "company")}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p style={{ color: '#D1D5DB' }}>No pending companies.</p>
            )}
    
            {/* Job Seekers */}
            <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginTop: '1.5rem'
            }}>
                Job Seekers
            </h2>
            {jobSeekers.length > 0 ? (
                jobSeekers.map((seeker) => (
                    <div key={seeker._id} style={{
                        backgroundColor: '#3B82F6',
                        padding: '1rem',
                        margin: '0.5rem 0',
                        borderRadius: '8px'
                    }}>
                        <p>{seeker.name}</p>
                        <button 
                            style={{
                                backgroundColor: '#DC2626',
                                color: '#ffffff',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleApproval(seeker._id, false, "jobSeeker")}
                        >
                            Block
                        </button>
                    </div>
                ))
            ) : (
                <p style={{ color: '#D1D5DB' }}>No active job seekers.</p>
            )}
        </div>
    );
    
}
