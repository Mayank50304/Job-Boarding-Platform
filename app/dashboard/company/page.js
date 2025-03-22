"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function CompanyDashboard() {
    const { data: session } = useSession();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [salary, setSalary] = useState("");
    const [location, setLocation] = useState("");
    const [jobs, setJobs] = useState([]);
    const [applicants, setApplicants] = useState([]);
    const [showApplicants, setShowApplicants] = useState(false); // Toggle for modal


    // Fetch posted jobs by this company
    useEffect(() => {
        if (!session?.user?.id) return; // Ensure session is loaded

        const fetchJobs = async () => {
            try {
                const response = await fetch(`/api/job?companyId=${session.user.id}`);
                console.log("job ID");
                const data = await response.json();
                setJobs(Array.isArray(data.jobs) ? data.jobs : []);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };
        fetchJobs();
    }, [session]); // Dependency added for session

    const handlePostJob = async () => {
        const response = await fetch("/api/job", {
            method: "POST",
            body: JSON.stringify({ title, description, salary, location }),
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();

        if (response.ok) {
            alert("✅ Job posted successfully!");
            setJobs([...jobs, data.job]); // Correctly adding new job to the list
        } else {
            alert(`❌ Error: ${data.error || "Failed to post job"}`);
        }
    };
    const handleDelete = async (jobId) => {
        try {
            console.log("🟡 Attempting to delete Job ID:", jobId);
    
            const response = await fetch(`/api/job?jobId=${encodeURIComponent(jobId)}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });
    
            console.log("🔵 DELETE Response Status:", response.status);
    
            const data = await response.json();
            console.log("🟢 DELETE Response Data:", data);
    
            if (data.success) {
                setJobs((prevJobs) => prevJobs.filter(job => job._id !== jobId));
            } else {
                console.error("❌ Error deleting job:", data.error);
            }
        } catch (error) {
            console.error("❌ Error in handleDelete:", error);
        }
    };
    const handleViewApplicants = async (jobId) => {
        try {
            const response = await fetch(`/api/applicants?jobId=${jobId}`);
    
            if (!response.ok) {
                alert("❌ Failed to fetch applicants.");
                return;
            }
    
            const data = await response.json();
    
            if (!data.applicants.length) {
                alert("❌ No applicants found.");
                setApplicants([]);
                return;
            }
    
            setApplicants(data.applicants);  
            setShowApplicants(true);         
        } catch (error) {
            console.error("❌ Error in handleViewApplicants:", error);
            alert("❌ An error occurred.");
        }
    };
    const inputStyle = {
        border: '1px solid #BFDBFE',
        padding: '0.75rem',
        borderRadius: '8px',
        outline: 'none',
        backgroundColor: '#1E40AF',
        color: '#ffffff'
    };
    
    const greenButton = {
        backgroundColor: '#10B981',
        color: '#ffffff',
        padding: '0.75rem',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        transition: 'background 0.3s ease'
    };
    
    const redButton = {
        backgroundColor: '#EF4444',
        color: '#ffffff',
        padding: '0.75rem',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        transition: 'background 0.3s ease'
    };
    
    const blueButton = {
        backgroundColor: '#2563EB',
        color: '#ffffff',
        padding: '0.75rem',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        transition: 'background 0.3s ease'
    };
    
    
    

   
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#1E3A8A',
                color: '#ffffff',
                padding: '2rem',
                fontFamily: 'Andreas Larson, sans-serif'
            }}>
                {/* Header */}
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginBottom: '1.5rem'
                }}>
                    Company Dashboard
                </h1>
        
                {/* Job Form */}
                <div style={{
                    backgroundColor: '#3B82F6',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        marginBottom: '1rem'
                    }}>
                        Post a Job
                    </h2>
        
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Job Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={inputStyle}
                        />
        
                        <textarea
                            placeholder="Job Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                            style={inputStyle}
                        />
        
                        <input
                            type="number"
                            placeholder="Salary"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            style={inputStyle}
                        />
        
                        <input
                            type="text"
                            placeholder="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            style={inputStyle}
                        />
        
                        <button
                            style={greenButton}
                            onClick={handlePostJob}
                        >
                            ➕ Post Job
                        </button>
                    </div>
                </div>
        
                {/* Posted Jobs Section */}
                <h2 style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem'
                }}>
                    Posted Jobs
                </h2>
        
                {jobs?.length === 0 ? (
                    <p style={{ color: '#D1D5DB' }}>No jobs available</p>
                ) : (
                    <div style={{
                        display: 'grid',
                        gap: '1rem',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
                    }}>
                        {jobs.map((job) => (
                            <div
                                key={job._id}
                                style={{
                                    backgroundColor: '#3B82F6',
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
                                }}
                            >
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{job.title}</h3>
                                <p>{job.description}</p>
                                <p><strong>📍 Location:</strong> {job.location}</p>
                                <p><strong>💰 Salary:</strong> ₹{job.salary}</p>
        
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button
                                        style={redButton}
                                        onClick={() => handleDelete(job._id)}
                                    >
                                        ❌ Delete Job
                                    </button>
        
                                    <button
                                        style={blueButton}
                                        onClick={() => handleViewApplicants(job._id)}
                                    >
                                        👀 View Applicants
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
        
                {/* Applicants Modal */}
                {showApplicants && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 999
                    }}>
                        <div style={{
                            backgroundColor: '#ffffff',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            width: '90%',
                            maxWidth: '500px',
                            color: '#1E3A8A'
                        }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                                👥 Applicants
                            </h2>
        
                            {applicants.map((app, index) => (
                                <div key={index} style={{ borderBottom: '1px solid #E5E7EB', padding: '0.5rem 0' }}>
                                    <p><strong>🧑 Name:</strong> {app.name}</p>
                                    <p><strong>📧 Email:</strong> {app.email}</p>
                                    <p>
                                        <strong>📄 Resume:</strong>
                                        <a
                                            href={app.resume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: '#3B82F6', textDecoration: 'underline', marginLeft: '4px' }}
                                        >
                                            View Resume
                                        </a>
                                    </p>
                                </div>
                            ))}
        
                            <button
                                style={redButton}
                                onClick={() => setShowApplicants(false)}
                            >
                                ❌ Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
        
}    