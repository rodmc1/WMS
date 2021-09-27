import React, { useEffect, useRef } from 'react'
import { forceSimulation, forceX, forceY, forceCollide, select } from 'd3'

export default function Bubbles({ data, width, height }) {
  const ref = useRef()
  const svg = select(ref.current)

  useEffect(() => {
    const simulation = forceSimulation(data)
      .force('x', forceX().strength(0.02))
      .force('y', forceY().strength(0.02))
      .force(
        'collide',
        forceCollide((d) => {
          return d.value * 20 + 3
        }).strength(0.3)
      )
    simulation.on('tick', () =>
      svg
        .selectAll('circle')
        .data(data)
        .join('circle')
        .style('fill', () => 'red')
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y)
        .attr('r', (d) => d.value * 20)
    )
  }, [data])

  return (
    <svg
      viewBox={`${-width / 2} ${-height / 2} ${height} ${width}`}
      width={width}
      height={height}
      ref={ref}
    ></svg>
  )
}