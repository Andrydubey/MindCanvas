import { useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import * as d3 from 'd3';

// 📊 Chart Node: Mini data visualizations
const ChartNode = ({ data, isConnectable, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [chartTitle, setChartTitle] = useState(data.title || 'Chart');
  const [chartType, setChartType] = useState(data.chartType || 'bar');
  const [chartData, setChartData] = useState(data.chartData || '10,20,15,25,30');
  const [chartLabels, setChartLabels] = useState(data.chartLabels || 'A,B,C,D,E');
  
  const svgRef = useRef(null);
  
  const handleSave = () => {
    if (data.onChange) {
      data.onChange({
        title: chartTitle,
        chartType,
        chartData,
        chartLabels
      });
    }
    setIsEditing(false);
  };

  // Parse chart data and labels
  const parseData = () => {
    const values = chartData.split(',').map(num => parseFloat(num.trim()));
    const labels = chartLabels.split(',').map(label => label.trim());
    
    return values.map((value, index) => ({
      label: index < labels.length ? labels[index] : `Item ${index + 1}`,
      value
    }));
  };

  // Render chart based on type
  useEffect(() => {
    if (!svgRef.current || isEditing) return;
    
    const parsedData = parseData();
    const width = 240;
    const height = 180;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();
    
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    if (chartType === 'bar') {
      // Bar chart
      const x = d3.scaleBand()
        .domain(parsedData.map(d => d.label))
        .range([0, innerWidth])
        .padding(0.1);
      
      const y = d3.scaleLinear()
        .domain([0, d3.max(parsedData, d => d.value)])
        .nice()
        .range([innerHeight, 0]);
      
      svg.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)')
        .attr('fill', '#A1A1AA'); // zinc-400
      
      svg.append('g')
        .call(d3.axisLeft(y).ticks(5))
        .selectAll('text')
        .attr('fill', '#A1A1AA'); // zinc-400
      
      svg.selectAll('.bar')
        .data(parsedData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.label))
        .attr('y', d => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', d => innerHeight - y(d.value))
        .attr('fill', '#10B981'); // emerald-500
      
    } else if (chartType === 'line') {
      // Line chart
      const x = d3.scalePoint()
        .domain(parsedData.map(d => d.label))
        .range([0, innerWidth]);
      
      const y = d3.scaleLinear()
        .domain([0, d3.max(parsedData, d => d.value)])
        .nice()
        .range([innerHeight, 0]);
      
      svg.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('fill', '#A1A1AA'); // zinc-400
      
      svg.append('g')
        .call(d3.axisLeft(y).ticks(5))
        .selectAll('text')
        .attr('fill', '#A1A1AA'); // zinc-400
      
      const line = d3.line()
        .x(d => x(d.label))
        .y(d => y(d.value))
        .curve(d3.curveMonotoneX);
      
      svg.append('path')
        .datum(parsedData)
        .attr('fill', 'none')
        .attr('stroke', '#10B981') // emerald-500
        .attr('stroke-width', 2)
        .attr('d', line);
      
      svg.selectAll('.dot')
        .data(parsedData)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', d => x(d.label))
        .attr('cy', d => y(d.value))
        .attr('r', 4)
        .attr('fill', '#10B981'); // emerald-500
      
    } else if (chartType === 'pie') {
      // Pie chart
      const radius = Math.min(innerWidth, innerHeight) / 2;
      
      const pie = d3.pie()
        .value(d => d.value)
        .sort(null);
      
      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);
      
      const colorScale = d3.scaleOrdinal()
        .domain(parsedData.map(d => d.label))
        .range(d3.schemeCategory10);
      
      const g = svg.append('g')
        .attr('transform', `translate(${innerWidth / 2}, ${innerHeight / 2})`);
      
      const arcs = g.selectAll('.arc')
        .data(pie(parsedData))
        .enter()
        .append('g')
        .attr('class', 'arc');
      
      arcs.append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => colorScale(i));
      
      // Add small legend
      const legend = svg.append('g')
        .attr('transform', `translate(${innerWidth - 40}, 0)`);
      
      parsedData.forEach((d, i) => {
        const legendRow = legend.append('g')
          .attr('transform', `translate(0, ${i * 15})`);
        
        legendRow.append('rect')
          .attr('width', 10)
          .attr('height', 10)
          .attr('fill', colorScale(i));
        
        legendRow.append('text')
          .attr('x', 15)
          .attr('y', 9)
          .attr('fill', '#A1A1AA') // zinc-400
          .style('font-size', '8px')
          .text(d.label);
      });
    }
    
  }, [chartType, chartData, chartLabels, isEditing]);

  return (
    <div className="p-3 rounded-md border border-emerald-500 bg-zinc-800 shadow-lg">
      {data.isResizing && selected && (
        <NodeResizer 
          minWidth={200} 
          minHeight={150}
          isVisible={selected}
          lineClassName="border-emerald-500"
          handleClassName="h-3 w-3 bg-white border-2 border-emerald-500 rounded"
          onResize={() => {
            // Trigger chart redraw when resized
            if (!isEditing && svgRef.current) {
              const parsedData = parseData();
              renderChart(parsedData, svgRef.current);
            }
          }}
        />
      )}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="text-lg mr-2">📊</span>
          <span className="font-medium text-emerald-400">{chartTitle}</span>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          className="p-1 rounded-md hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100"
        >
          {isEditing ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          )}
        </button>
      </div>

      {isEditing ? (
        <div className="mt-2">
          <div className="mb-2">
            <label className="block text-xs text-zinc-400 mb-1">Chart Title</label>
            <input
              type="text"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={chartTitle}
              onChange={(e) => setChartTitle(e.target.value)}
              placeholder="Enter chart title"
            />
          </div>
          
          <div className="mb-2">
            <label className="block text-xs text-zinc-400 mb-1">Chart Type</label>
            <select
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="pie">Pie Chart</option>
            </select>
          </div>
          
          <div className="mb-2">
            <label className="block text-xs text-zinc-400 mb-1">Data (comma separated values)</label>
            <input
              type="text"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={chartData}
              onChange={(e) => setChartData(e.target.value)}
              placeholder="10,20,15,25,30"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-xs text-zinc-400 mb-1">Labels (comma separated)</label>
            <input
              type="text"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={chartLabels}
              onChange={(e) => setChartLabels(e.target.value)}
              placeholder="A,B,C,D,E"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center bg-zinc-900 rounded-md p-2">
          <svg ref={svgRef} className="w-full" />
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-emerald-500"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-emerald-500"
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default ChartNode;
