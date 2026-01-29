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
