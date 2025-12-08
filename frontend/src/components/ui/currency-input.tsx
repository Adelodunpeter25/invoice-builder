import { Input } from "@/components/ui/input";
import { forwardRef } from "react";

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number;
  onChange: (value: number) => void;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, ...props }, ref) => {
    function formatNumber(num: string): string {
      // Remove all non-digit and non-decimal characters
      const cleaned = num.replace(/[^\d.]/g, '');
      
      // Split into integer and decimal parts
      const parts = cleaned.split('.');
      const integerPart = parts[0];
      const decimalPart = parts[1];
      
      // Format integer part with commas
      const formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      
      // Return with decimal if exists
      return decimalPart !== undefined ? `${formatted}.${decimalPart}` : formatted;
    }

    function parseNumber(str: string): number {
      const cleaned = str.replace(/,/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      const cursorPosition = e.target.selectionStart || 0;
      const oldLength = e.target.value.length;
      
      // Format the input
      const formatted = formatNumber(input);
      
      // Parse and update value
      const numValue = parseNumber(formatted);
      onChange(numValue);
      
      // Restore cursor position accounting for added commas
      setTimeout(() => {
        if (e.target) {
          const newLength = formatted.length;
          const diff = newLength - oldLength;
          e.target.setSelectionRange(cursorPosition + diff, cursorPosition + diff);
        }
      }, 0);
    };

    const displayValue = value === 0 ? '' : formatNumber(value.toString());

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";
