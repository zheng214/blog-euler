import React from 'react';
import { Link } from 'react-router-dom';

import UTILITIES from '../../data/utils.json';
import './utilityhub.scss';

const files = Object.keys(UTILITIES);

function renderUtilities() {
  return files.map((file) => {
    const fileInfo = UTILITIES[file];
    const fileDescription = fileInfo.description;
    const fileUtilities = Object.keys(fileInfo).filter((desc) => desc !== 'description');
    return (
      <div className="file-section">
        <p className="file-section__title"><b>{file.toUpperCase()}</b></p>
        <p className="file-section__description">{fileDescription}</p>
        <dl className="file-section__utilities">
          {fileUtilities.map((util) => {
            const utilDescription = fileInfo[util].description;
            return (
              <>
                <dt className="utility-section__title"><Link to={`u/${file}/${util}`}><code>{util}</code></Link></dt>
                <dd className="utility-section__description">{utilDescription}</dd>
              </>
            );
          })}
        </dl>
      </div>
    );
  });
}

const rendered = renderUtilities();

export default function UtilitiesHub() {
  return (
    <div className="utilities-hub">
      <h3 className="utilities-hub__title">Helper Functions</h3>
      <p>Many of the problems share a similar solution style. As a result, a lot of code is being reused repeatedly.</p>
      <p>Here are listed helper functions, each categorized loosely based on their utility.</p>
      <div className="utilities-hub__list">
        {rendered}
      </div>
    </div>
  );
}
