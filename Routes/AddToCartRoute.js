import { Router } from 'express';
import { addToCart, getCart, removeFromCart } from '../Controllers/cartController.js';

const router = Router();

// Add equipment to the user's cart
router.post('/add-to-cart', addToCart);

// Get the user's cart
router.get('/get-cart', getCart);

// Remove an item from the user's cart
router.delete('/remove-from-cart', removeFromCart);

export default router;