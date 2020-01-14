import React from 'react';
import cn from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleLeft,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';

import SOLUTIONS from '../../../data/solutions.json';

const SOLVED = SOLUTIONS.length;

export default function Navigation(props) {
  const id = +props.solutionId;
  if (!id) {
    return null;
  }
  const isFirst = id === 1;
  const isLast = id === SOLVED;

  const rewind = () => props.history.push(`${id - 1}`);
  const random = () => props.history.push(`${Math.ceil(SOLVED * Math.random())}`);
  const forward = () => props.history.push(`${id + 1}`);

  return (
    <div className="page__navigation">
      <button className={cn({ disabled: isFirst })} onClick={rewind} type="button">
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>
      <button onClick={random} type="button">
        <span>Random</span>
      </button>
      <button className={cn({ disabled: isLast })} onClick={forward} type="button">
        <FontAwesomeIcon icon={faAngleRight} />
      </button>
    </div>
  );
}
