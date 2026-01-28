import { prisma } from "@/lib/prisma";

async function main() {
  const pizzas = [
    {
      id: 1,
      name: "Calabrese Sausage with Onion",
      price: 42.9,
      image: "calabresa.jpg",
      ingredients: "Calabrese sausage, onion, mozzarella, tomato sauce",
    },
    {
      id: 2,
      name: "Margherita",
      price: 39.9,
      image: "margherita.jpg",
      ingredients: "Mozzarella, tomato, basil, tomato sauce",
    },
    {
      id: 3,
      name: "Four Cheese",
      price: 47.5,
      image: "quatro-queijos.jpg",
      ingredients: "Mozzarella, parmesan, gorgonzola, provolone, tomato sauce",
    },
    {
      id: 4,
      name: "Pepperoni",
      price: 44.9,
      image: "pepperoni.jpg",
      ingredients: "Pepperoni, mozzarella, tomato sauce",
    },
    {
      id: 5,
      name: "Portuguese Style",
      price: 45.0,
      image: "portuguesa.jpg",
      ingredients: "Ham, egg, onion, olives, mozzarella, tomato sauce",
    },
    {
      id: 6,
      name: "Vegetarian",
      price: 41.5,
      image: "vegetariana.jpg",
      ingredients:
        "Bell pepper, onion, tomato, mushrooms, corn, mozzarella, tomato sauce",
    },
  ];

  for (const pizza of pizzas) {
    await prisma.product.upsert({
      where: { id: pizza.id },
      update: {},
      create: {
        name: pizza.name,
        price: pizza.price,
        image: pizza.image,
        ingredients: pizza.ingredients,
      },
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
