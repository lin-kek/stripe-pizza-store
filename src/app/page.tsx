import PizzaList from "@/components/home/pizza-list";
import Header from "@/components/layout/header";
import { api } from "@/lib/axios";

export default async function Home() {
  const pizzaReq = await api.get("/pizzas");
  const pizzas = pizzaReq.data.pizzas ?? [];

  return (
    <div>
      <Header />
      <main className="container mx-auto mb-4">
        <PizzaList pizzas={pizzas} />
      </main>
    </div>
  );
}
