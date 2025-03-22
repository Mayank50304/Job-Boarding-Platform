"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function JobSeekerDashboard() {
    const { data: session } = useSession();
    const [jobs, setJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch("/api/job-seeker");
                const data = await res.json();
                setJobs(data.jobs || []);
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
            }
        };
        fetchJobs();
    }, []);

    const handleApply = async (jobId) => {
        if (!session?.user?.id) {
            alert("Please log in to apply.");
            return;
        }

        try {
            const res = await fetch("/api/job/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jobId,
                    userId: session.user.id,
                    resumeLink: "https://example.com/resume.pdf",
                }),
            });

            if (res.ok) {
                setAppliedJobs([...appliedJobs, jobId]); // Move to applied section
                alert("Application submitted successfully!");
            } else {
                alert("Failed to submit application.");
            }
        } catch (error) {
            console.error("Error applying for job:", error);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#3B82F6',
            padding: '2rem',
            color: 'white'
        }}>
            <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '1.5rem'
            }}>
                Job Seeker Dashboard
            </h1>

            {/* Available Jobs */}
            {jobs.length > 0 && (
                <div style={{
                    marginBottom: '2rem'
                }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
                        Available Jobs
                    </h2>

                    <div style={{
                        display: 'grid',
                        gap: '1rem',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
                    }}>
                        {jobs.map((job) => (
                            <div
                                key={job._id}
                                style={{
                                    backgroundColor: '#2563EB',
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                                }}
                            >
                                <h2 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    marginBottom: '0.5rem'
                                }}>
                                    {job.title}
                                </h2>

                                <p style={{
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    marginBottom: '1rem'
                                }}>
                                    {job.description}
                                </p>
                                <p style={{
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    marginBottom: '1rem'
                                }}>
                                    {job.salary}
                                </p>
                                <p style={{
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    marginBottom: '1rem'
                                }}>
                                    {job.location}
                                </p>

                                {appliedJobs.includes(job._id) ? (
                                    <button
                                        style={{
                                            backgroundColor: '#22C55E',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            width: '100%',
                                            border: 'none',
                                            cursor: 'not-allowed'
                                        }}
                                        disabled
                                    >
                                        ✅ Applied
                                    </button>
                                ) : (
                                    <button
                                        style={{
                                            backgroundColor: 'white',
                                            color: '#3B82F6',
                                            fontWeight: 'bold',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            width: '100%',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleApply(job._id)}
                                    >
                                        ➡️ Apply Now
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Applied Jobs */}
           

            {/* No Jobs Available */}
            {jobs.length === 0 && appliedJobs.length === 0 && (
                <p style={{
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginTop: '2rem'
                }}>
                    No jobs available at the moment.
                </p>
            )}
        </div>
    );
}
