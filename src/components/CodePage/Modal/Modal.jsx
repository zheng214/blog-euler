import React from 'react';
import cn from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCollapse,
} from '@fortawesome/free-solid-svg-icons';

import './style.scss';

export default function Modal(props) {
  return (
    <div className={cn('modal', { open: props.open })} onClick={() => props.onClose()}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" type="button" onClick={() => props.onClose()}>
          <span>CLOSE</span>
        </button>
        <div className="content">
          {props.content}
        </div>
      </div>
    </div>
  );
}
