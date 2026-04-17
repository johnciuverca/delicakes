
export function debounce(callback: () => void, milis?: number): () => void {
      let timeoutId: number;
      return function () {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                  callback();
            }, milis || 500);
      }
}