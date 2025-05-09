// Herwerkte versie van de About.jsx pagina met modernere, strakkere stijl
import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Hero Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="inline-block bg-orange-100 text-orange-600 font-medium text-sm px-4 py-1 rounded-full mb-4">
            Ontdek meer
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Over dit project
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            We revolutioneren de manier waarop je een beleggingspartner vindt met ons innovatieve matchingplatform.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/" className="btn-secondary">
              Startpagina
            </Link>
            <Link to="/wizard" className="btn-primary">
              Begin de vergelijking
            </Link>
            <Link to="/results" className="btn-ghost">
              Ga naar resultaten
            </Link>
          </div>
        </div>
      </header>

      {/* Sticky nav */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 overflow-x-auto whitespace-nowrap hide-scrollbar flex gap-3 text-sm font-medium">
          <a href="#missie" className="nav-link">Missie</a>
          <a href="#onafhankelijkheid" className="nav-link">Onafhankelijkheid</a>
          <a href="#matching" className="nav-link">Matching proces</a>
          <a href="#disclaimer" className="nav-link">Disclaimer</a>
          <a href="#privacy" className="nav-link">Privacy</a>
        </div>
      </nav>

      {/* Main sections */}
      <main className="max-w-6xl mx-auto px-4 py-16 space-y-20">
        {/* Section componenten */}
        {/* ... hier worden dezelfde componenten hergebruikt, maar met neutralere kleuren, meer witruimte en minder versiering */}
        {/* Voorbeeld hieronder */}

        <section id="missie" className="bg-white rounded-2xl shadow-sm p-8 border-t-4 border-orange-500">
          <h2 className="text-2xl font-semibold mb-4">Onze missie</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Het vinden van een geschikte beleggingspartner kan overweldigend zijn. Ons doel is om dit proces te vereenvoudigen en transparanter te maken.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We helpen je bij het maken van een weloverwogen keuze door je voorkeuren te matchen met de sterke punten van verschillende beleggingspartners.
          </p>
        </section>

        {/* ... herhaal voor andere secties zoals onafhankelijkheid, matching, disclaimer, privacy ... */}
      </main>

      {/* CTA blok */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-500 py-16 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Klaar om jouw ideale beleggingspartner te vinden?</h2>
        <p className="text-lg max-w-xl mx-auto mb-8">
          Begin vandaag nog met het vergelijken van beleggingspartners en ontdek welke het beste bij jou past.
        </p>
        <div className="flex justify-center flex-wrap gap-4">
          <Link to="/" className="btn-secondary-light">Terug naar startpagina</Link>
          <Link to="/wizard" className="btn-primary">Start de vergelijking nu</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          {/* kolommen inhoudelijk behouden */}
        </div>
        <div className="mt-12 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Beleggingsvergelijker. Alle rechten voorbehouden.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#">Gebruiksvoorwaarden</a>
            <a href="#">Cookiebeleid</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </footer>

      <a 
        href="#top" 
        className="fixed bottom-6 right-6 bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-full shadow-lg"
        onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      >
        ↑
      </a>

      {/* Tailwind extra klassen (optioneel in index.css plaatsen) */}
      <style jsx>{`
        .btn-primary {
          @apply inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition;
        }
        .btn-secondary {
          @apply inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition;
        }
        .btn-secondary-light {
          @apply inline-flex items-center px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-100 transition;
        }
        .btn-ghost {
          @apply inline-flex items-center px-6 py-3 bg-white/30 backdrop-blur-md text-gray-700 rounded-lg font-semibold hover:bg-white/40 transition;
        }
        .nav-link {
          @apply px-4 py-2 rounded-full text-gray-600 hover:bg-gray-100 transition;
        }
      `}</style>
    </div>
  );
};

export default About;