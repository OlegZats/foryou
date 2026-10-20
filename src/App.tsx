import { useState } from "react";
import type { AnimationEvent } from "react";
import { motion } from "framer-motion";
import { supabase } from "./lib/supabase";
import "./App.css";
import "../src/App.animation.css";

type Page = "home" | "memories" | "question" | "date" | "done";
type Answer = "yes" | "no";

const memories = [
  {
    title: "Твоя усмішка",
    emoji: "🌷",
    text: "Твоя усмішка робить навіть звичайний день особливим. Хочу бачити її частіше.",
  },
  {
    title: "Наші розмови",
    emoji: "💌",
    text: "Мені подобається слухати тебе, говорити з тобою й дізнаватися про тебе щось нове.",
  },
  {
    title: "Моє бажання",
    emoji: "✨",
    text: "Хочу створювати з тобою нові спогади, сміятися разом і ходити на побачення.",
  },
];

const ideas = [
  "🌅 Прогулянка на заході сонця",
  "☕ Затишне кафе",
  "🍿 Кіно та смаколики",
  "🧺 Пікнік удвох",
  "🎁 Нехай буде сюрприз",
  "♨️ Термальні джерела",
  "📝 Щось зовсім інше (напиши в побажаннях)",
];

const noButtonMessages = [
  "Ні 🙈",
  "Ти добре подумала? 🥺",
  "Серйозно? 🥹",
  "Може, ще раз подумаєш? 💗",
  "А раптом усе-таки «Так»? 🌷",
  "Дай мені ще один шанс? 💌",
  "Я ще трішки сподіваюся... 🥹",
  "Останній раз питаю: точно ні? ❤️",
  "Якщо точно ні — відповідь нижче ↓",
];

// Common forms of the word "love" from many languages.
const loveWords = [
  "love",
  "amor",
  "amour",
  "amore",
  "Liebe",
  "любов",
  "кохання",
  "אהבה",
  "حب",
  "ishq",
  "pyaar",
  "प्रेम",
  "sevgi",
  "aşk",
  "ljubav",
  "láska",
  "szeretet",
  "liefde",
  "kärlek",
  "rakkaus",
  "cinta",
  "愛",
  "恋",
  "사랑",
  "愛情",
  "爱",
  "miłość",
  "ljubezen",
  "iubire",
  "agápi",
  "αγάπη",
  "dashuri",
  "upendo",
  "uthando",
  "ìfẹ́",
  "aroha",
  "aloha",
  "grá",
  "cariad",
  "maitasuna",
  "meilė",
  "mīlestība",
  "ágape",
  "amo",
  "Սեր",
  "сүйүү",
  "махаббат",
  "sevgi",
  "محبة",
  "عشق",
  "محبت",
  "प्रेम",
  "ভালোবাসা",
  "காதல்",
  "ความรัก",
  "tình yêu",
  "pag-ibig",
  "愛してる",
  "사랑해",
  "我爱你",
  "愛してる",
  "te amo",
  "ti amo",
  "je t'aime",
  "ich liebe",
  "ya tebya",
  "mon amour",
  "mon cœur",
  "canım",
  "habibi",
];

const heartBands = [
  {
    y: 8,
    ranges: [
      { from: 22, to: 42, count: 3 },
      { from: 58, to: 78, count: 3 },
    ],
  },
  {
    y: 16,
    ranges: [
      { from: 14, to: 44, count: 4 },
      { from: 56, to: 86, count: 4 },
    ],
  },
  { y: 24, ranges: [{ from: 7, to: 93, count: 9 }] },
  { y: 32, ranges: [{ from: 3, to: 97, count: 11 }] },
  { y: 40, ranges: [{ from: 2, to: 98, count: 12 }] },
  { y: 48, ranges: [{ from: 4, to: 96, count: 12 }] },
  { y: 56, ranges: [{ from: 9, to: 91, count: 11 }] },
  { y: 64, ranges: [{ from: 16, to: 84, count: 9 }] },
  { y: 72, ranges: [{ from: 24, to: 76, count: 7 }] },
  { y: 80, ranges: [{ from: 32, to: 68, count: 5 }] },
  { y: 87, ranges: [{ from: 39, to: 61, count: 4 }] },
  { y: 93, ranges: [{ from: 46, to: 54, count: 2 }] },
];

const heartWordsLayout = heartBands.flatMap((band, rowIndex) =>
  band.ranges.flatMap((range, rangeIndex) =>
    Array.from({ length: range.count }, (_, index) => {
      const seed = (rowIndex + 1) * 13 + (rangeIndex + 1) * 7 + (index + 1) * 5;

      return {
        x:
          range.from +
          ((index + 0.5) / range.count) * (range.to - range.from) +
          Math.sin(seed * 1.31) * 1.15,
        y: band.y + Math.cos(seed * 1.77) * 1.1,
        tilt: Math.sin(seed * 0.93) * 10,
      };
    }),
  ),
);

function LoveHeartAnimation() {
  return (
    <section className="love-heart-section" aria-labelledby="love-heart-title">
      <p className="love-heart-eyebrow">ОДНЕ ПОЧУТТЯ - БАГАТО МОВ</p>
      <div
        className="love-heart-grid"
        role="img"
        aria-label="Серце, складене зі слів про любов різними мовами світу"
      >
        {heartWordsLayout.map((item, index) => (
          <span
            className="love-heart-position"
            key={index}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `translate(-50%, -50%) rotate(${item.tilt}deg)`,
            }}
          >
            <span
              className="love-heart-word"
              style={{ animationDelay: `${index * 45}ms` }}
              lang="mul"
            >
              {loveWords[index % loveWords.length]}
            </span>
          </span>
        ))}
      </div>

      <p className="love-heart-signoff">
        Найважливіше завжди відчувається серцем. ♡
      </p>
    </section>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [opened, setOpened] = useState<number[]>([]);
  const [choice, setChoice] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("16:00");
  const [note, setNote] = useState("");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [noAttempts, setNoAttempts] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isOpeningLetter, setIsOpeningLetter] = useState(false);

  function escapeNo() {
    const isMobile = window.innerWidth <= 560;

    const maxX = isMobile ? 42 : 90;
    const maxY = isMobile ? 24 : 50;

    setNoPosition({
      x: Math.round(Math.random() * maxX * 2 - maxX),
      y: Math.round(Math.random() * maxY * 2 - maxY),
    });
  }

  function finishLetterAnimation(event: AnimationEvent<HTMLDivElement>) {
    if (
      event.target !== event.currentTarget ||
      event.animationName !== "letter-scene-finish"
    ) {
      return;
    }
    setPage("memories");
    setIsOpeningLetter(false);
  }

  async function saveResponse(value: Answer) {
    setSaving(true);
    setError("");

    try {
      const { data, error: requestError } = await supabase.functions.invoke(
        "submit-response",
        {
          body: {
            answer: value,
            date_choice: value === "yes" ? choice : null,
            date_option: value === "yes" && date ? date : null,
            time_option: value === "yes" ? time : null,
            note: note.trim() || null,
            website: "",
          },
        },
      );

      if (requestError) throw requestError;
      if (!data?.ok) {
        throw new Error(data?.error || "Не вдалося зберегти відповідь");
      }

      setAnswer(value);
      setPage("done");
    } catch (err) {
      console.error(err);
      setError("Не вдалося зберегти відповідь. Спробуй пізніше.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="app">
      <div className="glow glow-one" />
      <div className="glow glow-two" />

      <header className="topbar">
        <span className="brand">♡ for you</span>
        <span className="top-note">маленька історія про нас</span>
      </header>

      <section className="content">
        {page === "home" && (
          <motion.div
            className="panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="illustration">💌</div>
            <p className="eyebrow">ОДИН ОСОБЛИВИЙ ЛИСТ</p>
            <h1>
              Привіт, <span>красуне</span> ✨
            </h1>
            <p className="description">
              Я підготував для тебе дещо особливе. Тут є слова, які мені давно
              хотілося сказати. Тож влаштовуйся зручніше ❤️
            </p>
            <button
              className="primary"
              disabled={isOpeningLetter}
              onClick={() => setIsOpeningLetter(true)}
            >
              {isOpeningLetter ? (
                "Відкриваю лист…"
              ) : (
                <>
                  Відкрити лист <span>→</span>
                </>
              )}
            </button>
            <p className="tiny">створено з теплом і трішки хвилюванням</p>
          </motion.div>
        )}

        {page === "memories" && (
          <motion.div
            className="panel wide"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="eyebrow">КІЛЬКА СЛІВ ПРО ТЕБЕ</p>
            <h1>
              Чому ти для мене <span>особлива?</span>
            </h1>
            <p className="description">
              Я міг би довго розповідати. Почнемо з цих трьох маленьких зізнань.
            </p>

            <div className="memory-grid">
              {memories.map((item, index) => {
                const isOpen = opened.includes(index);

                return (
                  <button
                    className={`memory-card ${isOpen ? "opened" : ""}`}
                    key={item.title}
                    onClick={() =>
                      setOpened((old) =>
                        isOpen
                          ? old.filter((n) => n !== index)
                          : [...old, index],
                      )
                    }
                  >
                    <span className="memory-emoji">
                      {isOpen ? "💗" : item.emoji}
                    </span>
                    <strong>{item.title}</strong>
                    <span className="memory-text">
                      {isOpen ? item.text : "Натисни, щоб прочитати"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="poem">
              <p className="eyebrow">КІЛЬКА РЯДКІВ ДЛЯ ТЕБЕ</p>
              <p>
                Мне так тепло с тобою рядом,
                <br />
                В твоих словах - уют и свет.
                <br />
                Понять без слов, коснуться взглядом -
                <br />
                Дороже счастья в мире нет.
                <br />
                Твоя улыбка - словно утро,
                <br />
                В озерах безмятежных глаз
                <br />
                Мерцает искренне и мудро
                <br />
                Души сиянье без прикрас.
                <br />
                Как ценно быть с тобою вместе,
                <br />
                Без лишних слов все понимать.
                <br />
                Без обещаний и без лести,
                <br />
                А сердцем сердце обнимать.
                <br />
                И ничего просить не надо,
                <br />
                Лишь быть в присутствии твоём.
                <br />
                Ведь ты - души моей отрада,
                <br />
                Как тихой ночью, так и днём.
                <br />
              </p>
              <small>❤️</small>
            </div>

            <button className="primary" onClick={() => setPage("question")}>
              Є ще дещо важливе <span>→</span>
            </button>
          </motion.div>
        )}

        {page === "question" && (
          <motion.div
            className="panel question-panel"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="illustration">💗</div>
            <p className="eyebrow">МОЄ НАЙВАЖЛИВІШЕ ЗАПИТАННЯ</p>
            <h1>
              Будеш моєю <span>дівчиною?</span>
            </h1>
            <p className="description">
              Я хочу проводити з тобою більше часу, ділитися моментами й робити
              тебе щасливою. І дуже хочу знати, чи відчуваєш ти те саме.
            </p>

            <div className="button-area">
              <button
                className="primary yes-button"
                onClick={() => setPage("date")}
              >
                Так! ❤️
              </button>

              <button
                className="secondary no-button"
                style={{
                  transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
                }}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") {
                    escapeNo();
                  }
                }}
                onClick={() => {
                  setNoAttempts((current) =>
                    Math.min(current + 1, noButtonMessages.length - 1),
                  );
                  escapeNo();
                }}
              >
                {noButtonMessages[noAttempts]}
              </button>
            </div>

            <button
              className="honest-no"
              disabled={saving}
              onClick={() => saveResponse("no")}
            >
              Якщо твоя відповідь остаточно «Ні» — натисни тут ❤️
            </button>

            {error && <p className="error">{error}</p>}
          </motion.div>
        )}

        {page === "date" && (
          <motion.div
            className="panel wide"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="illustration">🥹❤️</div>
            <p className="eyebrow">ТОДІ ВЛАШТУЄМО ЩОСЬ ОСОБЛИВЕ</p>
            <h1>
              Наше наступне <span>побачення</span>
            </h1>
            <p className="description">
              Обирай, що тобі подобається. Усі деталі ще можемо узгодити разом.
            </p>

            <div className="date-grid">
              {ideas.map((idea) => (
                <button
                  key={idea}
                  className={`date-card ${choice === idea ? "selected" : ""}`}
                  onClick={() => setChoice(idea)}
                >
                  {idea}
                </button>
              ))}
            </div>

            <div className="field">
              <label htmlFor="date">Бажана дата</label>
              <input
                id="date"
                type="date"
                min={new Date().toLocaleDateString("en-CA")}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="time">Бажаний час</label>
              <select
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                <option value="12:00">12:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="note">Побажання або твоя ідея</label>
              <textarea
                id="note"
                maxLength={1000}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Є дещо, що я хотіла б..."
              />
            </div>

            <button
              className="primary"
              disabled={saving || !choice}
              onClick={() => saveResponse("yes")}
            >
              {saving ? "Зберігаю..." : "Домовились! ❤️"}
            </button>

            <button className="back-button" onClick={() => setPage("question")}>
              Повернутися до запитання
            </button>

            {error && <p className="error">{error}</p>}
          </motion.div>
        )}

        {page === "done" && (
          <motion.div
            className={`panel ${answer === "yes" ? "done-panel-love" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="illustration">{answer === "yes" ? "💖" : "💌"}</div>
            <p className="eyebrow">ДЯКУЮ ЗА ТВОЮ ВІДПОВІДЬ</p>
            <h1>
              {answer === "yes" ? (
                <>
                  Це початок чогось <span>особливого!</span>
                </>
              ) : (
                <>
                  Дякую за <span>щирість.</span>
                </>
              )}
            </h1>
            <p className="description">
              {answer === "yes"
                ? "Я вже усміхаюся. Нехай у нас буде багато приводів бути щасливими разом. ❤️"
                : "Я поважаю твою відповідь. Дякую, що відповіла щиро. ❤️"}
            </p>
            <div className="floating-hearts">♡ ♥ ♡ ♥ ♡</div>
            {answer === "yes" && <LoveHeartAnimation />}
          </motion.div>
        )}
      </section>

      <footer>зроблено з ❤️ спеціально для тебе</footer>

      {isOpeningLetter && (
        <div
          className="letter-opening-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Відкривається лист для тебе"
        >
          <div className="letter-opening-backdrop" />
          <div
            className="letter-opening-scene"
            onAnimationEnd={finishLetterAnimation}
          >
            <p className="letter-opening-kicker">
              МАЛЕНЬКИЙ ЛИСТ - ВЕЛИКІ ПОЧУТТЯ
            </p>
            <div className="letter-opening-envelope" aria-hidden="true">
              <div className="letter-opening-paper">
                <span className="paper-heart">♡</span>
                <span className="paper-line paper-line-long" />
                <span className="paper-line" />
                <span className="paper-line paper-line-short" />
                <span className="paper-signature">для тебе</span>
              </div>
              <div className="letter-envelope-pocket" />
              <div className="letter-envelope-front" />
              <div className="letter-envelope-flap" />
              <div className="letter-envelope-seal">♡</div>
            </div>
            <p className="letter-opening-caption">
              З любов’ю, від усього серця…
            </p>
            <div className="letter-opening-sparkles" aria-hidden="true">
              <span>♡</span>
              <span>✦</span>
              <span>♥</span>
              <span>✧</span>
              <span>♡</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
