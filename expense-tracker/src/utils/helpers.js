export function formatCurrency(number) {
      return new Intl.NumberFormat('ro-RO', {
            style: 'currency',
            currency: 'RON'
      }).
            format(number);
}

export function debounce(callback, milis) {
      let timeoutId;
      return function () {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                  callback();
            }, milis || 500);
      }
}
