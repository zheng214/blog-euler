import React from 'react';
import { Link } from 'react-router-dom';

import SOLUTIONS from '../../../data/solutions.json';
import './style.scss';

const SOLVED = SOLUTIONS.length;
const SECTIONS = Math.ceil(SOLVED / 10);

function renderSolutions() {
  return [...Array(SECTIONS)].map((_, sectionId) => {
    const start = sectionId * 10;
    const lowRange = start;
    const highRange = Math.min(start + 10, SOLVED);
    const section = SOLUTIONS.slice(lowRange, highRange);
    return (
      <div className="solution-hub__section">
        <p className="solution-hub__section-header">{`${lowRange + 1} - ${highRange}`}</p>
        <div className="solution-hub__section-list">
          <ul>
            {section.map((solution) => (
              <li>
                <b>{`${solution.id}. `}</b>
                <Link to={`/e/${solution.id}`}>
                  {`${solution.title}`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  });
}

const rendered = renderSolutions();

export default function SolutionHub() {
  return (
    <div className="solution-hub">
      <h3>Problems &amp; Solutions</h3>
      <p>Click on the individual links to view the solutions to each problem. Roughly speaking, the problems increases in difficulty the further we go down the list.</p>
      <div className="solution-hub__list">
        {rendered}
      </div>
    </div>
  );
}
