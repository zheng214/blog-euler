/* eslint-disable max-len */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import './style.scss';
import SOLUTIONS from '../../data/solutions.json';

const SOLVED = SOLUTIONS.length;

const aboutSite = `
  Similar to popular coding challenges websites such as Hackerrank and Leetcode,
  Project Euler offers a list of programming challenges of increasing difficulty.
  For each problem, the goal is to write a program which can solve it in a reasonable amount of time.
`;

export default function Home() {
  return (
    <div className="home">
      <section>
        <h3>Welcome!</h3>
        <p>This blog is dedicated to presenting solutions (in Javascript) of the well-known programming challenges shown on <b>Project Euler</b> (<a href="https://projecteuler.net/about">projecteuler.net</a>).</p>
      </section>
      <section>
        <h3>About Project Euler</h3>
        <p>{aboutSite}</p>
      </section>
      <section>
        <h3>About this site</h3>
        <p>Currently, this site contains <b>{SOLVED}</b> solutions. The left menu contains the link to the solutions. At the bottom of the menu, you can find all the helper functions which are shared across multiple solutions.</p>
      </section>
    </div>
  );
}
