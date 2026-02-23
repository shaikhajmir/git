import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function CodeHeatmap({ data }) {
    if (!data || data.length === 0) {
        return <div style={{ color: 'var(--text-secondary)' }}>No file data available</div>;
    }

    // Calculate some benchmarks
    const maxComplexity = Math.max(...data.map(d => d.complexity), 1);
    const maxChanges = Math.max(...data.map(d => d.changes), 1);

    const getRiskLevel = (changes, complexity) => {
        // arbitrary thresholds to visually separate files
        const relChange = changes / maxChanges;
        const relComp = complexity / maxComplexity;

        // Both changed often and highly complex is High Risk
        if (relChange > 0.5 && relComp > 0.5) return 'high-risk';
        // Highly complex or highly changed is Medium risk
        if (relComp > 0.4 || relChange > 0.6) return 'med-risk';
        return 'low-risk';
    };

    return (
        <div className="file-list">
            <div className="file-item" style={{ background: 'transparent', border: 'none', padding: '0 1rem 0.5rem', color: 'var(--text-secondary)' }}>
                <span>File Name</span>
                <div className="file-stats">
                    <span style={{ width: '80px', textAlign: 'right' }}>Changes</span>
                    <span style={{ width: '80px', textAlign: 'right' }}>Complexity</span>
                    <span style={{ width: '20px' }}></span>
                </div>
            </div>

            {data.map((item, i) => {
                const riskClass = getRiskLevel(item.changes, item.complexity);
                return (
                    <div key={i} className={`file-item ${riskClass}`} title={item.file}>
                        <div className="file-name">{item.file}</div>
                        <div className="file-stats">
                            <span style={{ width: '80px', textAlign: 'right', fontWeight: 600 }}>{item.changes}</span>
                            <span style={{ width: '80px', textAlign: 'right', color: item.complexity > 30 ? 'var(--warning)' : 'inherit' }}>
                                {item.complexity}
                            </span>
                            <span style={{ width: '20px' }}>
                                {riskClass === 'high-risk' ?
                                    <AlertCircle size={16} color="var(--danger)" /> :
                                    (riskClass === 'low-risk' ? <CheckCircle2 size={16} color="var(--success)" /> : <AlertCircle size={16} color="var(--warning)" />)
                                }
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

# Change commit 6 by Bob Engineer

# Change commit 7 by Alice Developer

# Change commit 10 by Bob Engineer

# Change commit 13 by Bob Engineer

# Change commit 20 by Alice Developer

# Change commit 22 by Diana Hacker

# Change commit 34 by Bob Engineer

# Change commit 39 by Bob Engineer

# Change commit 49 by Charlie Coder

# Change commit 54 by Charlie Coder

# Change commit 55 by Diana Hacker

# Change commit 61 by Alice Developer

# Change commit 64 by Alice Developer

# Change commit 65 by Alice Developer

# Change commit 67 by Bob Engineer

# Change commit 69 by Diana Hacker

# Change commit 75 by Charlie Coder

# Change commit 77 by Bob Engineer

# Change commit 78 by Charlie Coder

# Change commit 82 by Diana Hacker

# Change commit 90 by Diana Hacker

# Change commit 91 by Charlie Coder

# Change commit 105 by Alice Developer

# Change commit 111 by Alice Developer

# Change commit 112 by Bob Engineer

# Change commit 119 by Diana Hacker

# Change commit 123 by Alice Developer

# Change commit 124 by Alice Developer

# Change commit 131 by Charlie Coder

# Change commit 142 by Alice Developer

# Change commit 143 by Charlie Coder

# Change commit 144 by Bob Engineer

# Change commit 145 by Alice Developer

# Change commit 146 by Diana Hacker

# Change commit 148 by Charlie Coder

# Change commit 150 by Bob Engineer

# Change commit 151 by Bob Engineer

# Change commit 171 by Charlie Coder

# Change commit 174 by Alice Developer
