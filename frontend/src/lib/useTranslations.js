
export function useTranslations(namespace) {
  return (key) => {
    // Return a readable fallback string based on the key
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };
}
