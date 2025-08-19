import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import * as Speech from 'expo-speech';
import { transcribeAudio, translateText } from '../api/mockApi';

type Message = { id: string; speaker: 'A' | 'B'; original: string; language: string; translated: string };

export default function VoiceTranslateScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [recording, setRecording] = useState<'A' | 'B' | null>(null);

  const onRecord = async (speaker: 'A' | 'B') => {
    if (recording) return;
    setRecording(speaker);
    // Mock: in real implementation, capture audio and send to Whisper/Vosk
    const transcript = await transcribeAudio('file://audio.m4a');
    const opposite = speaker === 'A' ? 'B' : 'A';
    const to = transcript.language === 'en' ? 'es' : 'en';
    const translated = await translateText(transcript.text, to);
    const msg: Message = {
      id: `${Date.now()}`,
      speaker,
      original: transcript.text,
      language: transcript.language,
      translated,
    };
    setMessages((prev) => [msg, ...prev]);
    Speech.speak(translated.replace(/^\(.*?\)\s*/, ''), { language: to });
    setRecording(null);
  };

  return (
    <View className="flex-1 bg-white">
      <FlatList
        className="flex-1 p-4"
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <View className={`mb-3 ${item.speaker === 'A' ? 'items-start' : 'items-end'}`}>
            <View className={`max-w-[80%] rounded p-3 ${item.speaker === 'A' ? 'bg-slate-100' : 'bg-sky-600'}`}>
              <Text className={`${item.speaker === 'A' ? 'text-slate-800' : 'text-white'}`}>{item.original}</Text>
              <Text className={`${item.speaker === 'A' ? 'text-slate-500' : 'text-sky-100'} mt-1 text-xs`}>{item.language.toUpperCase()}</Text>
            </View>
            <View className="max-w-[80%] rounded p-3 mt-1 bg-emerald-600">
              <Text className="text-white">{item.translated}</Text>
            </View>
          </View>
        )}
      />
      <View className="flex-row items-center justify-around p-4 border-t border-slate-200">
        <TouchableOpacity className={`px-6 py-3 rounded-full ${recording === 'A' ? 'bg-slate-400' : 'bg-slate-800'}`} onPress={() => onRecord('A')} disabled={!!recording}>
          <Text className="text-white font-medium">Mic A</Text>
        </TouchableOpacity>
        <TouchableOpacity className={`px-6 py-3 rounded-full ${recording === 'B' ? 'bg-sky-400' : 'bg-sky-700'}`} onPress={() => onRecord('B')} disabled={!!recording}>
          <Text className="text-white font-medium">Mic B</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

