import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata = {
  title: "תקנון ותנאי שימוש | Unique Maid Cafe",
};

export default function TermsPage() {
  return (
    <LegalPageLayout title="תקנון ותנאי שימוש">
      <p>
        ברוכים הבאים לאתר של Unique Maid Cafe. השימוש באתר, בתכנים ובשירותים המוצעים
        בו מהווה את הסכמתך לתנאים המפורטים להלן:
      </p>
      <p>
        <strong>כללי:</strong> האתר משמש כפלטפורמה להצגת מידע על אירועי פופ-אפ, היכרות
        עם הצוות ומכירת מרצ&apos;נדייז.
      </p>
      <p>
        <strong>קניין רוחני:</strong> כל הזכויות, לרבות הלוגו, התמונות, העיצובים
        והאיורים באתר, שייכים ל-Unique Maid Cafe ואין להעתיק או לעשות בהם שימוש מסחרי
        ללא אישור מראש.
      </p>
      <p>
        <strong>מרצ&apos;נדייז ורכישות:</strong> מחירי המוצרים, זמינותם ותנאי האספקה
        עשויים להשתנות מעת לעת. ביטול עסקה יתאפשר בהתאם להוראות חוק הגנת הצרכן.
      </p>
      <p>
        <strong>שינויים:</strong> הנהלת האתר שומרת לעצמה את הזכות לעדכן את תנאי השימוש
        בכל עת.
      </p>
    </LegalPageLayout>
  );
}
