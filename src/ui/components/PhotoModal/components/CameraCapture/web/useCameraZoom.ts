import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';

import {
  DOUBLE_TAP_DELAY,
  DOUBLE_TAP_DISTANCE,
  DOUBLE_TAP_ZOOM,
  MAX_ZOOM,
  MIN_ZOOM,
} from './camera';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function roundZoom(value: number): number {
  return Math.round(value * 10) / 10;
}

function getTouchDistance(touches: TouchList): number {
  const first = touches[0];
  const second = touches[1];

  if (!first || !second) {
    return 0;
  }

  return Math.hypot(
    first.clientX - second.clientX,
    first.clientY - second.clientY,
  );
}

export function useCameraZoom(videoRef: RefObject<HTMLVideoElement | null>) {
  const zoomRef = useRef(MIN_ZOOM);
  const pinchRef = useRef<{ distance: number; zoom: number } | null>(null);
  const lastTapRef = useRef<{ time: number; x: number; y: number } | null>(null);
  const frameRef = useRef<number | null>(null);
  const pendingZoomRef = useRef<number | null>(null);
  const wasPinchingRef = useRef(false);

  const [zoom, setZoom] = useState(MIN_ZOOM);

  const updateZoom = useCallback((nextZoom: number) => {
    const clamped = clamp(roundZoom(nextZoom), MIN_ZOOM, MAX_ZOOM);

    zoomRef.current = clamped;
    setZoom(clamped);
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    function handleTouchStart(event: TouchEvent) {
      if (event.touches.length !== 2) {
        return;
      }

      wasPinchingRef.current = true;
      lastTapRef.current = null;
      pinchRef.current = {
        distance: getTouchDistance(event.touches),
        zoom: zoomRef.current,
      };
    }

    function handleTouchMove(event: TouchEvent) {
      const pinch = pinchRef.current;

      if (!pinch || !pinch.distance || event.touches.length < 2) {
        return;
      }

      event.preventDefault();

      pendingZoomRef.current =
        pinch.zoom * (getTouchDistance(event.touches) / pinch.distance);

      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(() => {
          frameRef.current = null;

          if (pendingZoomRef.current !== null) {
            updateZoom(pendingZoomRef.current);
            pendingZoomRef.current = null;
          }
        });
      }
    }

    function handleTouchEnd(event: TouchEvent) {
      if (event.touches.length < 2) {
        pinchRef.current = null;
      }

      if (wasPinchingRef.current) {
        if (event.touches.length === 0) {
          wasPinchingRef.current = false;
        }

        return;
      }

      if (event.changedTouches.length !== 1) {
        return;
      }

      const touch = event.changedTouches[0];

      if (!touch) {
        return;
      }

      const now = Date.now();
      const lastTap = lastTapRef.current;

      if (
        lastTap &&
        now - lastTap.time < DOUBLE_TAP_DELAY &&
        Math.hypot(touch.clientX - lastTap.x, touch.clientY - lastTap.y) <
        DOUBLE_TAP_DISTANCE
      ) {
        lastTapRef.current = null;
        updateZoom(zoomRef.current > MIN_ZOOM ? MIN_ZOOM : DOUBLE_TAP_ZOOM);
        return;
      }

      lastTapRef.current = { time: now, x: touch.clientX, y: touch.clientY };
    }

    function handleGesture(event: Event) {
      event.preventDefault();
    }

    video.addEventListener('touchstart', handleTouchStart, { passive: true });
    video.addEventListener('touchmove', handleTouchMove, { passive: false });
    video.addEventListener('touchend', handleTouchEnd);
    video.addEventListener('touchcancel', handleTouchEnd);
    video.addEventListener('gesturestart', handleGesture);
    video.addEventListener('gesturechange', handleGesture);

    return () => {
      video.removeEventListener('touchstart', handleTouchStart);
      video.removeEventListener('touchmove', handleTouchMove);
      video.removeEventListener('touchend', handleTouchEnd);
      video.removeEventListener('touchcancel', handleTouchEnd);
      video.removeEventListener('gesturestart', handleGesture);
      video.removeEventListener('gesturechange', handleGesture);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [updateZoom, videoRef]);

  const getZoom = useCallback(() => zoomRef.current, []);

  return {
    zoom,
    getZoom,
  };
}
