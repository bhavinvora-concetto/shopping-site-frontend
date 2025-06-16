import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAllCartItem,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  clearCartItems,
} from "../services/cartService";
import {
  placeOrder as placeOrderAPI,
  getUserOrders as getUserOrdersAPI,
} from "../services/orderService";
import { useAuth } from "./authContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  const fetchCart = async () => {
    try {
      const response = await getAllCartItem();
      setCart(response.data.data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const addToCart = async (product) => {
    try {
      await addCartItem(product.id);
      toast.success("Item added to cart!");
      fetchCart();
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  const increment = async (cartId) => {
    const item = cart.find((item) => item.id === cartId);
    if (!item) return;
    try {
      await updateCartItem(cartId, item.quantity + 1);
      fetchCart();
    } catch (error) {
      console.error("Increment failed:", error);
    }
  };

  const decrement = async (cartId) => {
    const item = cart.find((item) => item.id === cartId);
    if (!item || item.quantity <= 1) return;
    try {
      await updateCartItem(cartId, item.quantity - 1);
      fetchCart();
    } catch (error) {
      console.error("Decrement failed:", error);
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      await deleteCartItem(cartId);
      fetchCart();
    } catch (error) {
      console.error("Remove item error:", error);
    }
  };

  const clearCart = async () => {
    try {
      await clearCartItems();
      fetchCart();
    } catch (error) {
      console.error("Clear cart error:", error);
    }
  };

  const placeOrder = async (orderDetails) => {
    try {
      const response = await placeOrderAPI(orderDetails);
      clearCart();
      return response;
    } catch (error) {
      console.error("Place order error:", error);
    }
  };

  const getUserOrders = async () => {
    try {
      const response = await getUserOrdersAPI();
      return response;
    } catch (error) {
      console.error("Failed to fetch user orders:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increment,
        decrement,
        removeFromCart,
        clearCart,
        fetchCart,
        placeOrder,
        getUserOrders,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
