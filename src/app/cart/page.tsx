// src/app/cart/page.tsx

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm text-center">
        <h1 className="text-2xl font-bold mb-4">Your Shopping Cart</h1>
        <p className="text-gray-500">Your cart is currently empty.</p>
      </div>
    </div>
  );
}