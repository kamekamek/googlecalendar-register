export default function PrivacyPolicy() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
        <p className="mb-4">
          This Privacy Policy explains how our Google Calendar Batch Registration application (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;app&rdquo;) 
          collects, uses, and protects your information when you use our service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">2. Information Collection and Use</h2>
        <h3 className="text-xl font-bold mb-2">2.1 Google Account Information</h3>
        <p className="mb-4">
          When you sign in with your Google account, we receive access to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Your email address</li>
          <li>Your Google Calendar data (limited to the scope described below)</li>
        </ul>

        <h3 className="text-xl font-bold mb-2">2.2 Google Calendar API Scope</h3>
        <p className="mb-4">
          We use the following Google Calendar API scope:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <code className="bg-gray-100 px-2 py-1 rounded text-black">
              https://www.googleapis.com/auth/calendar.events
            </code>
            <p className="mt-1">
              This scope allows our application to add events to your Google Calendar.
            </p>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">3. Data Storage and Processing</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>We do not store any of your calendar data or event information permanently.</li>
          <li>Event information is only processed temporarily to create calendar events.</li>
          <li>Authentication tokens are stored only temporarily during your active session.</li>
          <li>We do not share your information with any third parties.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">4. User Rights</h2>
        <p className="mb-4">You have the right to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Revoke access to your Google Calendar at any time through your Google Account settings</li>
          <li>Request information about how your data is processed</li>
          <li>Log out and remove your session data</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">5. Data Protection</h2>
        <p className="mb-4">
          We implement appropriate technical and organizational measures to ensure a level of security 
          appropriate to the risk, including:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Secure HTTPS connections</li>
          <li>Session-based authentication</li>
          <li>Minimal data collection and processing</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">6. Changes to This Privacy Policy</h2>
        <p className="mb-4">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
          the new Privacy Policy on this page.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us through email adress nagare.0913@gmail.com.
        </p>
      </section>
    </main>
  );
} 