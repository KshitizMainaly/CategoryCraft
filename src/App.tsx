import { useState } from "react";
import { Select, SelectOption } from "../src/components/Select";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductsProvider, useProducts } from '../Context/ProductContext';

import Card from "./components/Card";

const queryClient = new QueryClient();
function App() {
  const products = useProducts();

 const uniqueCategories = Array.from(new Set(products?.map(p => p.category)));
const options: SelectOption[] = 
  uniqueCategories.map(category => ({
    label: category,
    value: category, // Or a different unique identifier
  }));


  const [value1, setValue1] = useState<SelectOption[]>([]);

 const filteredProducts = products?.filter((product) =>
    value1.length === 0
      ? true // If no category is selected, show all products
      : value1.some((selected) => selected.value === product.category)
  );

  return (
<div>
<Select
      multiple
      options={options}
      value={value1}
      onChange={(o) => setValue1(o)}
    />
<Card products={filteredProducts} />
</div>
  );

}


export default function RootApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductsProvider>
        <App />
     
      </ProductsProvider>
    </QueryClientProvider>
  );
}