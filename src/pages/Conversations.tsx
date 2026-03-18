import React, { useEffect, useState, useRef } from 'react';
import { getConversations, getMessages, sendMessage, markAsRead } from '../services/api';
import Loader from '../components/Loader';

const Conversations = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // La Ref est la clé : elle stocke le temps sans relancer le composant
  const lastTimestampRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Chargement initial des conversations (One shot)
  useEffect(() => {
    getConversations()
      .then(convs => {
        setConversations(convs);
        if (window.innerWidth >= 768 && convs.length > 0 && !activeConv) {
          setActiveConv(convs[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 2. Gestion du Polling Intelligent & Sync
  useEffect(() => {
    if (!activeConv) return;

    // Reset au changement de conversation pour éviter les flashs d'anciens messages
    setMessages([]);
    lastTimestampRef.current = null;

    // Fetch initial de la conversation sélectionnée
    const initChat = async () => {
      try {
        const msgs = await getMessages(activeConv.id);
        setMessages(msgs);
        if (msgs.length > 0) {
          lastTimestampRef.current = msgs[msgs.length - 1].created_at;
        }
        await markAsRead(activeConv.id);
      } catch (err) {
        console.error("Erreur init:", err);
      }
    };

    initChat();

    // Polling toutes les 3s avec Delta-Fetch
    const interval = setInterval(async () => {
      try {
        const newMsgs = await getMessages(activeConv.id, lastTimestampRef.current || undefined);

        if (newMsgs && newMsgs.length > 0) {
          setMessages(prev => {
            // Sécurité anti-doublons (si l'envoi manuel et le polling se croisent)
            const filtered = newMsgs.filter((nM: any) => !prev.some(pM => pM.id === nM.id));
            if (filtered.length === 0) return prev;

            const updated = [...prev, ...filtered];
            // On met à jour la Ref avec le timestamp du tout dernier message
            lastTimestampRef.current = updated[updated.length - 1].created_at;
            return updated;
          });

          // On prévient le serveur que c'est lu
          markAsRead(activeConv.id);
        }
      } catch (e) {
        console.error("Sync error:", e);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeConv?.id]); // On ne redéclenche que si l'ID de la conv change

  // Scroll automatique
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv) return;

    try {
      const msg = await sendMessage(activeConv.id, newMessage);
      // UI Optimiste : on ajoute direct
      setMessages(prev => [...prev, msg]);
      lastTimestampRef.current = msg.created_at;
      setNewMessage('');
    } catch (err) {
      console.error("Erreur envoi:", err);
    }
  };

  if (loading) return <Loader />;

  return (
    <main className="min-h-screen bg-[#141210] text-[#EFEBE4] pt-20 pb-32 px-4 md:px-10 flex border-t border-[#C5A059]/20 font-serif">
      <div className="w-full max-w-6xl mx-auto flex h-[75vh] bg-[#1A1816] shadow-2xl border border-[#C5A059]/30 rounded-sm overflow-hidden">

        {/* LISTE DES CONVERSATIONS */}
        <div className={`w-full md:w-1/3 border-r border-[#C5A059]/20 flex flex-col ${activeConv ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-[#C5A059]/20 text-center">
            <h2 className="text-xl italic text-[#C5A059] tracking-widest uppercase">Correspondencia</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => setActiveConv(conv)}
                className={`p-4 border-b border-[#C5A059]/10 cursor-pointer transition-all duration-500 flex items-center gap-4 ${activeConv?.id === conv.id ? 'bg-[#C5A059]/10' : 'hover:bg-[#C5A059]/5'}`}
              >
                <img
                  src={conv.peer_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.peer_name)}&background=141210&color=C5A059`}
                  className="w-12 h-12 rounded-full object-cover border border-[#C5A059]/30 grayscale hover:grayscale-0 transition-all duration-700"
                  alt="Avatar"
                />
                <div>
                  <h3 className="text-sm tracking-[0.1em] text-[#C5A059] uppercase">{conv.peer_name}</h3>
                  <p className="text-[9px] text-stone-500 tracking-widest uppercase mt-1">{conv.peer_major}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MESSAGERIE */}
        <div className={`w-full md:w-2/3 flex flex-col relative ${!activeConv ? 'hidden md:flex items-center justify-center opacity-20' : 'flex'}`}>
          {!activeConv ? (
            <div className="text-center italic tracking-widest text-[#C5A059]">The Vault - Seleccione un enlace</div>
          ) : (
            <>
              <div className="p-4 border-b border-[#C5A059]/20 bg-[#141210] flex items-center gap-4">
                <button onClick={() => setActiveConv(null)} className="md:hidden text-[#C5A059] text-[10px] tracking-widest uppercase">&lt; Volver</button>
                <h3 className="text-xs tracking-[0.3em] text-[#EFEBE4] uppercase">{activeConv.peer_name}</h3>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#1A1816]/50">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.is_mine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`relative max-w-[80%] p-4 text-[13px] tracking-wide border ${msg.is_mine ? 'bg-[#C5A059]/10 border-[#C5A059]/30 text-[#C5A059]' : 'bg-[#141210] border-stone-800 text-[#EFEBE4]'}`}>
                      <p className="font-sans font-light leading-relaxed">{msg.content}</p>

                      {msg.is_mine && (
                        <div className="absolute -bottom-5 right-0 flex items-center gap-2">
                          <span className={`text-[7px] uppercase tracking-[0.2em] transition-all duration-1000 ${msg.is_read ? 'text-[#C5A059] opacity-100' : 'text-stone-600 opacity-40'}`}>
                            {msg.is_read ? 'Leído' : 'Enviado'}
                          </span>
                          <div className={`w-1 h-1 rounded-full transition-all duration-1000 ${msg.is_read ? 'bg-[#C5A059] shadow-[0_0_8px_#C5A059]' : 'bg-stone-600'}`} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="p-6 border-t border-[#C5A059]/20 bg-[#141210] flex gap-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribir misiva..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-xs tracking-widest text-[#EFEBE4] placeholder:text-stone-700 font-sans"
                />
                <button type="submit" disabled={!newMessage.trim()} className="px-8 py-3 bg-[#C5A059]/10 border border-[#C5A059]/40 text-[#C5A059] text-[9px] tracking-[0.3em] uppercase hover:bg-[#C5A059] hover:text-[#141210] transition-all disabled:opacity-20">
                  Enviar
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Conversations;