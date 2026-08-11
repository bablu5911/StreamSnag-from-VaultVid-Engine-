import React from 'react';

export const BottomVideoSection: React.FC = () => {
  return (
    <div className="relative w-full shrink-0">
      <div className="absolute top-0 left-0 w-full h-[100px] bg-gradient-to-b from-[#C80A0A] to-transparent z-10 pointer-events-none" />
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-auto block object-contain"
      >
        <source
          src="https://vjs.zencdn.net/v/oceans.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
};
