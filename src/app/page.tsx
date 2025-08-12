import Image from "next/image";
import CoffeeCupHero from "../../public/coffee-cup-hero.jpg";

export default function Home() {
  return (
    <main className="">
      <Image src={CoffeeCupHero} alt="Coffe cup" />
    </main>
  );
}
