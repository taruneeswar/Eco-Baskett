const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const TEST_EMAIL = 'tarun@gmail.com';
const TEST_PASSWORD = 'tarun123';

async function testCartFlow() {
  console.log('\n=== TESTING CART FUNCTIONALITY ===\n');

  try {
    // Step 1: Sign in
    console.log('1. Signing in...');
    const signInRes = await axios.post(`${API_URL}/auth/signin`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    const token = signInRes.data.token;
    console.log(`   ✅ Signed in as: ${signInRes.data.user.name}\n`);

    // Step 2: Get products
    console.log('2. Fetching products...');
    const productsRes = await axios.get(`${API_URL}/products`);
    const products = productsRes.data;
    console.log(`   ✅ Found ${products.length} products\n`);

    // Step 3: Add first product to cart
    console.log('3. Adding product to cart...');
    const productToAdd = products[0];
    console.log(`   Product: ${productToAdd.name}`);
    console.log(`   Price: ₹${productToAdd.price}`);
    
    const addRes = await axios.post(
      `${API_URL}/cart/add`,
      { productId: productToAdd._id, qty: 2 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(`   ✅ Added to cart (Status: ${addRes.status})\n`);

    // Step 4: Get cart
    console.log('4. Fetching cart...');
    const cartRes = await axios.get(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const cart = cartRes.data;
    console.log(`   ✅ Cart has ${cart.length} items:`);
    cart.forEach(item => {
      console.log(`      - ${item.product.name} x ${item.qty} = ₹${item.product.price * item.qty}`);
    });
    console.log();

    // Step 5: Update quantity
    console.log('5. Updating quantity...');
    await axios.put(
      `${API_URL}/cart/${productToAdd._id}`,
      { qty: 3 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('   ✅ Quantity updated to 3\n');

    // Step 6: Add another product
    if (products.length > 1) {
      console.log('6. Adding second product...');
      const secondProduct = products[1];
      await axios.post(
        `${API_URL}/cart/add`,
        { productId: secondProduct._id, qty: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(`   ✅ Added ${secondProduct.name}\n`);
    }

    // Step 7: Get cart again
    console.log('7. Fetching updated cart...');
    const updatedCartRes = await axios.get(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const updatedCart = updatedCartRes.data;
    console.log(`   ✅ Cart now has ${updatedCart.length} items:`);
    let total = 0;
    updatedCart.forEach(item => {
      const itemTotal = item.product.price * item.qty;
      total += itemTotal;
      console.log(`      - ${item.product.name} x ${item.qty} = ₹${itemTotal}`);
    });
    console.log(`   📊 Total: ₹${total}\n`);

    // Step 8: Remove first item
    console.log('8. Removing first item...');
    await axios.delete(`${API_URL}/cart/${productToAdd._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Item removed\n');

    // Step 9: Final cart check
    console.log('9. Final cart check...');
    const finalCartRes = await axios.get(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const finalCart = finalCartRes.data;
    console.log(`   ✅ Cart has ${finalCart.length} items remaining\n`);

    console.log('========================================');
    console.log('✅ ALL CART TESTS PASSED!');
    console.log('========================================\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data.message || error.message}`);
    } else {
      console.error(`   ${error.message}`);
    }
    console.log();
    process.exit(1);
  }
}

testCartFlow();
