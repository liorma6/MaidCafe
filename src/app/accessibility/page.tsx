import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata = {
  title: "הצהרת נגישות | Unique Maid Cafe",
};

export default function AccessibilityPage() {
  return (
    <LegalPageLayout title="הצהרת נגישות">
      <p>
        אנו ב-Unique Maid Cafe מאמינים בשוויון זכויות ופועלים להנגיש את האתר שלנו לכלל
        הציבור, לרבות אנשים עם מוגבלויות.
      </p>
      <p>
        <strong>התאמות באתר:</strong> אנו עושים מאמצים להתאים את האתר לדפדפנים נפוצים,
        למובייל ולשימוש פשוט וברור, תוך שמירה על ניגודיות צבעים ואפשרות לניווט נוח.
      </p>
      <p>
        <strong>סייגים:</strong> מכיוון שמדובר באתר דינמי המכיל תמונות וגלריות מתעדכנות,
        ייתכן שיתגלו חלקים שטרם הונגשו במלואם.
      </p>
      <p>
        <strong>יצירת קשר:</strong> אם נתקלתם בבעיית נגישות באתר או שיש לכם הצעה לשיפור,
        נשמח אם תעדכנו אותנו כדי שנוכל לטפל בכך בהקדם במייל: Uniquemaidcafe@gmail.com.
      </p>
    </LegalPageLayout>
  );
}
