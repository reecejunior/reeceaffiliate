import { useEffect } from 'react';
import * as Location from 'expo-location';
import { useAppStore } from '../store/useAppStore';

export function useUserLocation() {
  const userLocation = useAppStore((s) => s.userLocation);
  const setUserLocation = useAppStore((s) => s.setUserLocation);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (mounted) setUserLocation(null);
          return;
        }
        const pos = await Location.getCurrentPositionAsync({});
        if (mounted) setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      } catch (e) {
        if (mounted) setUserLocation(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [setUserLocation]);

  return userLocation;
}

