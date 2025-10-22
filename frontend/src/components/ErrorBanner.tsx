export const ErrorBanner = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div
    class="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-200"
    role="alert"
    data-testid="error-banner"
  >
    <div class="flex items-center justify-between gap-4">
      <p class="text-sm font-medium">{message}</p>
      {onRetry ? (
        <button
          type="button"
          class="rounded bg-red-500 px-3 py-1 text-xs font-semibold text-white"
          onClick={onRetry}
        >
          Retry
        </button>
      ) : null}
    </div>
  </div>
);
