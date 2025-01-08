import React from "react";
import { Product } from "../../Context/ProductContext";

type CardProps = {
  products: Product[] | undefined;
};

const Card: React.FC<CardProps> = ({ products }) => {
  return (
    <div className="flex items-center justify-center flex-wrap space-x-14">
      {products?.map((product) => (
        <div
          key={product.id}
          className="card bg-base-100 w-96 h-[600px] shadow-xl mt-4"
        >
          <figure>
            <img src={product.image} alt={product.title} />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{product.title}</h2>
            <p>
              {product.description.length > 100
                ? `${product.description.substring(0, 100)}......`
                : product.description}
            </p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;
