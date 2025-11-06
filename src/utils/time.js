import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatRelativeTime(isoDateString) {
  if (!isoDateString) {
    return '';
  }
  try {
    const date = parseISO(isoDateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
  } catch (error) {
    console.error("Error formatting date:", error);
    return '';
  }
}
