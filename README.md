# دعوة زفاف — البوابة الليلية ✦

Next.js (App Router) + framer-motion. بدون Tailwind، كل التصميم بـ `app/globals.css`.

## التشغيل

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## الملفات اللي لازم تحطها أنت

| الملف | وظيفته |
|---|---|
| `public/music/Audio.mp3` | الأغنية (بتشتغل أول ما الضيف يلمس الختم، وبتدخل تدريجيًا) |
| `public/images/hall.jpg` | صورة القاعة (لو مش موجودة بيظهر تصميم زخرفي بديل) |

## التعديل على البيانات

كل شي (الأسماء، التاريخ، المكان، الآية، مسار الأغنية) بملف واحد: `lib/wedding.js`.

## ردود الضيوف (RSVP)

- محليًا: بتنحفظ بـ `data/rsvps.jsonl` (سطر لكل ضيف).
- على استضافة Serverless (مثل Vercel) ما بيصير الحفظ بملف، فحط متغير بيئة
  `RSVP_WEBHOOK_URL` يشاور على Google Apps Script أو أي endpoint بيستقبل POST JSON:
  `{ fullName, side, attendance, guests, message, createdAt }`.

## بنية المشروع

```
app/            layout + page + globals.css + api/rsvp
components/     Experience (التسلسل + الصوت) · Gate (البوابة) · Starfield (النجوم)
  sections/     Hero · Verse · Countdown · Venue · RSVP · Footer
  ui/           IslamicPattern · Mandala · Ornament · Reveal
lib/            wedding.js (البيانات) · geometry.js (رسم الأشكال)
```
