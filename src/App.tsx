import { DiscountList } from './components/DiscountList';
import { SideCart } from './components/SideCart';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* dummy breadcrumb nav */}
        <nav className="text-sm text-gray-500 mb-8">
          <span>Agent portal / Flow / Discounts / Add discount</span>
        </nav>

        <div className="flex gap-8 max-w-7xl">
          {/* left side content */}
          <div className="flex-1">
            <DiscountList />
          </div>

          {/* cart sidebar */}
          <div className="flex-shrink-0">
            <SideCart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;