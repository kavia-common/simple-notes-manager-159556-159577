export default function AppIndex() {
  return (
    <div className="flex h-full flex-1 items-center justify-center bg-white">
      <div className="mx-auto max-w-md px-6 text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-[#ffeb3b]" />
        <h2 className="text-xl font-semibold text-gray-900">Welcome to Notes</h2>
        <p className="mt-2 text-sm text-gray-600">
          Select a note from the left, or use the + button to create a new one.
        </p>
      </div>
    </div>
  );
}
