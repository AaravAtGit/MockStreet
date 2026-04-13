import { Navbar } from "@/components/navbar"

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto py-24 px-4 pt-32">
        <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
        <div className="prose prose-invert max-w-none text-muted-foreground space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Agreement to Terms</h2>
            <p>These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and MockStreet ("Company", "we", "us", or "our"), concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Intellectual Property Rights</h2>
            <p>Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Representations</h2>
            <p>By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms of Use.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Prohibited Activities</h2>
            <p>You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Disclaimer</h2>
            <p>The site is provided on an as-is and as-available basis. You agree that your use of the site and our services will be at your sole risk. To the fullest extent permitted by law, we disclaim all warranties, express or implied, in connection with the site and your use thereof.</p>
          </section>
        </div>
      </main>
    </div>
  )
}
