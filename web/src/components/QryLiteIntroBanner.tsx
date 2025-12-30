import { Shield, Lock, Heart, ExternalLinkIcon } from 'lucide-react';

const QryLiteIntroBanner = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Qry Lite
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Privacy-first AI chat. No tracking, no data collection. Open source, self-host with your own models, or use ours &mdash; your choice, your data.
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 max-w-xl mx-auto mt-4">
          Built by Qry AI.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Private
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No trackers, no analytics, no bloat.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Less is More
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Minimal on purpose. We focus on the essentials.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Respectful
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            We build tools that honor your privacy and autonomy.
          </p>
        </div>
      </div>

      <div className="text-center mt-10">
        <a
          href="https://qry.lol/about-us"
          target="_blank"
          className="inline-block text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          Learn more about Our Mission <ExternalLinkIcon size={6} className="inline-block w-4 h-4 mb-3" />
        </a>
      </div>
    </div>
  );
};

export { QryLiteIntroBanner };