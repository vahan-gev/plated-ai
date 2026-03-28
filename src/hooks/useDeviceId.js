'use client';

import { useState, useEffect } from 'react';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function useDeviceId() {
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    try {
      let storedId = localStorage.getItem('deviceId');
      if (!storedId) {
        storedId = generateUUID();
        localStorage.setItem('deviceId', storedId);
      }
      setDeviceId(storedId);
    } catch (e) {
      setDeviceId(generateUUID());
    }
  }, []);

  return deviceId;
}
