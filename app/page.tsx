import LeadForm from "@/components/LeadForm";
import ProductVisual from "@/components/ProductVisual";
import { site } from "@/lib/site";

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

const functions = [
  { t: "Gilam tozalash", d: "Gilam tukidagi eng mayda chang va qumni chuqur tortib oladi.", i: "M3 18h18M5 18V8l7-4 7 4v10M9 18v-5h6v5" },
  { t: "Divan va mebel", d: "Yumshoq mebel, matras va yostiqlarni changdan tozalaydi.", i: "M4 12V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3M3 12h18v5H3zM5 17v2M19 17v2" },
  { t: "Pol tozalash", d: "Laminat, plitka va parketni tirnalmasdan, silliq tozalaydi.", i: "M4 20h16M6 16l6-12 6 12M9 10h6" },
  { t: "Havo tozalash", d: "Tozalash vaqtida xona havosi ham suv filtridan o'tib yangilanadi.", i: "M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h8" },
];

const compare = [
  ["Chang filtr yoki qopda qoladi, bir qismi havoga qaytadi", "Chang suvda ushlanadi va havoga qaytmaydi"],
  ["Qop va filtrlarni doim almashtirish kerak", "Har safar faqat suvni almashtirasiz"],
  ["Tozalashdan keyin xonada chang hidi qoladi", "Xona havosi tozalanib, yangilanadi"],
  ["Allergiyasi borlar uchun noqulay", "99% gacha chang va allergenlarni yo'q qiladi"],
];

const faq = [
  ["Muddatli to'lov uchun nima kerak?", "Faqat 1 ta pasport. RoboClean Pro'ni 8 oydan 24 oygacha foizsiz bo'lib to'lab xarid qilasiz — ustama yo'q."],
  ["Demonstratsiya haqiqatan bepulmi?", "Ha. Mutaxassisimiz uyingizga kelib, apparatni sizning gilam va mebelingizda ko'rsatadi. Bu sizni hech narsaga majburlamaydi."],
  ["Suv filtri qanday ishlaydi?", "So'rilgan havo suv orqali o'tadi: chang, qum va allergenlar suvda qoladi, toza havo esa xonaga qaytadi. Tozalashdan so'ng suvni to'kib tashlaysiz."],
  ["Allergiyasi bor odamlarga mosmi?", "Ha, aynan shuning uchun tanlashadi: 99% gacha chang va allergenlar suvda ushlanadi va havoga qaytmaydi."],
  ["Servis xizmati bormi?", "Ha. Biz AURA RoboClean'ning O'zbekistondagi rasmiy dileri sifatida servis xizmatini ko'rsatamiz."],
  ["Yetkazib berish bormi?", "Ha, uyingizgacha yetkazib beramiz. Aniq shartlarni operatorimiz qo'ng'iroqda aytib beradi."],
];

export default function Home() {
  return (
    <>
      <header className="topbar">
        <div className="container topbar-in">
          <a href="#" className="logo">
            <span className="logo-mark">A</span>
            <span>
              <b>AURA</b> RoboClean
              <small>Rasmiy diler · O'zbekiston</small>
            </span>
          </a>
          <a href={`tel:${site.phone}`} className="topbar-phone">
            <Icon d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
            <span>{site.phonePretty}</span>
          </a>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="glow g1" />
          <div className="glow g2" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="badge">👑 Siz eng yaxshisiga loyiqsiz</span>
              <h1>
                Uyingizni <em>havosi bilan birga</em> tozalaydigan changyutgich
              </h1>
              <p className="lead">
                AURA RoboClean Pro — suv filtri texnologiyasi: chang suvda ushlanadi va havoga qaytmaydi.
                Gilam, mebel, pol va xona havosi — bitta apparat bilan.
              </p>
              <ul className="hero-points">
                <li><span>✓</span> 99% gacha chang va allergenlar</li>
                <li><span>✓</span> Pasport bilan {site.months} oy foizsiz</li>
                <li><span>✓</span> Uyingizda bepul demonstratsiya</li>
              </ul>
              <div className="hero-cta">
                <a href="#ariza" className="btn btn-primary">Bepul konsultatsiya olish</a>
                <a href={`tel:${site.phone}`} className="btn btn-ghost">Qo'ng'iroq qilish</a>
              </div>
            </div>
            <div className="hero-visual">
              <div className="ring" />
              <ProductVisual />
              <div className="chip chip-a">
                <small>oyiga</small>
                <b>{site.monthly} so'm</b>
                <small>24 oy, foizsiz</small>
              </div>
              <div className="chip chip-b">
                <b>{site.years} yil</b>
                <small>bozorda</small>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="stats">
          <div className="container stats-grid">
            <div><b>{site.years} yil</b><span>dan beri sotuvda</span></div>
            <div><b>99%</b><span>chang va allergen</span></div>
            <div><b>0%</b><span>ustama, {site.months} oy</span></div>
            <div><b>Bepul</b><span>demo va maslahat</span></div>
          </div>
        </section>

        {/* COMPARE */}
        <section className="section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Nega aynan RoboClean Pro?</span>
              <h2>Oddiy changyutgich changni yig'adi. RoboClean uni <em>suvda ushlaydi.</em></h2>
            </div>
            <div className="compare">
              <div className="compare-col bad">
                <h3>Oddiy changyutgich</h3>
                <ul>{compare.map(([a]) => <li key={a}><span>✕</span>{a}</li>)}</ul>
              </div>
              <div className="compare-col good">
                <h3>AURA RoboClean Pro</h3>
                <ul>{compare.map(([, b]) => <li key={b}><span>✓</span>{b}</li>)}</ul>
              </div>
            </div>
          </div>
        </section>

        {/* FUNCTIONS */}
        <section className="section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Ko'p funksiyali tizim</span>
              <h2>Bitta apparat — butun uy uchun</h2>
            </div>
            <div className="cards">
              {functions.map((f) => (
                <article className="card" key={f.t}>
                  <div className="card-ic"><Icon d={f.i} /></div>
                  <h3>{f.t}</h3>
                  <p>{f.d}</p>
                </article>
              ))}
            </div>
            <div className="tags">
              <span>Shovqinsiz</span><span>Kuchli motor</span><span>Zamonaviy dizayn</span>
              <span>Allergiyaga qarshi</span><span>Uy va ofis uchun</span><span>Vaqtingizni tejaydi</span>
            </div>
          </div>
        </section>

        {/* FORM */}
        <section className="section" id="ariza">
          <div className="container form-solo">
            <div className="form-card">
              <h3>Ariza qoldiring</h3>
              <p className="muted small">Operator tez orada siz bilan bog'lanadi</p>
              <LeadForm />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section">
          <div className="container narrow">
            <div className="section-head">
              <span className="eyebrow">Savol-javob</span>
              <h2>Ko'p beriladigan savollar</h2>
            </div>
            <div className="faq">
              {faq.map(([q, a]) => (
                <details key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-in">
          <div>
            <div className="logo"><span className="logo-mark">A</span><span><b>AURA</b> RoboClean</span></div>
            <p className="muted small">{site.tagline}</p>
          </div>
          <div className="footer-links">
            <a href={`tel:${site.phone}`}>{site.phonePretty}</a>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram: @robaclean_aura</a>
          </div>
        </div>
        <div className="container copy">© {new Date().getFullYear()} AURA RoboClean Uzbekistan</div>
      </footer>

      <div className="sticky-cta">
        <a href={`tel:${site.phone}`} className="btn btn-ghost">📞</a>
        <a href="#ariza" className="btn btn-primary">Bepul konsultatsiya olish</a>
      </div>
    </>
  );
}
