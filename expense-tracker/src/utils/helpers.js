export function formatCurrency(number) {
      return new Intl.NumberFormat('ro-RO', {
            style: 'currency',
            currency: 'RON'
      }).
            format(number);
}

