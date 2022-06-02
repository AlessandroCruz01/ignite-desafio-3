import React, { useState, useEffect } from "react";
import { MdAddShoppingCart } from "react-icons/md";

import { ProductList } from "./styles";
import { api } from "../../services/api";
import { formatPrice } from "../../util/format";
import { useCart } from "../../hooks/useCart";

interface Product {
	id: number;
	title: string;
	price: number;
	image: string;
}

interface ProductFormatted extends Product {
	priceFormatted: string;
}

interface CartItemsAmount {
	[key: number]: number;
}

const Home = (): JSX.Element => {
	const [products, setProducts] = useState<ProductFormatted[]>([]);
	const { addProduct, cart } = useCart();

	const cartItemsAmount = cart.reduce((sumAmount, product) => {
		const newSumAmount = { ...sumAmount };
		newSumAmount[product.id] = product.amount;

		return newSumAmount;
	}, {} as CartItemsAmount);

	useEffect(() => {
		async function loadProducts() {
			const response = await api
				.get<Product[]>("/products")
				.then((response) => response.data);

			const data = response.map((product) => ({
				...product,
				priceFormatted: formatPrice(product.price),
			}));

			setProducts(data);
		}

		loadProducts();
	}, []);

	function handleAddProduct(id: number) {
		addProduct(id);
	}

	return (
		<ProductList>
			{products.map((element) => (
				<li key={element.id}>
					<img src={element.image} alt={element.image} />
					<strong>{element.title}</strong>
					<span>{element.priceFormatted}</span>
					<button
						type="button"
						data-testid="add-product-button"
						onClick={() => handleAddProduct(element.id)}
					>
						<div data-testid="cart-product-quantity">
							<MdAddShoppingCart size={16} color="#FFF" />
							{cartItemsAmount[element.id] || 0}
						</div>

						<span>ADICIONAR AO CARRINHO</span>
					</button>
				</li>
			))}
		</ProductList>
	);
};

export default Home;
