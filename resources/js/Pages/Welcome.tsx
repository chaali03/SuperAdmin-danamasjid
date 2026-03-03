import { Head } from '@inertiajs/react';
import { Button } from '../components/ui/button';
import { Rocket } from 'lucide-react';

export default function Welcome() {
  return (
    <>
      <Head title="Welcome" />
      <div className="p-8">
        <h1 className="text-2xl font-semibold">Laravel + Inertia v2 + React 19</h1>
        <p className="mt-2 text-muted-foreground">Stack terpasang. Tailwind v4 aktif.</p>
        <div className="mt-4">
          <Button>
            <Rocket className="mr-2 h-4 w-4" /> Mulai
          </Button>
        </div>
      </div>
    </>
  );
}
