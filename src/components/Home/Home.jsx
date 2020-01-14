/* eslint-disable max-len */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import './style.scss';
import SOLUTIONS from '../../data/solutions.json';

const SOLVED = SOLUTIONS.length;

export default function Home() {
  return (
    <div className="home">
      <section>
        <h3>Welcome</h3>
        <p>This blog is dedicated to presenting solutions (in Javascript) of the well-known programming challenges shown on <b>Project Euler</b> (<a href="https://projecteuler.net/about">projecteuler.net</a>).</p>
      </section>
      <section>
        <h3>About Project Euler</h3>
        <p>Similar to popular coding challenges websites such as Hackerrank and Leetcode, Project Euler offers a list of programming challenges of increasing difficulty. For each problem, the goal is to write a program which can solve it in a reasonable amount of time. Although there is a straighforward, brute-force solution to the problems, it is extremely slow compared to the optimal solution. A rule of thumb is that the program must run under one minute using a relatively modern processor.</p>
      </section>
      <section>
        <h3>About this site</h3>
        <p>Currently, this site contains <b>{SOLVED}</b> solutions. The left menu contains the link to the solutions. The right menu contains all the helper functions which are shared across multiple solutions.</p>
      </section>
      <section>
        <h3>About me</h3>
        <p>My name is Zhengnan Shang. I got my undergraduate degree at Mcgill University in 2015 in Statistics and Computer Science. I created this website as a hobby/portfolio to express my interest and passion for mathematics and algorithms. To contact me, send me an email to zheng.n.shang@hotmail.com, I look forward to hearing from you!</p>
      </section>
    </div>
  );
}
