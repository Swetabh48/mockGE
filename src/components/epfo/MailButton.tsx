const MAIL_TO = "swetabhsalampuria48@gmail.com";

export function mailHref(context?: string) {
  const subject = "Request: new EPFO APFC mock papers on mockGE";
  const body = `Hello,\n\nI have been practising the EPFO APFC mocks on mockGE${context ? ` (last paper: ${context})` : ""}. Please add new mock papers.\n\nTopics / difficulty I would like more of:\n\n\nThanks!`;
  return `mailto:${MAIL_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function MailButton({ context, className = "" }: { context?: string; className?: string }) {
  return (
    <a
      href={mailHref(context)}
      className={`inline-flex min-h-[40px] items-center gap-2 border border-[#c5ccd6] bg-white px-3 text-sm text-[#1e3a5f] hover:border-[#1e3a5f] ${className}`}
      title={`Email ${MAIL_TO}`}
    >
      <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="14" rx="1.5" />
        <path d="m3.5 6 8.5 7 8.5-7" />
      </svg>
      Request new mock papers
    </a>
  );
}
