export function extractTextClassName(className: string) {
  const keywords = ["text-", "font-"];

  const classes = className.split(" ");
  const filteredClasses = classes.filter(cls => keywords.some(keyword => cls.startsWith(keyword)));

  return filteredClasses.join(" ");
}
