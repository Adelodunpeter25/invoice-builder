import { Input } from "@/components/ui/input";
import { forwardRef, useState } from "react";

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number;
  onChange: (value: number) => void;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(formatNumber(value));

    function formatNumber(num: number): string {
      if (isNaN(num) || num === 0) return '';
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(num);
    }

    function parseNumber(str: string): number {
      const cleaned = str.replace(/,/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      const numValue = parseNumber(input);
      
      onChange(numValue);
      setDisplayValue(input);
    };

    const handleBlur = () => {
      setDisplayValue(formatNumber(value));
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      // Show raw number on focus for easier editing
      if (value === 0) {
        setDisplayValue('');
      } else {
        setDisplayValue(value.toString());
      }
      e.target.select();
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";
