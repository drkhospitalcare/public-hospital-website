interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  copy?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  copy,
  centered = false,
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-10 ${centered ? "text-center mx-auto max-w-2xl" : "max-w-3xl"} ${className}`}
    >
      <div className={`inline-flex items-center gap-2 ${centered ? "justify-center" : ""}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-[#10C6C1]" />
        <p className="eyebrow">{eyebrow}</p>
      </div>
      <h2 className="section-title">{title}</h2>
      {copy && (
        <p
          className={`section-copy ${
            centered ? "mx-auto" : ""
          }`}
        >
          {copy}
        </p>
      )}
    </div>
  );
}
