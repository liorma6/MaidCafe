# Unique Maid Cafe ♡

אתר בעברית (RTL) למייד קפה ישראלי בקונספט יפני — פופ-אפים באירועים.

## ארכיטקטורה

| רכיב | שירות |
|------|--------|
| מסד נתונים | **Supabase** (PostgreSQL) |
| אחסון תמונות | **Supabase Storage** |
| אימות מנהל | משתני סביבה (`.env`) |
| טופס הצטרפות | Google Forms (מוטמע) |

## הגדרה ראשונית

### 1. Supabase (חינמי)

1. צרו חשבון ב-[supabase.com](https://supabase.com)
2. **New Project** → שמרו את הסיסמה של מסד הנתונים
3. **SQL Editor** → הריצו את הקובץ `supabase/schema.sql`
4. **Storage** → **New bucket**:
   - שם: `maid-cafe-uploads`
   - **Public bucket**: ON
5. **Project Settings → API** — העתיקו:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (שמרו בסוד!)

### 2. משתני סביבה

```bash
cp .env.example .env.local
```

ערכו `.env.local`:

```env
ADMIN_EMAILS=Emmaliz.star@gmail.com,Tav.chan.ferzig@gmail.com,Uniquemaidcafe@gmail.com
ADMIN_PASSWORD=maidcafe1234
SESSION_SECRET=החליפו-במחרוזת-אקראית-ארוכה

NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_STORAGE_BUCKET=maid-cafe-uploads
```

> **חשוב:** לעולם אל תעלו `.env.local` ל-GitHub. המפתח `service_role` נותן גישה מלאה למסד — רק בשרת.

### 3. הרצה מקומית

```bash
npm install
npm run dev
```

פתחו [http://localhost:3000](http://localhost:3000)

## פריסה (Render / Vercel)

הגדירו את **כל** משתני הסביבה מ-`.env.example` בלוח הבקרה של השירות.

- **Render**: Web Service → Environment → Add variables
- **Vercel**: Project Settings → Environment Variables

## דפים

- **עמוד הבית** — הודעות חשובות
- **אירועים שהיו** — גalerיית תמונות (מ-Supabase Storage)
- **מידע על הצוות** — פרופילי הצוות
- **בואו לעבוד איתנו** — טופס Google Forms
- **מכירת המרצ׳** — מוצרים

## פאנל ניהול

כניסה דרך `/admin` או הקישור הקטן בתחתית האתר.

מהפאנל אפשר:
- לפרסם הודעות בדף הבית
- ליצור אירועים ולהעלות תמונות (לענן)
- להוסיף מוצרי מרצ׳ עם תמונות
- לערוך פרטי צוות

## מפתחות API נדרשים — סיכום

| מה לפתוח | מה להעתיק |
|----------|-----------|
| **Supabase** (חשבון אחד) | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| **משתני סביבה משלכם** | `ADMIN_EMAILS`, `ADMIN_PASSWORD`, `SESSION_SECRET` |

לא נדרש Cloudinary / MongoDB נפרד — Supabase מכסה גם DB וגם Storage.
