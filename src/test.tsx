function App() {
  return (
    <div className="min-h-screen grid grid-cols-2">
      {/* =====================================================
          DARK THEME
      ===================================================== */}

      <section className="dark bg-background text-text-primary p-10">
        <div className="max-w-2xl mx-auto">
          {/* HEADER */}
          <header className="mb-10">
            <p className="text-sm text-text-brand-primary font-medium mb-2">
              MONTRA
            </p>

            <h1 className="text-4xl font-bold mb-3">Dark Theme</h1>

            <p className="text-text-secondary">
              Semantic color system for dark interface
            </p>
          </header>

          {/* BRAND */}
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-text-secondary mb-4">
              BRAND
            </h2>

            <div className="flex flex-wrap gap-3">
              <div className="bg-primary-100 text-dark-base px-4 py-2 rounded-lg">
                Primary 100
              </div>

              <div className="bg-primary-200 text-dark-base px-4 py-2 rounded-lg">
                Primary 200
              </div>

              <div className="bg-primary-300 text-dark-base px-4 py-2 rounded-lg">
                Primary 300
              </div>

              <div className="bg-primary-400 text-dark-base px-4 py-2 rounded-lg">
                Primary 400
              </div>

              <div className="bg-primary-500 text-light-base px-4 py-2 rounded-lg">
                Primary 500
              </div>
            </div>
          </section>

          {/* SECONDARY */}
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-text-secondary mb-4">
              SECONDARY
            </h2>

            <div className="flex flex-wrap gap-3">
              <div className="bg-secondary-100 text-dark-base px-4 py-2 rounded-lg">
                Secondary 100
              </div>

              <div className="bg-secondary-200 text-dark-base px-4 py-2 rounded-lg">
                Secondary 200
              </div>

              <div className="bg-secondary-300 text-dark-base px-4 py-2 rounded-lg">
                Secondary 300
              </div>

              <div className="bg-secondary-400 text-dark-base px-4 py-2 rounded-lg">
                Secondary 400
              </div>

              <div className="bg-secondary-500 text-light-base px-4 py-2 rounded-lg">
                Secondary 500
              </div>
            </div>
          </section>

          {/* SURFACE */}
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-text-secondary mb-4">
              SURFACE
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface border border-border rounded-xl p-5">
                <p className="text-text-primary font-semibold mb-1">Surface</p>

                <p className="text-text-secondary text-sm">#171717</p>
              </div>

              <div className="bg-surface-secondary border border-border rounded-xl p-5">
                <p className="text-text-primary font-semibold mb-1">
                  Surface Secondary
                </p>

                <p className="text-text-secondary text-sm">#262626</p>
              </div>
            </div>
          </section>

          {/* TEXT */}
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-text-secondary mb-4">
              TEXT
            </h2>

            <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
              <p className="text-text-brand-primary text-xl font-semibold">
                Brand Primary — Primary 400
              </p>

              <p className="text-text-brand-secondary text-xl font-semibold">
                Brand Secondary — Secondary 400
              </p>

              <p className="text-text-primary text-xl font-semibold">
                Primary Text
              </p>

              <p className="text-text-secondary text-xl">Secondary Text</p>

              <p className="text-text-tertiary text-xl">Tertiary Text</p>

              <p className="text-text-disabled text-xl">Disabled Text</p>
            </div>
          </section>

          {/* STATUS */}
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-text-secondary mb-4">
              STATUS
            </h2>

            <div className="flex flex-wrap gap-3">
              <div className="bg-green-base-100 text-green-base-400 px-4 py-2 rounded-lg">
                Income
              </div>

              <div className="bg-red-base-100 text-red-base-400 px-4 py-2 rounded-lg">
                Expense
              </div>

              <div className="bg-gray-base-300 text-text-primary px-4 py-2 rounded-lg">
                Neutral
              </div>
            </div>
          </section>

          {/* BUTTONS */}
          <section>
            <h2 className="text-sm font-semibold text-text-secondary mb-4">
              COMPONENTS
            </h2>

            <div className="flex flex-wrap gap-3">
              <button className="bg-primary-400 text-dark-base font-semibold px-5 py-3 rounded-lg">
                Primary Button
              </button>

              <button className="bg-secondary-400 text-dark-base font-semibold px-5 py-3 rounded-lg">
                Secondary Button
              </button>

              <button className="border border-primary-400 text-text-brand-primary px-5 py-3 rounded-lg">
                Outline
              </button>

              <button className="bg-surface border border-border text-text-primary px-5 py-3 rounded-lg">
                Neutral
              </button>
            </div>
          </section>
        </div>
      </section>

      {/* =====================================================
          LIGHT THEME
      ===================================================== */}

      <section className="bg-background text-text-primary p-10">
        <div className="max-w-2xl mx-auto">
          {/* HEADER */}
          <header className="mb-10">
            <p className="text-sm text-text-brand-primary font-medium mb-2">
              MONTRA
            </p>

            <h1 className="text-4xl font-bold mb-3">Light Theme</h1>

            <p className="text-text-secondary">
              Semantic color system for light interface
            </p>
          </header>

          {/* BRAND */}
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-text-secondary mb-4">
              BRAND
            </h2>

            <div className="flex flex-wrap gap-3">
              <div className="bg-primary-100 text-dark-base px-4 py-2 rounded-lg">
                Primary 100
              </div>

              <div className="bg-primary-200 text-dark-base px-4 py-2 rounded-lg">
                Primary 200
              </div>

              <div className="bg-primary-300 text-dark-base px-4 py-2 rounded-lg">
                Primary 300
              </div>

              <div className="bg-primary-400 text-dark-base px-4 py-2 rounded-lg">
                Primary 400
              </div>

              <div className="bg-primary-500 text-light-base px-4 py-2 rounded-lg">
                Primary 500
              </div>
            </div>
          </section>

          {/* SECONDARY */}
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-text-secondary mb-4">
              SECONDARY
            </h2>

            <div className="flex flex-wrap gap-3">
              <div className="bg-secondary-100 text-dark-base px-4 py-2 rounded-lg">
                Secondary 100
              </div>

              <div className="bg-secondary-200 text-dark-base px-4 py-2 rounded-lg">
                Secondary 200
              </div>

              <div className="bg-secondary-300 text-dark-base px-4 py-2 rounded-lg">
                Secondary 300
              </div>

              <div className="bg-secondary-400 text-dark-base px-4 py-2 rounded-lg">
                Secondary 400
              </div>

              <div className="bg-secondary-500 text-light-base px-4 py-2 rounded-lg">
                Secondary 500
              </div>
            </div>
          </section>

          {/* SURFACE */}
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-text-secondary mb-4">
              SURFACE
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface border border-border rounded-xl p-5">
                <p className="text-text-primary font-semibold mb-1">Surface</p>

                <p className="text-text-secondary text-sm">#F5F5F5</p>
              </div>

              <div className="bg-surface-secondary border border-border rounded-xl p-5">
                <p className="text-text-primary font-semibold mb-1">
                  Surface Secondary
                </p>

                <p className="text-text-secondary text-sm">#EEEEEE</p>
              </div>
            </div>
          </section>

          {/* TEXT */}
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-text-secondary mb-4">
              TEXT
            </h2>

            <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
              <p className="text-text-brand-primary text-xl font-semibold">
                Brand Primary — Primary 500
              </p>

              <p className="text-text-brand-secondary text-xl font-semibold">
                Brand Secondary — Secondary 500
              </p>

              <p className="text-text-primary text-xl font-semibold">
                Primary Text
              </p>

              <p className="text-text-secondary text-xl">Secondary Text</p>

              <p className="text-text-tertiary text-xl">Tertiary Text</p>

              <p className="text-text-disabled text-xl">Disabled Text</p>
            </div>
          </section>

          {/* STATUS */}
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-text-secondary mb-4">
              STATUS
            </h2>

            <div className="flex flex-wrap gap-3">
              <div className="bg-green-base-100 text-green-base-400 px-4 py-2 rounded-lg">
                Income
              </div>

              <div className="bg-red-base-100 text-red-base-400 px-4 py-2 rounded-lg">
                Expense
              </div>

              <div className="bg-gray-base-300 text-light-base px-4 py-2 rounded-lg">
                Neutral
              </div>
            </div>
          </section>

          {/* BUTTONS */}
          <section>
            <h2 className="text-sm font-semibold text-text-secondary mb-4">
              COMPONENTS
            </h2>

            <div className="flex flex-wrap gap-3">
              <button className="bg-primary-500 text-light-base font-semibold px-5 py-3 rounded-lg">
                Primary Button
              </button>

              <button className="bg-secondary-500 text-light-base font-semibold px-5 py-3 rounded-lg">
                Secondary Button
              </button>

              <button className="border border-primary-500 text-text-brand-primary px-5 py-3 rounded-lg">
                Outline
              </button>

              <button className="bg-surface border border-border text-text-primary px-5 py-3 rounded-lg">
                Neutral
              </button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

export default App;
