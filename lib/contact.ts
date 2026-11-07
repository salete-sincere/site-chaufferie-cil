export const contactEmail = 'haubourdin_alternative_citoyenne@riseup.net';
export const actions = ['Réunions publiques', 'Porte-à-porte', 'Distribution de tracts', 'Partage de contenus', 'Recherche documentaire'];
export function makeMessage(selected: string[], personal: string) {
  return ['Bonjour,', '', 'Je souhaite prendre contact pour rejoindre le comité d’intérêt local contre la chaufferie de la friche Lever.', '', selected.length ? `Les actions qui m’intéressent :\n${selected.map(action => `• ${action}`).join('\n')}` : 'Je souhaite échanger avant de choisir une action.', ...(personal.trim() ? ['', personal.trim()] : []), '', 'À bientôt !'].join('\n');
}
export function makeMailto(body: string) {
  return `mailto:${contactEmail}?subject=${encodeURIComponent('Comité chaufferie')}&body=${encodeURIComponent(body)}`;
}
