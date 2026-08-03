import type { ChatMessage } from '../lib/types';
import type { SalaryWiseActions } from '../lib/useSalaryWise';

interface CoachScreenProps {
  chat: ChatMessage[];
  chatInput: string;
  coachTyping: boolean;
  actions: SalaryWiseActions;
}

const CHIPS = ['New or old tax regime?', 'How much home can I afford?', 'Am I saving enough?'];

export default function CoachScreen({ chat, chatInput, coachTyping, actions }: CoachScreenProps) {
  const send = () => actions.sendChat(chatInput);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 'none', padding: '6px 22px 14px', background: '#f6f1e7', borderBottom: '1px solid #ece3d1', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => actions.go('dashboard')} style={{ background: 'none', border: 'none', fontSize: 22, color: '#2b2618', cursor: 'pointer', padding: 0 }}>
          ←
        </button>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#2f4a34', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#e9a23b' }}>✦</div>
        <div>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 600, color: '#2b2618' }}>Money Coach</div>
          <div style={{ fontSize: 11, color: '#5a7d4f', fontWeight: 600 }}>● Online · rule-based demo</div>
        </div>
      </div>

      <div className="sw-scroll" style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {chat.map((m, i) =>
          m.role === 'user' ? (
            <div
              key={i}
              className="sw-msg"
              style={{ alignSelf: 'flex-end', maxWidth: '80%', background: '#2f4a34', color: '#f4f0e6', border: 'none', padding: '11px 14px', borderRadius: 16, fontSize: 13.5, lineHeight: 1.5, borderBottomRightRadius: 5 }}
            >
              {m.text}
            </div>
          ) : (
            <div
              key={i}
              className="sw-msg"
              style={{ alignSelf: 'flex-start', maxWidth: '80%', background: '#fff', color: '#2b2618', border: '1px solid #ece3d1', padding: '11px 14px', borderRadius: 16, fontSize: 13.5, lineHeight: 1.5, borderBottomLeftRadius: 5 }}
            >
              {m.text}
            </div>
          )
        )}
        {coachTyping && (
          <div style={{ alignSelf: 'flex-start', background: '#fff', border: '1px solid #ece3d1', padding: '12px 16px', borderRadius: 16, fontSize: 15, color: '#9a8f78' }}>•••</div>
        )}
      </div>

      <div style={{ flex: 'none', padding: '6px 14px 4px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => actions.sendChat(c)}
            style={{ flex: 'none', whiteSpace: 'nowrap', border: '1px solid #e0d6c2', background: '#fffdf8', color: '#5a7d4f', borderRadius: 20, padding: '8px 13px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            {c}
          </button>
        ))}
      </div>

      <div style={{ flex: 'none', padding: '10px 16px 16px', display: 'flex', gap: 9, alignItems: 'center', background: '#f6f1e7' }}>
        <input
          className="sw-ti"
          style={{ flex: 1, borderRadius: 22, padding: '12px 16px' }}
          value={chatInput}
          onChange={(e) => actions.setChatInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') send();
          }}
          placeholder="Ask about money…"
        />
        <button onClick={send} style={{ width: 46, height: 46, flex: 'none', borderRadius: '50%', background: '#2f4a34', color: '#e9a23b', border: 'none', fontSize: 18, cursor: 'pointer' }}>
          ↑
        </button>
      </div>
    </div>
  );
}
