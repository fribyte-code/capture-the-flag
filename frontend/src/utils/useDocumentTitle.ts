import { useRef, useEffect } from "react";

function useDocumentTitle(
  title: string,
  faviconUrl?: string,
  prevailOnUnmount: boolean = false,
): void {
  const defaultTitle = useRef(document.title);
  const defaultFavicon = useRef<string | null>(null);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    if (faviconUrl) {
      const favicon = document.querySelector(
        'link[rel="icon"]',
      ) as HTMLLinkElement | null;
      if (favicon) {
        defaultFavicon.current = favicon.getAttribute("href");
        favicon.href = faviconUrl;
      }
    }
  }, [faviconUrl]);

  useEffect(
    () => () => {
      if (!prevailOnUnmount) {
        document.title = defaultTitle.current;
        if (faviconUrl && defaultFavicon.current) {
          const favicon = document.querySelector(
            'link[rel="icon"]',
          ) as HTMLLinkElement | null;
          if (favicon) {
            favicon.href = defaultFavicon.current;
          }
        }
      }
    },
    [],
  );
}

export default useDocumentTitle;
