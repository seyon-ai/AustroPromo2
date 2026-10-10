import React from 'react';
import {Composition} from 'remotion';
import {Promo} from './Promo';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './timing';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AustroClashPromo"
        component={Promo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="AustroClashPromoVertical"
        component={Promo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
