export function formatUSD(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}

// Alias for backward compatibility across components
export const formatBRL = formatUSD;

export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function formatZipCode(value: string): string {
  const clean = value.replace(/[^\d-]/g, '').slice(0, 10);
  return clean;
}

export const formatCEP = formatZipCode;

export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  const parts = [];
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.slice(i, i + 4));
  }
  return parts.join(' ');
}

export function formatExpiryDate(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function detectCardBrand(cardNumber: string): string {
  const clean = cardNumber.replace(/\D/g, '');
  if (/^4/.test(clean)) return 'Visa';
  if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/.test(clean)) return 'Mastercard';
  if (/^(34|37)/.test(clean)) return 'American Express';
  if (/^(6011|65|64[4-9])/.test(clean)) return 'Discover';
  if (/^(4011|4312|4389|4514|4576|5041|5066|5090|6277|6362|6363)/.test(clean)) return 'Elo';
  return 'Credit Card';
}

export function getInstallmentsOptions(amount: number, max = 12) {
  const options = [];
  for (let i = 1; i <= max; i++) {
    const hasInterest = i > 4; // 4 interest-free payments (Klarna/Affirm style) or 12x
    const finalAmount = hasInterest ? amount * 1.05 : amount;
    const installmentValue = finalAmount / i;
    options.push({
      count: i,
      value: installmentValue,
      total: finalAmount,
      hasInterest,
      label: `${i}x of ${formatUSD(installmentValue)} ${hasInterest ? 'with APR' : '0% APR'}`,
    });
  }
  return options;
}
