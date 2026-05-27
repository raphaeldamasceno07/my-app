// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-4">Dashboard Protegido</h1>
      <p className="text-zinc-400 mb-8">
        Se você está vendo esta página, a autenticação + refresh está
        funcionando.
      </p>
      <p className="text-sm text-zinc-500">
        Aguarde 1 minuto para ver o refresh automático acontecer.
      </p>
    </div>
  );
}
