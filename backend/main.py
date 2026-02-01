from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import git
import time
from pydantic import BaseModel
from typing import List, Dict, Any
import os
import networkx as nx
from collections import defaultdict
import radon.complexity as cc
from radon.visitors import ComplexityVisitor

app = FastAPI(title="Git History Time Traveller")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory cache for demo
repo_data_cache = {}

class ParseRequest(BaseModel):
    repo_path: str

@app.get("/")
def read_root():
    return {"status": "Git History Time Traveller API is running."}

def extract_commit_data(repo, limit=1000):
    commits = []
    file_changes = defaultdict(int)
    authors = set()
    author_commits = defaultdict(int)
    
    # For temporal graph
    co_changes = defaultdict(int) # (file_a, file_b) -> int
    file_authors = defaultdict(set) # file -> set of authors
    
    count = 0
    t0 = time.time()
    
    try:
        for commit in repo.iter_commits('HEAD', max_count=limit):
            author_name = commit.author.name
            authors.add(author_name)
            author_commits[author_name] += 1
            
            commit_info = {
                "hash": commit.hexsha,
                "author": author_name,
                "date": commit.committed_datetime.isoformat(),
                "message": commit.message.split("\n")[0],
                "files": []
            }
            
            # Use stats instead of diff which is much faster
            stats = commit.stats.files
            files_in_commit = list(stats.keys())
            
            for file in files_in_commit:
                file_changes[file] += 1
                file_authors[file].add(author_name)
                commit_info["files"].append({
                    "name": file,
                    "insertions": stats[file].get("insertions", 0),
                    "deletions": stats[file].get("deletions", 0),
                    "lines": stats[file].get("lines", 0)
                })
                
            # track co-changes for network graph
            for i in range(len(files_in_commit)):
                for j in range(i+1, len(files_in_commit)):
                    pair = tuple(sorted([files_in_commit[i], files_in_commit[j]]))
                    co_changes[pair] += 1
                    
            commits.append(commit_info)
            count += 1
            if count >= limit:
                break
    except Exception as e:
        print(f"Error iterating commits: {e}")
        
    parse_time = time.time() - t0
    
    # Calculate simple complexity for top changed files at HEAD
    hotspot_files = sorted(file_changes.items(), key=lambda x: x[1], reverse=True)[:50]
    complexity_scores = {}
    
    for filename, count in hotspot_files:
        if filename.endswith('.py'):
            try:
                # Read from current HEAD tree
                blob = repo.head.commit.tree / filename
                content = blob.data_stream.read().decode('utf-8')
                v = ComplexityVisitor.from_code(content)
                score = sum(func.complexity for func in v.functions) + sum(cls.real_complexity for cls in v.classes)
                complexity_scores[filename] = score
            except Exception:
                complexity_scores[filename] = 0
        else:
            # We can only use Radon on Python files easily
            # For others, we might just map to file size or leave 0
            complexity_scores[filename] = 0

    return {
        "commits": commits,
        "heatmap": [
            {
                "file": k, 
                "changes": v, 
                "complexity": complexity_scores.get(k, 0)
            } for k, v in hotspot_files
        ],
        "contributors": list(authors),
        "author_commits": author_commits,
        "co_changes": [{"source": pair[0], "target": pair[1], "value": val} for pair, val in co_changes.items()],
        "file_authors": {k: list(v) for k, v in file_authors.items()},
        "stats": {
            "parse_time_seconds": parse_time,
            "total_commits": count,
            "total_authors": len(authors)
        }
    }

@app.post("/api/parse")
def parse_repo(req: ParseRequest):
    repo_path = req.repo_path
    
    if not os.path.exists(repo_path):
        raise HTTPException(status_code=400, detail="Repository path does not exist")
        
    try:
        repo = git.Repo(repo_path)
    except git.exc.InvalidGitRepositoryError:
        raise HTTPException(status_code=400, detail="Invalid git repository")
        
    data = extract_commit_data(repo, limit=1000)
    repo_data_cache[repo_path] = data
    
    return {
        "m_message": "Repository parsed successfully",
        "stats": data["stats"]
    }

@app.get("/api/commits")
def get_commits(repo_path: str):
    if repo_path not in repo_data_cache:
        raise HTTPException(status_code=404, detail="Repository not parsed yet")
    return repo_data_cache[repo_path]["commits"]

@app.get("/api/heatmap")
def get_heatmap(repo_path: str):
    if repo_path not in repo_data_cache:
        raise HTTPException(status_code=404, detail="Repository not parsed yet")
    return repo_data_cache[repo_path]["heatmap"]

@app.get("/api/network")
def get_network(repo_path: str):
    if repo_path not in repo_data_cache:
        raise HTTPException(status_code=404, detail="Repository not parsed yet")
        
    data = repo_data_cache[repo_path]
    authors = list(data["author_commits"].keys())
    
    # Create contributor network: link authors if they edit same files often
    nodes = [{"id": a, "group": "author", "val": data["author_commits"][a]} for a in authors]
    links = []
    
    author_coedits = defaultdict(int)
    for file, authors_set in data["file_authors"].items():
        authors_list = list(authors_set)
        for i in range(len(authors_list)):
            for j in range(i+1, len(authors_list)):
                pair = tuple(sorted([authors_list[i], authors_list[j]]))
                author_coedits[pair] += 1
                
    for pair, weight in author_coedits.items():
        # Minimum threshold to reduce noise
        if weight > 2:
            links.append({"source": pair[0], "target": pair[1], "value": weight})
            
    return {
        "nodes": nodes,
        "links": links
    }

@app.get("/api/overview")
def get_overview(repo_path: str):
    if repo_path not in repo_data_cache:
        raise HTTPException(status_code=404, detail="Repository not parsed yet")
    return repo_data_cache[repo_path]["stats"]

# Change commit 4 by Alice Developer

# Change commit 7 by Alice Developer

# Change commit 14 by Bob Engineer

# Change commit 16 by Alice Developer

# Change commit 19 by Charlie Coder

# Change commit 22 by Diana Hacker

# Change commit 24 by Alice Developer
