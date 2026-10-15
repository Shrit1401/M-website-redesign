import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "./Motion.jsx";

// Sample café menu for the interactive demo.
const MENU = [
  { id: "cap", name: "Cappuccino", price: 4.5, img: "/images/coffee.jpg", tone: "" },
  { id: "flat", name: "Flat white", price: 4, img: "/images/coffee.jpg", tone: "tone-b" },
  { id: "crs", name: "Butter croissant", price: 3.5, img: "/images/pastry.jpg", tone: "" },
  { id: "pac", name: "Pain au chocolat", price: 4.5, img: "/images/pastry.jpg", tone: "tone-b" },
];
const SOURCES = ["Counter", "Kiosk", "Online"];
const money = (n) => `$${n.toFixed(2)}`;

function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function Demo() {
  const [source, setSource] = useState("Counter");
  const [cart, setCart] = useState({ cap: 1, crs: 1 });
  const [tickets, setTickets] = useState([
    { no: 23, source: "Online", items: [["Flat white", 2]], at: Date.now() - 74000 },
  ]);
  const [next, setNext] = useState(24);
  const now = useNow();

  const lines = MENU.filter((m) => cart[m.id] > 0);
  const total = lines.reduce((s, m) => s + m.price * cart[m.id], 0);

  const add = (id, n = 1) => setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] || 0) + n) }));
  const charge = () => {
    if (!lines.length) return;
    setTickets((t) => [...t, { no: next, source, items: lines.map((m) => [m.name, cart[m.id]]), at: Date.now() }].slice(-3));
    setNext((n) => n + 1);
    setCart({});
  };
  const ready = (no) => setTickets((t) => t.filter((x) => x.no !== no));

  return (
    <div className="demo">
      <div className="demo-bar">
        <span className="demo-shop">The Daily Grind · Main St</span>
        <div className="demo-sources" role="tablist" aria-label="Order channel">
          {SOURCES.map((s) => (
            <button key={s} role="tab" aria-selected={source === s} className={source === s ? "is-on" : ""} onClick={() => setSource(s)}>
              {s}
            </button>
          ))}
        </div>
        <span className="demo-live"><i /> Live</span>
      </div>

      <div className="demo-body">
        <div className="demo-menu">
          <p className="mono-label">Menu · tap to add</p>
          <div className="demo-tiles">
            {MENU.map((m) => (
              <button key={m.id} className="demo-tile" onClick={() => add(m.id)} aria-label={`Add ${m.name}`}>
                <img src={m.img} alt="" className={m.tone} loading="lazy" />
                <span>{m.name}</span>
                <small>{money(m.price)}</small>
                {cart[m.id] > 0 && <em className="demo-badge">{cart[m.id]}</em>}
              </button>
            ))}
          </div>
        </div>

        <div className="demo-order">
          <p className="mono-label">Order #{String(next).padStart(4, "0")} · {source}</p>
          <ul className="demo-lines">
            <AnimatePresence initial={false}>
              {lines.map((m) => (
                <motion.li key={m.id} layout initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <span className="demo-qty">
                    <button onClick={() => add(m.id, -1)} aria-label={`Remove one ${m.name}`}>−</button>
                    {cart[m.id]}
                    <button onClick={() => add(m.id)} aria-label={`Add one ${m.name}`}>+</button>
                  </span>
                  <span>{m.name}</span>
                  <span>{money(m.price * cart[m.id])}</span>
                </motion.li>
              ))}
            </AnimatePresence>
            {!lines.length && <li className="demo-empty">Tap an item to start an order.</li>}
          </ul>
          <button className="demo-charge" onClick={charge} disabled={!lines.length}>
            <span>Charge</span>
            <span>{money(total)}</span>
          </button>
        </div>

        <div className="demo-kds">
          <p className="mono-label">Kitchen display</p>
          <div className="demo-tickets">
            <AnimatePresence initial={false}>
              {tickets.map((t) => {
                const secs = Math.max(0, Math.floor((now - t.at) / 1000));
                return (
                  <motion.div
                    key={t.no}
                    layout
                    className={`demo-ticket ${secs > 60 ? "is-late" : ""}`}
                    initial={{ opacity: 0, x: -30, rotate: -2 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    <div className="demo-ticket-top">
                      <strong>#{String(t.no).padStart(4, "0")}</strong>
                      <span>{t.source}</span>
                      <time>{Math.floor(secs / 60)}:{String(secs % 60).padStart(2, "0")}</time>
                    </div>
                    <ul>
                      {t.items.map(([n, q]) => <li key={n}>{q} × {n}</li>)}
                    </ul>
                    <button onClick={() => ready(t.no)}>Mark ready</button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {!tickets.length && <p className="demo-empty">All caught up.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
