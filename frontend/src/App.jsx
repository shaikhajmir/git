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
