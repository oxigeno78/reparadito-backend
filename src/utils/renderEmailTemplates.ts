import fs from 'fs';
import path from 'path';

type TemplateVars = Record<string, string | number | boolean>;

/**
 * Renders an email template with the given variables
 * @param templateName The name of the template file (e.g., 'verify-email.html')
 * @param variables The variables to replace in the template
 * @returns The rendered HTML string
 */
export const renderEmailTemplate = (templateName: string, variables: TemplateVars): string => {
  const templatePath = path.join(
    process.cwd(),
    'src',
    'templates',
    templateName
  );

  let html = fs.readFileSync(templatePath, 'utf8');

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    html = html.replace(regex, String(value));
  }

  return html;
}