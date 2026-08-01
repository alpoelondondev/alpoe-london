"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import BraceletSelector from "./BraceletSelector";
import EnquireCTA from "./EnquireCTA";

export default function WatchOptions({ product }: { product: Product }) {
  const bracelets = product.bracelets ?? [];
  const showSelector = bracelets.length > 1;
  const [selected, setSelected] = useState<string | undefined>(
    showSelector ? bracelets[0] : undefined,
  );

  return (
    <>
      {showSelector ? (
        <BraceletSelector
          options={bracelets}
          value={selected ?? bracelets[0]}
          onChange={setSelected}
        />
      ) : null}
      <EnquireCTA product={product} bracelet={showSelector ? selected : undefined} />
    </>
  );
}
