import { useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSalaryWiseContext } from '../lib/SalaryWiseContext';
import ChatBubble from '../components/ChatBubble';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

const CHIPS = ['New or old tax regime?', 'How much home can I afford?', 'Am I saving enough?'];

export default function CoachScreen() {
  const navigation = useNavigation<any>();
  const { state, actions } = useSalaryWiseContext();
  const { chat, chatInput, coachTyping } = state;
  const scrollRef = useRef<ScrollView>(null);

  const send = () => actions.sendChat(chatInput);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ paddingHorizontal: 22, paddingTop: 6, paddingBottom: 14, backgroundColor: colors.cream, borderBottomWidth: 1, borderBottomColor: colors.borderCard, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Pressable onPress={() => navigation.navigate('Dashboard')} hitSlop={10}>
          <Text style={{ fontSize: 22, color: colors.ink }}>←</Text>
        </Pressable>
        <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 18, color: colors.amber }}>✦</Text>
        </View>
        <View>
          <Text style={{ fontFamily: fonts.serifSemiBold, fontSize: 17, color: colors.ink }}>Money Coach</Text>
          <Text style={{ fontSize: 11, color: colors.greenLight, fontWeight: '600' }}>● Online · rule-based demo</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 18, paddingTop: 18, paddingBottom: 8, gap: 12 }}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {chat.map((m, i) => (
          <ChatBubble key={i} message={m} />
        ))}
        {coachTyping && (
          <View style={{ alignSelf: 'flex-start', backgroundColor: '#fff', borderWidth: 1, borderColor: colors.borderCard, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16 }}>
            <Text style={{ fontSize: 15, color: colors.tan }}>•••</Text>
          </View>
        )}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, paddingTop: 6, paddingBottom: 4, gap: 8 }}>
        {CHIPS.map((c) => (
          <Pressable
            key={c}
            onPress={() => actions.sendChat(c)}
            style={{ borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, borderRadius: 20, paddingHorizontal: 13, paddingVertical: 8 }}
          >
            <Text style={{ color: colors.greenLight, fontSize: 12, fontWeight: '600' }}>{c}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 16, flexDirection: 'row', gap: 9, alignItems: 'center', backgroundColor: colors.cream }}>
        <TextInput
          style={{ flex: 1, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, fontSize: 15, color: colors.ink }}
          value={chatInput}
          onChangeText={actions.setChatInput}
          onSubmitEditing={send}
          placeholder="Ask about money…"
        />
        <Pressable onPress={send} style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 18, color: colors.amber }}>↑</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
