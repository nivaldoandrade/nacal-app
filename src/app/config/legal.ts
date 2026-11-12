export const legal = {
  termsUrl: 'https://www.nacal.app/terms.html',
  privacyUrl: 'https://www.nacal.app/privacy.html',
  supportEmail: 'contato@nacal.app',
} as const;

export function getDeleteAccountUrl(accountEmail: string | null): string {
  const subject = encodeURIComponent('Excluir minha conta do NaCal');

  if (!accountEmail) {
    return `mailto:${legal.supportEmail}?subject=${subject}`;
  }

  const body = encodeURIComponent(`Quero excluir minha conta do NaCal.\n\nE-mail da conta: ${accountEmail}`);

  return `mailto:${legal.supportEmail}?subject=${subject}&body=${body}`;
}
