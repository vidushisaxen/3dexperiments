import React, { useState } from 'react';

const Archive = ({ onHeadingClick }) => {
  const [activeHeading, setActiveHeading] = useState(null);

  const handleClick = (headingId, glbPath) => {
    setActiveHeading(headingId);
    onHeadingClick(glbPath);
  };

  const items = [
    { id: 'black-chair', name: 'Black Chair', year: '2021', path: '/assets/furniverse/blackchair.glb' },
    { id: 'stick-chair', name: 'Stick Chair', year: '2022', path: '/assets/furniverse/stick-chair.glb' },
    { id: 'ashtray-v1', name: 'Smoking Objects - Ashtray v1', year: '2021', path: '/assets/furniverse/ashtray-v1.glb' },
    { id: 'hole-chair', name: 'Holed Armchair', year: '2022', path: '/assets/furniverse/hole-chair.glb' },
    { id: 'sample-lamp', name: 'Light Fixture I', year: '2022', path: '/assets/furniverse/sample-lamp.glb' },
    { id: 'wide-chair', name: 'Walking Armchair', year: '2022', path: '/assets/furniverse/wide-chair.glb' },
  ];

  return (
    <section id="archive" className="pb-[10vw]">
      <div className="flex flex-col items-center justify-center py-[5vw]">
        <p className="text-[2vw]">Archive</p>
        {items.map(({ id, name, year, path }) => (
          <div
            key={id}
            className={`py-[3vw] cursor-pointer transition-all duration-500 ease ${
              activeHeading === id
                ? 'text-white'
                : 'text-[#222222] hover:text-[#a1a1a1]'
            }`}
            onClick={() => handleClick(id, path)}
            style={{
              position: activeHeading === id ? 'relative' : 'static',
            }}
          >
            <h2 className="text-[6vw] leading-[1.2] para overflow-hidden">{name}</h2>
            <p className="text-[1.5vw] leading-[1.2] para overflow-hidden">{year}</p>
            <div className="flex items-center justify-between gap-[4vw]">
              <p className="text-[1.5vw] leading-[1.2] para overflow-hidden">US/WW</p>
              <p className="text-[1.5vw] leading-[1.2] para overflow-hidden">Armchair</p>
              <p className="text-[1.5vw] leading-[1.2] para overflow-hidden">Interior</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Archive;
