import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata = {
  title: "מדיניות פרטיות | Unique Maid Cafe",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="מדיניות פרטיות">
      <p>פרטיותכם חשובה לנו. להלן פירוט על האופן בו אנו אוספים ומשתמשים במידע:</p>
      <p>
        <strong>איסוף מידע:</strong> אנו אוספים מידע שנמסר על ידיכם מרצון חופשי, כגון
        בעת מילוי טופס &apos;בואו לעבוד איתנו&apos; (שם, גיל, דרכי התקשרות וניסיון).
      </p>
      <p>
        <strong>שימוש במידע:</strong> המידע ישמש אך ורק לצורך יצירת קשר, מיון מועמדים
        לצוות, ומתן מענה לפניות. לא נעביר את המידע האישי שלכם לצדדים שלישיים ללא
        אישורכם, למעט במקרים המחויבים על פי חוק.
      </p>
      <p>
        <strong>אבטחה:</strong> אנו נוקטים באמצעים טכנולוגיים מקובלים (כולל אחסון
        מאובטח ב-Supabase) כדי להגן על המידע שלכם.
      </p>
      <p>
        <strong>יצירת קשר:</strong> לכל בקשה לעיון, תיקון או מחיקה של מידע אישי, ניתן
        לפנות אלינו במייל: Uniquemaidcafe@gmail.com.
      </p>
    </LegalPageLayout>
  );
}
