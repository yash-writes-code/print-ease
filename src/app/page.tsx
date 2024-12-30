import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';
import { TypewriterEffectSmooth } from '../components/ui/TypeWriterEffect';
import { BackgroundBeamsWithCollision } from '../components/ui/BackgroundBeamsWithCollision';


export default function Home() {
  return (
    <div className="h-screen relative bg-gray-900 text-white min-h-[80vh] flex flex-col items-center justify-center text-center overflow-hidden ">
      <BackgroundBeamsWithCollision className="w-full h-full z-0">
        {/* Add any children elements here if needed */}
        <div className="relative z-10 flex justify-center items-center flex-col">
        <TypewriterEffectSmooth
          words={[{ text: "Print Smart, Skip the Wait!" }]}
          className="text-4xl font-bold mb-10 text-center"
        />

        <Link
          href="/my-prints"
          className="bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-colors"
        >
          Drop your File / START
        </Link>
  
      </div>
      </BackgroundBeamsWithCollision>
      
    </div>
  );
}