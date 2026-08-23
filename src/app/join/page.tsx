import JobApplicationForm from "@/components/JobApplicationForm";

export default function JoinPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="section-title text-3xl font-bold text-pink-700">
          בואו לעבוד איתנו
        </h1>
        <p className="mt-3 text-pink-500">
          רוצים להצטרף לצוות? נשמח לשמוע מכם! ♡
        </p>
      </div>

      <JobApplicationForm />

      <div className="kawaii-card mx-auto max-w-lg p-6 text-center">
        <p className="text-sm text-pink-600">
          אנחנו מחפשים אנשים עם אהבה לתרבות יפנית, אנרגיה חיובית וחיוך מתוק!
          אין צורך בניסיון קודם — רק רצון להצטרף לחוויה מיוחדת.
        </p>
      </div>
    </div>
  );
}
