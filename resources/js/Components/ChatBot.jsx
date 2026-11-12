import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const welcomeMessage = 'Xin chào! Mình là trợ lý P-Guitar. Mình có thể giúp bạn tìm đàn, kiểm tra giá và tồn kho, hoặc tìm hiểu chính sách của shop.';
const suggestions = ['Tư vấn guitar acoustic', 'Chính sách bảo hành', 'Chính sách giao hàng'];

export default function ChatBot() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([{ id: 'welcome', user: null, bot: welcomeMessage }]);
  const [isSending, setIsSending] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending, isOpen]);

  const send = async (text = message) => {
    const question = text.trim();
    if (!question || isSending) return;

    const messageId = `${Date.now()}-${Math.random()}`;
    setMessages((current) => [...current, { id: messageId, user: question, bot: null }]);
    setMessage('');
    setIsSending(true);

    try {
      const response = await axios.post('/api/chatbot', { message: question });
      setMessages((current) => current.map((item) => (
        item.id === messageId ? { ...item, bot: response.data.answer } : item
      )));
    } catch (error) {
      console.error('Không thể gửi câu hỏi tới chatbot.', error);
      const validationMessage = error.response?.data?.errors?.message?.[0];
      const responseMessage = error.response?.data?.message;
      setMessages((current) => current.map((item) => (
        item.id === messageId
          ? { ...item, bot: validationMessage || responseMessage || 'Mình chưa thể trả lời lúc này. Bạn vui lòng thử lại sau nhé.' }
          : item
      )));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <aside className="fixed bottom-5 right-5 z-50 flex w-80 max-w-[calc(100vw-2.5rem)] flex-col items-end gap-3" aria-label="Trợ lý tư vấn P-Guitar">
      {isOpen && (
        <section className="flex max-h-[min(34rem,calc(100vh-7rem))] w-full flex-col overflow-hidden border border-[#D4AF37]/40 bg-[#111111] text-[#F4F0E8] shadow-2xl shadow-black/50" aria-label="Cửa sổ trò chuyện">
          <header className="flex items-center justify-between border-b border-white/10 bg-[#151515] px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center border border-[#D4AF37]/50 font-serif text-lg text-[#D4AF37]" aria-hidden="true">P</span>
              <div>
                <h2 className="text-sm font-semibold">Trợ lý P-Guitar</h2>
                <p className="mt-0.5 text-[10px] text-emerald-400">Đang sẵn sàng hỗ trợ</p>
              </div>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Thu nhỏ khung chat" className="px-2 py-1 text-lg text-[#9B9B9B] transition hover:text-[#D4AF37]">
              −
            </button>
          </header>

          <div className="min-h-40 flex-1 space-y-4 overflow-y-auto p-4 text-sm" aria-live="polite">
            {messages.map((item) => (
              <div key={item.id} className="space-y-3">
                {item.user && (
                  <p className="ml-auto w-fit max-w-[90%] bg-[#D4AF37] px-3 py-2 text-right text-xs leading-5 text-black">
                    {item.user}
                  </p>
                )}
                {item.bot && (
                  <p className="w-fit max-w-[95%] whitespace-pre-line border border-white/10 bg-[#1B1B1B] px-3 py-2 text-xs leading-5 text-[#E6E0D2]">
                    {item.bot}
                  </p>
                )}
              </div>
            ))}

            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    disabled={isSending}
                    className="border border-[#D4AF37]/40 px-2.5 py-1.5 text-left text-[10px] text-[#D4AF37] transition hover:bg-[#D4AF37]/10 disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {isSending && (
              <p className="w-fit border border-white/10 bg-[#1B1B1B] px-3 py-2 text-xs text-[#9B9B9B]" role="status">
                Đang tìm câu trả lời...
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            className="flex gap-2 border-t border-white/10 bg-[#151515] p-3"
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
          >
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={500}
              aria-label="Nhập câu hỏi"
              placeholder="Bạn cần hỗ trợ gì?"
              className="min-w-0 flex-1 border border-white/15 bg-[#0B0B0B] px-3 py-2 text-xs text-[#F4F0E8] outline-none placeholder:text-[#777] focus:border-[#D4AF37]"
            />
            <button
              type="submit"
              disabled={!message.trim() || isSending}
              className="bg-[#D4AF37] px-4 py-2 text-xs font-bold text-black transition hover:bg-[#E6C76A] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSending ? '...' : 'Gửi'}
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Thu nhỏ trò chuyện' : 'Mở trò chuyện với P-Guitar'}
        aria-expanded={isOpen}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D4AF37]/60 bg-[#111111] text-xl text-[#D4AF37] shadow-xl transition hover:scale-105 hover:bg-[#1B1B1B]"
      >
        {isOpen ? '×' : '✦'}
      </button>
    </aside>
  );
}
