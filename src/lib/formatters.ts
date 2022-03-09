export function formatDate(d = new Date()) {
  return d.toISOString().replace('T', ' ').replace('Z', '');
}
