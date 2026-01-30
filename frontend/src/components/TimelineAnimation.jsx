import { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function TimelineAnimation({ commits }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const playRef = useRef(null);

    // Group commits by day for a simpler chart
    const commitsByDate = {};
    commits.forEach(c => {
        const date = new Date(c.date).toISOString().split('T')[0];
        commitsByDate[date] = (commitsByDate[date] || 0) + 1;
    });

    const sortedDates = Object.keys(commitsByDate).sort();
    const dataPoints = sortedDates.map(d => commitsByDate[d]);

    // Provide partial data up to currentIndex for animation
    const currentData = dataPoints.slice(0, currentIndex + 1);
    const currentLabels = sortedDates.slice(0, currentIndex + 1);

    useEffect(() => {
        if (isPlaying) {
            playRef.current = setInterval(() => {
                setCurrentIndex(prev => {
                    if (prev >= sortedDates.length - 1) {
                        clearInterval(playRef.current);
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 50); // fast playback
        } else {
            clearInterval(playRef.current);
        }
        return () => clearInterval(playRef.current);
    }, [isPlaying, sortedDates.length]);

    const togglePlay = () => {
        if (currentIndex >= sortedDates.length - 1) {
            setCurrentIndex(0);
        }
        setIsPlaying(!isPlaying);
    };

    const lineData = {
        labels: currentLabels,
        datasets: [
            {
                label: 'Commits per Day',
                data: currentData,
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 2,
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                display: false,
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: '#9ca3af' }
            }
        },
        plugins: {
            legend: { display: false },
        },
        animation: {
            duration: 0
        }
    };

    return (
        <div>
            <div className="viz-container">
                <Line data={lineData} options={lineOptions} />
            </div>

            <div className="timeline-controls">
                <button className="play-btn" onClick={togglePlay}>
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <input
                    type="range"
                    min="0"
                    max={Math.max(0, sortedDates.length - 1)}
                    value={currentIndex}
                    onChange={(e) => {
                        setCurrentIndex(parseInt(e.target.value));
                        setIsPlaying(false);
                    }}
                />
                <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                    {currentLabels[currentLabels.length - 1] || 'No timeline Data'}
                </div>
            </div>
        </div>
    );
}

# Change commit 0 by Bob Engineer

# Change commit 0 by Alice Developer

# Change commit 1 by Diana Hacker

# Change commit 8 by Bob Engineer

# Change commit 12 by Charlie Coder
