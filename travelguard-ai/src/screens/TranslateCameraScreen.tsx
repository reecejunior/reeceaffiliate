import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { detectLanguage, ocrImage, translateText } from '../api/mockApi';

export default function TranslateCameraScreen() {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [captured, setCaptured] = useState<string | null>(null);
  const [translated, setTranslated] = useState<string | null>(null);
  const [targetLang, setTargetLang] = useState<string>('en');

  const handleCapture = async () => {
    try {
      const cam = cameraRef.current;
      if (!cam) return;
      const photo = await cam.takePictureAsync({ base64: true, quality: 0.8 });
      if (!photo.base64) return;
      setCaptured(`data:image/jpg;base64,${photo.base64}`);
      const ocr = await ocrImage(photo.base64);
      const detected = await detectLanguage(ocr.text);
      const to = targetLang || (detected === 'en' ? 'es' : 'en');
      const translated = await translateText(ocr.text, to);
      setTranslated(translated);
    } catch {}
  };

  if (!permission?.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <Text className="mb-4 text-center">Camera permission is required.</Text>
        <TouchableOpacity className="px-4 py-2 bg-sky-600 rounded" onPress={() => requestPermission()}>
          <Text className="text-white">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {!captured ? (
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />
      ) : (
        <View className="flex-1">
          <Image source={{ uri: captured }} style={{ flex: 1 }} resizeMode="cover" />
          {!!translated && (
            <View className="absolute bottom-10 left-4 right-4 bg-black/60 rounded p-3">
              <Text className="text-white text-lg">{translated}</Text>
            </View>
          )}
        </View>
      )}
      <View className="absolute bottom-6 left-0 right-0 items-center">
        <TouchableOpacity className="bg-white rounded-full w-16 h-16 items-center justify-center" onPress={handleCapture}>
          <View className="w-12 h-12 bg-slate-800 rounded-full" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

