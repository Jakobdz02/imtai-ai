import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ar" | "de";

type Dict = Record<string, string>;

const en: Dict = {
  "app.name": "IMTAI",
  "app.tagline": "Interactive Multilingual Tutoring & Assistance Intelligence",
  "nav.settings": "Settings",
  "nav.new": "New consultation",
  "nav.history": "History",
  "nav.clear": "Clear conversations",
  "hero.title": "Your Smart Multilingual AI Advisor",
  "hero.subtitle": "Evidence-based guidance powered by adaptive AI intelligence.",
  "hero.cta": "Start Consultation",
  "hero.scroll": "Choose a domain",
  "categories.title": "Choose your consultation domain",
  "categories.subtitle": "IMTAI adapts her expertise, tone and reasoning to each area.",
  "cat.business.title": "Business & Career",
  "cat.business.desc": "Strategy, leadership, growth and career decisions.",
  "cat.finance.title": "Finance & Investment",
  "cat.finance.desc": "Budgets, savings, investing and risk-aware planning.",
  "cat.relationships.title": "Relationships & Social Life",
  "cat.relationships.desc": "Communication, boundaries and emotional clarity.",
  "cat.personal.title": "Personal Decisions",
  "cat.personal.desc": "Frameworks for hard, life-shaping choices.",
  "cat.education.title": "Education & Self-Development",
  "cat.education.desc": "Learning paths, skills and growth strategies.",
  "cat.health.title": "Health & Lifestyle",
  "cat.health.desc": "Habits, wellness and sustainable lifestyle design.",
  "disclaimer.title": "Before we begin",
  "disclaimer.body":
    "IMTAI provides evidence-based informational guidance using AI — drawing on research, professional frameworks, behavioral science and wellness principles. IMTAI is not a licensed doctor, lawyer, financial advisor or therapist. For critical decisions, please consult a qualified professional.",
  "disclaimer.continue": "Continue",
  "disclaimer.cancel": "Cancel",
  "chat.placeholder": "Ask IMTAI anything…",
  "chat.send": "Send",
  "chat.empty.title": "How can I help you today?",
  "chat.empty.subtitle": "Share your situation and I'll respond with structured, evidence-based guidance.",
  "chat.copy": "Copy",
  "chat.copied": "Copied",
  "chat.regenerate": "Regenerate",
  "chat.thinking": "Thinking…",
  "chat.error": "Something went wrong. Please try again.",
  "chat.rate": "Rate limit reached. Please try again shortly.",
  "chat.credits": "AI credits exhausted. Add credits in Lovable AI settings.",
  "settings.title": "Settings",
  "settings.language": "Language",
  "settings.clear": "Clear all conversations",
  "settings.cleared": "All conversations cleared.",
  "settings.api": "API Configuration",
  "common.close": "Close",
  "common.cancel": "Cancel",
  "sidebar.empty": "No conversations yet",
  "badge.evidence": "Evidence-based",
  "apikey.title": "Google Gemini API Key",
  "apikey.subtitle": "Bring your own key. Stored locally on this device.",
  "apikey.label": "API Key",
  "apikey.helper": "Get your free Gemini API key from Google AI Studio",
  "apikey.save": "Save & Connect",
  "apikey.test": "Test Connection",
  "apikey.saved": "API key saved and verified.",
  "apikey.removed": "API key removed.",
  "apikey.invalid": "Invalid API key. Please double-check it in Google AI Studio.",
  "apikey.invalid_format": "That doesn't look like a Gemini API key.",
  "apikey.empty": "Please enter your API key first.",
  "apikey.test_ok": "Connection successful.",
  "apikey.test_failed": "Could not verify the key. Check your network and try again.",
  "apikey.privacy": "Your key never leaves this device except to call Gemini directly through IMTAI's secure proxy. It is not logged or stored on our servers.",
  "apikey.required": "An API key is required to chat with IMTAI. Add yours in Settings.",
  "apikey.add": "Add API Key",
  "apikey.status.connected": "Connected",
  "apikey.status.invalid": "Invalid Key",
  "apikey.status.missing": "Missing Key",
  "apikey.status.rate": "Rate Limited",
  "apikey.status.error": "Connection Error",
  "apikey.status.checking": "Checking…",
  "apikey.status.unknown": "Not Verified",
  "onboarding.title": "Connect your Gemini API key",
  "onboarding.subtitle": "IMTAI uses your own Google Gemini key so you stay in control of cost, privacy, and quotas.",
  "onboarding.f1.title": "Bring your own key",
  "onboarding.f1.desc": "Free tier available — pay nothing to start.",
  "onboarding.f2.title": "Direct, fast responses",
  "onboarding.f2.desc": "Powered by the latest Gemini models.",
  "onboarding.f3.title": "Private by design",
  "onboarding.f3.desc": "Your key is stored only on this device.",
  "onboarding.cta": "Get a Free Key from Google AI Studio",
};

const ar: Dict = {
  "app.name": "IMTAI",
  "app.tagline": "مستشارك الذكي متعدد اللغات",
  "nav.settings": "الإعدادات",
  "nav.new": "استشارة جديدة",
  "nav.history": "السجل",
  "nav.clear": "مسح المحادثات",
  "hero.title": "مستشارك الذكي متعدد اللغات",
  "hero.subtitle": "إرشادات قائمة على الأدلة بدعم من ذكاء اصطناعي متكيف.",
  "hero.cta": "ابدأ الاستشارة",
  "hero.scroll": "اختر المجال",
  "categories.title": "اختر مجال استشارتك",
  "categories.subtitle": "تتكيف IMTAI في خبرتها وأسلوبها وتفكيرها مع كل مجال.",
  "cat.business.title": "الأعمال والمهنة",
  "cat.business.desc": "الاستراتيجية والقيادة والنمو والقرارات المهنية.",
  "cat.finance.title": "المال والاستثمار",
  "cat.finance.desc": "الميزانيات والادخار والاستثمار والتخطيط الواعي للمخاطر.",
  "cat.relationships.title": "العلاقات والحياة الاجتماعية",
  "cat.relationships.desc": "التواصل والحدود والوضوح العاطفي.",
  "cat.personal.title": "القرارات الشخصية",
  "cat.personal.desc": "أطر للقرارات الصعبة والمصيرية.",
  "cat.education.title": "التعليم والتطوير الذاتي",
  "cat.education.desc": "مسارات التعلم والمهارات واستراتيجيات النمو.",
  "cat.health.title": "الصحة ونمط الحياة",
  "cat.health.desc": "العادات والعافية وتصميم نمط حياة مستدام.",
  "disclaimer.title": "قبل أن نبدأ",
  "disclaimer.body":
    "تقدم IMTAI إرشادات معلوماتية قائمة على الأدلة باستخدام الذكاء الاصطناعي، اعتماداً على الأبحاث والأطر المهنية والعلوم السلوكية ومبادئ العافية. IMTAI ليست طبيبة أو محامية أو مستشارة مالية أو معالجة نفسية مرخصة. للقرارات الحرجة، يرجى استشارة متخصص مؤهل.",
  "disclaimer.continue": "متابعة",
  "disclaimer.cancel": "إلغاء",
  "chat.placeholder": "اسأل IMTAI عن أي شيء…",
  "chat.send": "إرسال",
  "chat.empty.title": "كيف يمكنني مساعدتك اليوم؟",
  "chat.empty.subtitle": "شارك موقفك وسأرد بإرشادات منظمة قائمة على الأدلة.",
  "chat.copy": "نسخ",
  "chat.copied": "تم النسخ",
  "chat.regenerate": "إعادة إنشاء",
  "chat.thinking": "أفكر…",
  "chat.error": "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
  "chat.rate": "تم الوصول إلى حد المعدل. يرجى المحاولة قريباً.",
  "chat.credits": "نفدت رصيدك من الذكاء الاصطناعي.",
  "settings.title": "الإعدادات",
  "settings.language": "اللغة",
  "settings.clear": "مسح جميع المحادثات",
  "settings.cleared": "تم مسح جميع المحادثات.",
  "settings.api": "إعدادات API",
  "common.close": "إغلاق",
  "common.cancel": "إلغاء",
  "sidebar.empty": "لا توجد محادثات بعد",
  "badge.evidence": "قائم على الأدلة",
  "apikey.title": "مفتاح Google Gemini API",
  "apikey.subtitle": "استخدم مفتاحك الخاص. يُخزَّن محلياً على هذا الجهاز.",
  "apikey.label": "مفتاح API",
  "apikey.helper": "احصل على مفتاح Gemini API مجاني من Google AI Studio",
  "apikey.save": "حفظ والاتصال",
  "apikey.test": "اختبار الاتصال",
  "apikey.saved": "تم حفظ المفتاح والتحقق منه.",
  "apikey.removed": "تم حذف المفتاح.",
  "apikey.invalid": "مفتاح غير صالح. تحقق منه في Google AI Studio.",
  "apikey.invalid_format": "هذا لا يبدو كمفتاح Gemini API.",
  "apikey.empty": "يرجى إدخال مفتاحك أولاً.",
  "apikey.test_ok": "تم الاتصال بنجاح.",
  "apikey.test_failed": "تعذر التحقق من المفتاح. تحقق من اتصالك بالشبكة.",
  "apikey.privacy": "لا يغادر مفتاحك هذا الجهاز سوى لاستدعاء Gemini مباشرة. لا نُسجّله أو نُخزّنه على خوادمنا.",
  "apikey.required": "تحتاج إلى مفتاح API للدردشة مع IMTAI. أضف مفتاحك في الإعدادات.",
  "apikey.add": "إضافة مفتاح API",
  "apikey.status.connected": "متصل",
  "apikey.status.invalid": "مفتاح غير صالح",
  "apikey.status.missing": "مفتاح مفقود",
  "apikey.status.rate": "تجاوز الحد",
  "apikey.status.error": "خطأ في الاتصال",
  "apikey.status.checking": "جاري التحقق…",
  "apikey.status.unknown": "غير مُتحقق",
  "onboarding.title": "اربط مفتاح Gemini API الخاص بك",
  "onboarding.subtitle": "تستخدم IMTAI مفتاحك الخاص لتبقى متحكماً في التكلفة والخصوصية.",
  "onboarding.f1.title": "استخدم مفتاحك الخاص",
  "onboarding.f1.desc": "طبقة مجانية متاحة — ابدأ دون أي تكلفة.",
  "onboarding.f2.title": "ردود مباشرة وسريعة",
  "onboarding.f2.desc": "مدعوم بأحدث نماذج Gemini.",
  "onboarding.f3.title": "خصوصية مُصممة",
  "onboarding.f3.desc": "يُخزَّن مفتاحك على هذا الجهاز فقط.",
  "onboarding.cta": "احصل على مفتاح مجاني من Google AI Studio",
};

const de: Dict = {
  "app.name": "IMTAI",
  "app.tagline": "Ihr intelligenter, mehrsprachiger KI-Berater",
  "nav.settings": "Einstellungen",
  "nav.new": "Neue Beratung",
  "nav.history": "Verlauf",
  "nav.clear": "Verläufe löschen",
  "hero.title": "Ihr intelligenter, mehrsprachiger KI-Berater",
  "hero.subtitle": "Evidenzbasierte Beratung mit adaptiver KI-Intelligenz.",
  "hero.cta": "Beratung starten",
  "hero.scroll": "Wählen Sie einen Bereich",
  "categories.title": "Wählen Sie Ihren Beratungsbereich",
  "categories.subtitle": "IMTAI passt Expertise, Tonalität und Argumentation an jeden Bereich an.",
  "cat.business.title": "Beruf & Karriere",
  "cat.business.desc": "Strategie, Führung, Wachstum und Karriereentscheidungen.",
  "cat.finance.title": "Finanzen & Investments",
  "cat.finance.desc": "Budget, Sparen, Investieren und risikobewusste Planung.",
  "cat.relationships.title": "Beziehungen & soziales Leben",
  "cat.relationships.desc": "Kommunikation, Grenzen und emotionale Klarheit.",
  "cat.personal.title": "Persönliche Entscheidungen",
  "cat.personal.desc": "Rahmen für schwierige, lebensprägende Entscheidungen.",
  "cat.education.title": "Bildung & Selbstentwicklung",
  "cat.education.desc": "Lernpfade, Fähigkeiten und Wachstumsstrategien.",
  "cat.health.title": "Gesundheit & Lebensstil",
  "cat.health.desc": "Gewohnheiten, Wohlbefinden und nachhaltiger Lebensstil.",
  "disclaimer.title": "Bevor wir beginnen",
  "disclaimer.body":
    "IMTAI bietet evidenzbasierte, informative Beratung mittels KI – gestützt auf Forschung, fachliche Rahmen, Verhaltenswissenschaft und Wellness-Prinzipien. IMTAI ist keine zugelassene Ärztin, Anwältin, Finanzberaterin oder Therapeutin. Bei kritischen Entscheidungen konsultieren Sie bitte qualifizierte Fachkräfte.",
  "disclaimer.continue": "Fortfahren",
  "disclaimer.cancel": "Abbrechen",
  "chat.placeholder": "Fragen Sie IMTAI alles…",
  "chat.send": "Senden",
  "chat.empty.title": "Wie kann ich Ihnen heute helfen?",
  "chat.empty.subtitle": "Teilen Sie Ihre Situation – Sie erhalten strukturierte, evidenzbasierte Beratung.",
  "chat.copy": "Kopieren",
  "chat.copied": "Kopiert",
  "chat.regenerate": "Neu generieren",
  "chat.thinking": "Denke nach…",
  "chat.error": "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
  "chat.rate": "Ratenlimit erreicht. Bitte später erneut versuchen.",
  "chat.credits": "KI-Guthaben aufgebraucht.",
  "settings.title": "Einstellungen",
  "settings.language": "Sprache",
  "settings.clear": "Alle Verläufe löschen",
  "settings.cleared": "Alle Verläufe gelöscht.",
  "settings.api": "API-Konfiguration",
  "common.close": "Schließen",
  "common.cancel": "Abbrechen",
  "sidebar.empty": "Noch keine Gespräche",
  "badge.evidence": "Evidenzbasiert",
  "apikey.title": "Google Gemini API-Schlüssel",
  "apikey.subtitle": "Verwenden Sie Ihren eigenen Schlüssel. Lokal auf diesem Gerät gespeichert.",
  "apikey.label": "API-Schlüssel",
  "apikey.helper": "Holen Sie sich Ihren kostenlosen Gemini API-Schlüssel im Google AI Studio",
  "apikey.save": "Speichern & verbinden",
  "apikey.test": "Verbindung testen",
  "apikey.saved": "Schlüssel gespeichert und verifiziert.",
  "apikey.removed": "Schlüssel entfernt.",
  "apikey.invalid": "Ungültiger Schlüssel. Bitte im Google AI Studio prüfen.",
  "apikey.invalid_format": "Das sieht nicht wie ein Gemini API-Schlüssel aus.",
  "apikey.empty": "Bitte geben Sie zuerst Ihren Schlüssel ein.",
  "apikey.test_ok": "Verbindung erfolgreich.",
  "apikey.test_failed": "Schlüssel konnte nicht verifiziert werden.",
  "apikey.privacy": "Ihr Schlüssel verlässt dieses Gerät nur, um Gemini direkt aufzurufen. Wir loggen oder speichern ihn nicht.",
  "apikey.required": "Ein API-Schlüssel ist nötig, um mit IMTAI zu chatten. Fügen Sie Ihren Schlüssel in den Einstellungen hinzu.",
  "apikey.add": "API-Schlüssel hinzufügen",
  "apikey.status.connected": "Verbunden",
  "apikey.status.invalid": "Ungültiger Schlüssel",
  "apikey.status.missing": "Schlüssel fehlt",
  "apikey.status.rate": "Ratenlimit",
  "apikey.status.error": "Verbindungsfehler",
  "apikey.status.checking": "Prüfe…",
  "apikey.status.unknown": "Nicht verifiziert",
  "onboarding.title": "Verbinden Sie Ihren Gemini API-Schlüssel",
  "onboarding.subtitle": "IMTAI nutzt Ihren eigenen Gemini-Schlüssel — so behalten Sie Kontrolle über Kosten und Datenschutz.",
  "onboarding.f1.title": "Eigener Schlüssel",
  "onboarding.f1.desc": "Kostenloses Kontingent verfügbar — starten Sie gratis.",
  "onboarding.f2.title": "Schnelle Antworten",
  "onboarding.f2.desc": "Powered by den neuesten Gemini-Modellen.",
  "onboarding.f3.title": "Datenschutz by Design",
  "onboarding.f3.desc": "Ihr Schlüssel bleibt nur auf diesem Gerät.",
  "onboarding.cta": "Kostenlosen Schlüssel im Google AI Studio holen",
};

const dicts: Record<Lang, Dict> = { en, ar, de };

export const langMeta: Record<Lang, { label: string; native: string; dir: "ltr" | "rtl" }> = {
  en: { label: "English", native: "English", dir: "ltr" },
  ar: { label: "Arabic", native: "العربية", dir: "rtl" },
  de: { label: "German", native: "Deutsch", dir: "ltr" },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
};

const I18nContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "imtai.lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) as Lang | null;
    if (saved && dicts[saved]) setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = langMeta[lang].dir;
    }
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  };

  const t = (key: string) => dicts[lang][key] ?? dicts.en[key] ?? key;

  return (
    <I18nContext.Provider value={{ lang, setLang, t, dir: langMeta[lang].dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
