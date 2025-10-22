export const LoadingScreen = ({ message }: { message?: string }) => (
  <div class="flex flex-1 flex-col items-center justify-center py-16 text-center text-gray-300">
    <span class="animate-spin rounded-full border-4 border-gray-700 border-t-accent p-4" />
    <p class="mt-4 text-sm uppercase tracking-wide">{message ?? 'Loading'}</p>
  </div>
);
