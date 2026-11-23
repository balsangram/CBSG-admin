import React, { useState } from 'react';

export function CollectionTrendsChart({ data }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const dates = data?.dates || [];
  const yLabels = data?.yAxis || ['₹80k', '₹60k', '₹40k', '₹20k', '₹0k'];

  // SVG dimensions
  const width = 640;
  const height = 180;
  const paddingLeft = 45;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Max value is 80k
  const maxValue = 80;

  // Calculate coordinates for each date point
  const points = dates.map((d, index) => {
    const x = paddingLeft + (index / (dates.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.value / maxValue) * chartHeight;
    return { ...d, x, y };
  });

  // Build smooth cubic Bézier curve path
  const buildSmoothPath = (pts) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const linePath = buildSmoothPath(points);
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : '';

  return (
    <div className="relative w-full overflow-hidden select-none">
      {/* SVG Container */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        style={{ minHeight: '190px' }}
      >
        <defs>
          {/* Soft warm golden/amber gradient fill under the curve */}
          <linearGradient id="collectionFillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5af38" stopOpacity="0.28" />
            <stop offset="50%" stopColor="#f5af38" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#f5af38" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Y-axis gridlines and labels */}
        {yLabels.map((label, idx) => {
          const y = paddingTop + (idx / (yLabels.length - 1)) * chartHeight;
          return (
            <g key={label}>
              <text
                x={paddingLeft - 10}
                y={y + 3}
                textAnchor="end"
                className="text-[9px] fill-[#9e9289] font-mono select-none"
              >
                {label}
              </text>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#efebe2"
                strokeWidth="1"
              />
            </g>
          );
        })}

        {/* Area fill */}
        {areaPath && (
          <path d={areaPath} fill="url(#collectionFillGrad)" />
        )}

        {/* Golden line curve */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="#c88a29"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Interactive points & hover effects */}
        {points.map((pt) => (
          <g
            key={pt.date}
            onMouseEnter={() => setHoveredPoint(pt)}
            onMouseLeave={() => setHoveredPoint(null)}
            className="cursor-pointer"
          >
            {/* Invisible larger hover zone */}
            <circle cx={pt.x} cy={pt.y} r="12" fill="transparent" />

            {/* Peak highlight for 17 Nov or hovered point */}
            {(pt.date === '17 Nov' || hoveredPoint?.date === pt.date) && (
              <>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  fill="#c88a29"
                  className="animate-pulse"
                />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="2.5"
                  fill="#ffffff"
                />
              </>
            )}

            {/* X-axis date label */}
            <text
              x={pt.x}
              y={height - 5}
              textAnchor="middle"
              className={`text-[8.5px] select-none font-medium ${
                pt.date === '17 Nov' || hoveredPoint?.date === pt.date
                  ? 'fill-[#2c1b15] font-bold'
                  : 'fill-[#9e9289]'
              }`}
            >
              {pt.date}
            </text>
          </g>
        ))}
      </svg>

      {/* Floating Tooltip */}
      {hoveredPoint && (
        <div
          className="absolute z-20 pointer-events-none bg-[#2c1b15] text-white text-[10px] font-medium py-1 px-2.5 rounded-lg shadow-lg -translate-x-1/2 -translate-y-full"
          style={{
            left: `${(hoveredPoint.x / width) * 100}%`,
            top: `${(hoveredPoint.y / height) * 100}%`,
            marginTop: '-8px',
          }}
        >
          <div className="font-bold">{hoveredPoint.date}</div>
          <div className="text-amber-300">₹{hoveredPoint.value},000</div>
        </div>
      )}
    </div>
  );
}

export default CollectionTrendsChart;
