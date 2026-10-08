import { LLM } from '../types/quiz';

export const featureGroups = [
  { title: 'Training Policy', label: 'Model Training', options: [
    ['train-none', 'No Training'], ['train-opt-out', 'Opt-out'], ['train-anon', 'Anonymized'], ['train-allow', 'Allowed'],
  ] },
  { title: 'Data Support', label: 'Supported Data Types', options: [
    ['data-pii', 'PII'], ['data-sensitive', 'Sensitive'], ['data-minors', 'Minors'], ['data-general', 'General'],
  ] },
  { title: 'Security Features', label: 'Available Features', options: [
    ['sec-enc', 'Encryption'], ['sec-sso', 'SSO'], ['sec-mfa', 'MFA'], ['sec-audit', 'Audit Logs'], ['sec-dlp', 'DLP'],
  ] },
  { title: 'Compliance & Certifications', label: 'Certifications', options: [
    ['comp-gdpr', 'GDPR'], ['comp-ccpa', 'CCPA'], ['comp-hipaa', 'HIPAA'], ['comp-soc2', 'SOC 2'],
  ] },
  { title: 'User Rights', label: 'Available Rights', options: [
    ['right-delete', 'Delete'], ['right-access', 'Access'], ['right-retention', 'Retention'],
  ] },
  { title: 'Transparency', label: 'Transparency Features', options: [
    ['trans-subproc', 'Subprocessors'], ['trans-sharing', 'No Analytics Sharing'], ['trans-notify', 'Policy Notices'],
  ] },
  { title: 'Data Location', label: 'Data Residency', options: [
    ['residency-us', 'US'], ['residency-eu', 'EU'], ['residency-specific', 'Specific Regions'], ['residency-global', 'Global'],
  ] },
  { title: 'Incident Response', label: 'Response Capabilities', options: [
    ['incident-breach', 'Breach Notification'], ['incident-reports', 'Reports'], ['incident-sla', 'SLA'],
  ] },
  { title: 'Data Portability', label: 'Export Capabilities', options: [
    ['portability-self', 'Self-service'], ['portability-api', 'API'], ['portability-request', 'On Request'],
  ] },
];

export function featureTags(model: LLM, options: string[][]): string[] {
  const tags = options.flatMap(([id, label]) => {
    const score = model.scores[id];
    if (score == null || score === 0) return [];
    return [score === 10 ? label : `${label} (partial)`];
  });
  if (options.some(([id]) => model.scores[id] == null)) tags.push('Unverified');
  return tags.length > 0 ? tags : ['No confirmed support'];
}
