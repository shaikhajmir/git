import React from 'react';
import { Lightbulb, AlertTriangle, TrendingUp, ShieldAlert } from 'lucide-react';

export default function InsightsPanel({ heatmap = [], stats }) {
    if (!heatmap.length) {
        return <div style={{ color: 'var(--text-secondary)' }}>No insights available yet</div>;
    }

    // Calculate average complexity and total changes
    let totalComp = 0;
    let totalChanges = 0;
    let highestComp = heatmap[0];
    let mostChanged = heatmap.reduce((prev, curr) => (curr.changes > prev.changes) ? curr : prev, heatmap[0]);

    heatmap.forEach(h => {
        totalComp += h.complexity;
        totalChanges += h.changes;
        if (h.complexity > highestComp.complexity) {
            highestComp = h;
        }
    });

    const avgComp = heatmap.length > 0 ? (totalComp / heatmap.length).toFixed(1) : 0;

    const identifyDebt = () => {
        if (highestComp && highestComp.complexity > 50) {
            return `Critical Technical Debt detected in ${highestComp.file} (Complexity: ${highestComp.complexity}). High priority for refactoring.`;
        }
        if (highestComp && highestComp.complexity > 20) {
            return `Moderate code complexity found in ${highestComp.file}. Consider breaking down functions.`;
        }
        return `Code complexity is generally manageable. Top complexity is ${highestComp?.complexity || 0}.`;
    };

    const identifyHotspot = () => {
        if (mostChanged && mostChanged.changes > totalChanges * 0.1) {
            return `Module ${mostChanged.file} is a significant hotspot, accounting for ${(mostChanged.changes / totalChanges * 100).toFixed(1)}% of all parsed changes.`;
        }
        return 'Changes are well distributed across the codebase. No severe hotspots detected.';
    };

    const calculateSustainability = () => {
        if (stats.total_authors < 2) {
            return 'Bus factor risk: Project relies heavily on a single contributor. Consider knowledge sharing.';
        }
        return `Contributor base looks healthy with ${stats.total_authors} developers collaborating across ${stats.total_commits} commits.`;
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>

            <div style={{ background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.3)', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-secondary)', margin: '0 0 1rem 0' }}>
                    <AlertTriangle size={18} />
                    Technical Debt Tracking
                </h3>
                <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>{identifyDebt()}</p>
                <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Average analyzed complexity: {avgComp}
                </div>
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)', margin: '0 0 1rem 0' }}>
                    <TrendingUp size={18} />
                    Change Hotspots
                </h3>
                <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>{identifyHotspot()}</p>
                <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Total file changes analyzed: {totalChanges}
                </div>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '1.5rem', gridColumn: '1 / -1' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', margin: '0 0 1rem 0' }}>
                    <ShieldAlert size={18} />
                    Project Sustainability
                </h3>
                <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>{calculateSustainability()}</p>
            </div>

        </div>
    );
}
