interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="bg-[#0F2461] px-10 py-6">
      <h1 className="text-white font-extrabold text-xl tracking-wide uppercase">
        {title}
      </h1>
      {subtitle && (
        <p className="text-blue-300 text-sm mt-1">{subtitle}</p>
      )}
    </div>
  );
}
