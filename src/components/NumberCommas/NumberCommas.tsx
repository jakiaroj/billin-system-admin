interface NumberProps {
  value: any;
}

const NumberWithCommas = ({ value }: NumberProps) => {
  const numericValue = Number(value);
  const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
  const formattedNumber = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeValue);
  return <span>{formattedNumber}</span>;
};

export default NumberWithCommas;
