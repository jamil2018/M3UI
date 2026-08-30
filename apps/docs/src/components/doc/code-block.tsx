'use client';

import { useCallback, useState } from 'react';

export interface CodeBlockProps {
  code: string;
  language?: string;
  /** Accessible label for the copy control */
  copyLabel?: string;
}

export function CodeBlock({ code, language = 'tsx', copyLabel = 'Copy code' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => { setCopied(false); }, 2000);
    } catch {
      setCopied(false);
    }
  }, [code]);

  return (
    <div className="doc-code-block" data-language={language}>
      <div className="doc-code-block-toolbar">
        <span className="doc-code-block-lang">{language}</span>
        <button
          type="button"
          className="doc-copy-button"
          onClick={() => void handleCopy()}
          aria-live="polite"
        >
          {copied ? 'Copied' : copyLabel}
        </button>
      </div>
      <pre className="doc-code-block-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}
