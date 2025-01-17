import Image from "next/image";
import nloSymbol from "../../public/logo/nlo_logo_symbol.png";

export default function LoadingScreen() {
  // const { language } = useLayoutStore();

  return (
    <div className="fixed inset-0 backdrop-blur  flex items-center justify-center z-50">
      <div className="text-center  backdrop-blur-sm  bg-transparent p-8 rounded-lg">
        <div className="relative w-40 h-40 mx-auto">
          {/* Outer rotating circle */}
          <div className="absolute inset-0 animate-spin rounded-full border-t-4 border-b-4 border-blue-600"></div>

          {/* Logo container */}
          <div className="absolute inset-2 flex items-center justify-center">
            <Image
              src={nloSymbol}
              alt="NLO Logo"
              width={200}
              height={120}
              className="object-contain brightness-0 invert"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
