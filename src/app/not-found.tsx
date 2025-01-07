import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center  px-4">
      <div className="text-center animate-fade-in">
        <h1 className="text-9xl font-extrabold text-black-900 animate-bounce-slow">404</h1>
        <h2 className="text-3xl font-extrabold text-black-800 mt-8">Oops! Page Not Found</h2>
        <p className="text-gray-600 text-white mt-4 max-w-md mx-auto">
          The page youre looking for seems to have vanished into the digital void.
        </p>
        <Link 
          href="/overview" 
          className="inline-block mt-8 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold 
                   hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
