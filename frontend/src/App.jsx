import { useState, useEffect } from 'react';
import axios from 'axios';
import { GitBranch, BrainCircuit, Activity, Users, Play, Pause, AlertTriangle } from 'lucide-react';
import TimelineAnimation from './components/TimelineAnimation';
import CodeHeatmap from './components/CodeHeatmap';
import NetworkGraph from './components/NetworkGraph';
import InsightsPanel from './components/InsightsPanel';

function App() {
  const [repoPath, setRepoPath] = useState('..');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const [commits, setCommits] = useState([]);
  const [heatmap, setHeatmap] = useState([]);
  const [network, setNetwork] = useState({ nodes: [], links: [] });

  const handleParse = async () => {
    if (!repoPath) return;
    setLoading(true);
    setError('');

    try {
      // 1. Trigger Parse
      const parseRes = await axios.post('http://localhost:8000/api/parse', { repo_path: repoPath });
      setStats(parseRes.data.stats);

      // 2. Fetch Data
      const [commitsRes, heatmapRes, networkRes] = await Promise.all([
        axios.get(`http://localhost:8000/api/commits?repo_path=${encodeURIComponent(repoPath)}`),
        axios.get(`http://localhost:8000/api/heatmap?repo_path=${encodeURIComponent(repoPath)}`),
        axios.get(`http://localhost:8000/api/network?repo_path=${encodeURIComponent(repoPath)}`)
      ]);

      setCommits(commitsRes.data);
      setHeatmap(heatmapRes.data);
      setNetwork(networkRes.data);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to parse repository');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {loading && (
        <div className="loading-overlay">
          <div className="loader"></div>
          <h2>Parsing Repository... ({repoPath})</h2>
          <p>Analyzing up to 1000 commits, file changes, and complexity</p>
        </div>
      )}

      <header className="header">
        <h1><GitBranch /> Git History Time Traveller</h1>
        <div className="repo-input-container">
          <input
            type="text"
            className="repo-input"
            placeholder="Absolute Path to Git Repo"
            value={repoPath}
            onChange={e => setRepoPath(e.target.value)}
          />
          <button className="btn" onClick={handleParse} disabled={loading}>
            Analyze Repo
          </button>
        </div>
      </header>

      {error && (
        <div style={{ padding: '1rem', background: 'var(--danger)', color: 'white', textAlign: 'center' }}>
          <AlertTriangle style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> {error}
        </div>
      )}

      {stats ? (
        <main className="main-content">
          <div className="full-width stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.total_commits}</div>
              <div className="stat-label">Commits Parsed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.total_authors}</div>
              <div className="stat-label">Contributors</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{heatmap.length}</div>
              <div className="stat-label">Hotspot Files</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.parse_time_seconds.toFixed(2)}s</div>
              <div className="stat-label">Parse Time</div>
            </div>
          </div>

          <div className="glass-panel full-width">
            <h2 className="dashboard-title"><Activity className="icon" /> Interactive Timeline</h2>
            <TimelineAnimation commits={commits} />
          </div>

          <div className="glass-panel">
            <h2 className="dashboard-title"><AlertTriangle className="icon" /> Complexity Heatmap</h2>
            <CodeHeatmap data={heatmap} />
          </div>

          <div className="glass-panel">
            <h2 className="dashboard-title"><Users className="icon" /> Contributor Network</h2>
            <NetworkGraph network={network} />
          </div>

          <div className="glass-panel full-width">
            <h2 className="dashboard-title"><BrainCircuit className="icon" /> AI Insights</h2>
            <InsightsPanel heatmap={heatmap} stats={stats} />
          </div>
        </main>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '4rem', color: 'var(--text-secondary)' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px' }}>
            <Activity size={64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <h2>Enter a repository path to begin</h2>
            <p>Our system parses 1000+ commits in under 30 seconds to generate actionable insights about code complexity, maintenance burden, and project sustainability.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

# Change commit 0 by Bob Engineer

# Change commit 0 by Alice Developer

# Change commit 5 by Alice Developer

# Change commit 9 by Diana Hacker

# Change commit 11 by Alice Developer

# Change commit 13 by Bob Engineer

# Change commit 18 by Diana Hacker

# Change commit 56 by Charlie Coder

# Change commit 58 by Alice Developer

# Change commit 60 by Bob Engineer

# Change commit 63 by Alice Developer

# Change commit 65 by Alice Developer

# Change commit 69 by Diana Hacker

# Change commit 70 by Bob Engineer

# Change commit 78 by Charlie Coder

# Change commit 79 by Charlie Coder

# Change commit 85 by Bob Engineer

# Change commit 89 by Charlie Coder

# Change commit 92 by Charlie Coder

# Change commit 93 by Bob Engineer

# Change commit 96 by Bob Engineer

# Change commit 97 by Charlie Coder

# Change commit 100 by Bob Engineer

# Change commit 104 by Bob Engineer

# Change commit 106 by Diana Hacker

# Change commit 107 by Bob Engineer

# Change commit 111 by Alice Developer

# Change commit 115 by Alice Developer

# Change commit 116 by Charlie Coder

# Change commit 122 by Diana Hacker

# Change commit 127 by Diana Hacker

# Change commit 129 by Diana Hacker

# Change commit 135 by Bob Engineer

# Change commit 136 by Charlie Coder

# Change commit 139 by Diana Hacker

# Change commit 148 by Charlie Coder

# Change commit 152 by Alice Developer

# Change commit 153 by Bob Engineer

# Change commit 155 by Diana Hacker

# Change commit 156 by Bob Engineer

# Change commit 158 by Alice Developer

# Change commit 162 by Charlie Coder

# Change commit 166 by Charlie Coder

# Change commit 173 by Alice Developer

# Change commit 174 by Alice Developer

# Change commit 176 by Diana Hacker

# Change commit 177 by Alice Developer

# Change commit 179 by Alice Developer

# Change commit 180 by Alice Developer

# Change commit 192 by Charlie Coder
