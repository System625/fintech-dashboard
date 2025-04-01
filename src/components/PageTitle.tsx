interface PageTitleProps {
  title: string;
  subtitle?: string;
}

export function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      {subtitle && (
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
} 