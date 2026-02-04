export function formatCurrency(amount: number): string {
      return new Intl.NumberFormat('ro-RO', {
            style: 'currency',
            currency: 'RON'
      }).format(amount);
}

export function debounce(callback: () => void, milis?: number): () => void {
      let timeoutId: number;
      return function () {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                  callback();
            }, milis || 500);
      }
}
