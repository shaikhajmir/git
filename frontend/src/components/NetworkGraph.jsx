import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function NetworkGraph({ network }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!network || !network.nodes || network.nodes.length === 0) return;

        const width = containerRef.current.clientWidth;
        const height = 350;

        // Clear previous SVG
        d3.select(containerRef.current).selectAll('*').remove();

        const svg = d3.select(containerRef.current)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [0, 0, width, height]);

        // Handle deep copy for safety in React strict mode
        const nodes = network.nodes.map(d => ({ ...d }));
        const links = network.links.map(d => ({ ...d }));

        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-200))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(20));

        // Links
        const link = svg.append('g')
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('class', 'd3-link')
            .attr('stroke', 'rgba(255, 255, 255, 0.2)')
            .attr('stroke-width', d => Math.sqrt(d.value));

        // Nodes
        const maxSize = Math.max(...nodes.map(n => n.val), 1);

        const node = svg.append('g')
            .selectAll('circle')
            .data(nodes)
            .join('circle')
            .attr('class', 'd3-node')
            .attr('r', d => Math.max(5, (d.val / maxSize) * 20)) // size based on commit count
            .attr('fill', d => d3.schemeSet3[Math.abs(hashString(d.id)) % 10])
            .call(drag(simulation));

        // Labels
        const labels = svg.append('g')
            .selectAll('text')
            .data(nodes)
            .join('text')
            .attr('dx', 15)
            .attr('dy', '.35em')
            .attr('fill', '#fff')
            .attr('font-size', '10px')
            .text(d => d.id);

        // Tooltips
        node.append('title')
            .text(d => `${d.id} (${d.val} commits)`);

        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node
                .attr('cx', d => Math.max(15, Math.min(width - 15, d.x)))
                .attr('cy', d => Math.max(15, Math.min(height - 15, d.y)));

            labels
                .attr('x', d => Math.max(15, Math.min(width - 15, d.x)))
                .attr('y', d => Math.max(15, Math.min(height - 15, d.y)));
        });

        // Helper drag function
        function drag(simulation) {
            function dragstarted(event) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }
            function dragged(event) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }
            function dragended(event) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }
            return d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended);
        }

        // Helper hash function for colors
        function hashString(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i);
            return hash;
        }

        return () => simulation.stop();
    }, [network]);

    if (!network || !network.nodes || network.nodes.length === 0) {
        return <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Not enough contributor data for network graph</div>;
    }

    return <div ref={containerRef} className="viz-container"></div>;
}

# Change commit 2 by Diana Hacker

# Change commit 4 by Alice Developer

# Change commit 6 by Bob Engineer

# Change commit 11 by Alice Developer

# Change commit 14 by Bob Engineer

# Change commit 16 by Alice Developer

# Change commit 17 by Diana Hacker

# Change commit 21 by Charlie Coder

# Change commit 26 by Bob Engineer

# Change commit 28 by Charlie Coder

# Change commit 34 by Bob Engineer
