import Image from "next/image";
import Link from "next/link";
import CoffeeCupHero from "../../public/coffee-cup-hero.jpg";

export default function Home() {
  return (
    <main className="">
      <a href="/dashboard">go dashboard</a>
      <Link className="text-2xl" href="/dashboard">
        go dashboard
      </Link>
      <Image src={CoffeeCupHero} alt="Coffe cup" />
    </main>
  );
}
