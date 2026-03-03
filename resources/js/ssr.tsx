import { createServer } from '@inertiajs/server';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import React from 'react';

createServer((page) =>
  (createInertiaApp as any)({
    page,
    render: React.createElement,
    resolve: (name: string) =>
      resolvePageComponent(
        `./Pages/${name}.tsx`,
        import.meta.glob('./Pages/**/*.tsx', { eager: true }) as any,
      ),
    setup({ App, props }: { App: any; props: any }) {
      return <App {...props} />;
    },
  }),
);
