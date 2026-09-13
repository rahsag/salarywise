import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import ScreenTransition from '../components/ScreenTransition';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

function Paragraph({ children }: { children: string }) {
  return <Text style={{ fontSize: 13.5, color: colors.inkMuted, lineHeight: 20.5, marginTop: 14 }}>{children}</Text>;
}

export default function DisclaimerScreen() {
  const navigation = useNavigation<any>();
  const [agreed, setAgreed] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <ScreenTransition style={{ padding: 26, paddingTop: 18, paddingBottom: 16 }}>
          <Text style={{ fontFamily: fonts.serifSemiBold, fontSize: 26, color: colors.ink }}>Before you continue</Text>
          <Text style={{ fontSize: 14, color: colors.inkMuted, marginTop: 6 }}>Please read this disclaimer.</Text>

          <Paragraph>
            This application uses artificial intelligence to provide information and generate responses. AI-generated content may
            occasionally be inaccurate, incomplete, or outdated. Users should independently verify important information and should
            not rely solely on the application's responses for financial, medical, legal, or other high-stakes decisions.
          </Paragraph>
          <Paragraph>
            Payments made through the application are processed securely through Razorpay. The application does not store users'
            complete payment card, UPI, or banking credentials. Payment-related information is handled in accordance with the
            policies of the applicable payment service provider.
          </Paragraph>
          <Paragraph>
            By using this application, you acknowledge that you are responsible for how you use the information and services
            provided through it. The developers are not responsible for losses or damages resulting from reliance on AI-generated
            information or misuse of the application.
          </Paragraph>
          <Paragraph>
            For questions, issues, or concerns regarding the application, please contact the support team through the contact
            information provided on the application's Play Store listing.
          </Paragraph>
        </ScreenTransition>
      </ScrollView>

      <View style={{ padding: 26, paddingTop: 14, backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.borderCard }}>
        <Pressable
          onPress={() => setAgreed((v) => !v)}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
        >
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              borderWidth: 1.5,
              borderColor: agreed ? colors.green : colors.border,
              backgroundColor: agreed ? colors.green : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {agreed && <Text style={{ color: colors.cream, fontSize: 13, fontWeight: '800' }}>✓</Text>}
          </View>
          <Text style={{ fontSize: 13, color: colors.ink, flex: 1, lineHeight: 18 }}>I have read and agree to the disclaimer above.</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('VerifyEmail')}
          disabled={!agreed}
          style={{
            width: '100%',
            marginTop: 16,
            backgroundColor: colors.green,
            borderRadius: 16,
            padding: 16,
            alignItems: 'center',
            opacity: agreed ? 1 : 0.45,
          }}
        >
          <Text style={{ color: colors.cream, fontSize: 15, fontWeight: '700' }}>Accept & Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}
