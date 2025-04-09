import HeroText from './HeroText';
import HeroImageCard from './HeroImageCard';

const Hero = () => {
  return (
    <section id="hero" className="bg-neutral-900 text-white overflow-hidden ">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12  items-center">
          <HeroText />
          <HeroImageCard />
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
