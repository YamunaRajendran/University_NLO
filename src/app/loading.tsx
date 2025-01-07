export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-75">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-600"></div>
        <h2 className="text-3xl font-extrabold text-black-800 mt-8">Loading...</h2>
        <p className="text-gray-600 text-white mt-4 max-w-md mx-auto">
          Please wait while we prepare your content
        </p>
      </div>
    </div>
  );
}
