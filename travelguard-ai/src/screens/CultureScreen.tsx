import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchCulture } from '../api/mockApi';

export default function CultureScreen() {
  const { data } = useQuery({ queryKey: ['culture', 'city-1'], queryFn: () => fetchCulture('city-1') });
  const [query, setQuery] = useState('');

  const filter = (arr?: string[]) => (arr ?? []).filter((item) => item.toLowerCase().includes(query.toLowerCase()));

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-semibold mb-3">Culture & Norms</Text>
        <TextInput
          className="border border-slate-300 rounded px-3 py-2 mb-4"
          placeholder="Search topics (greetings, tipping, etiquette...)"
          value={query}
          onChangeText={setQuery}
        />

        <Text className="text-lg font-semibold mb-2">Quick Tips</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {(data?.quickTips ?? []).map((tip, idx) => (
            <View key={idx} className="mr-3 px-4 py-3 rounded bg-sky-50 border border-sky-100">
              <Text className="text-sky-800">{tip}</Text>
            </View>
          ))}
        </ScrollView>

        <Section title="Greetings" items={filter(data?.greetings)} />
        <Section title="Tipping" items={filter(data?.tipping)} />
        <Section title="Etiquette" items={filter(data?.etiquette)} />
        <Section title="Taboos" items={filter(data?.taboos)} />

        <Text className="text-lg font-semibold mt-4 mb-2">Emergency Contacts</Text>
        {(data?.emergencyContacts ?? []).map((c) => (
          <View key={c.label} className="mb-2 p-3 rounded border border-slate-200">
            <Text className="font-medium">{c.label}</Text>
            <Text className="text-slate-600">{c.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <View className="mb-3">
      <Text className="text-lg font-semibold mb-2">{title}</Text>
      {items.map((item, idx) => (
        <View key={idx} className="mb-2 p-3 rounded border border-slate-200">
          <Text className="text-slate-800">{item}</Text>
        </View>
      ))}
    </View>
  );
}

