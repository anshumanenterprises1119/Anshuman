// DecorateNow - Comprehensive State Engine (Cart, Wishlist, Compare, Recently Viewed, Loyalty, Order History)

const Cart = {
    // 1. Core Cart operations
    get() {
        try {
            return JSON.parse(localStorage.getItem('decoratenow_cart')) || [];
        } catch (e) {
            return [];
        }
    },

    save(cart) {
        try {
            localStorage.setItem('decoratenow_cart', JSON.stringify(cart));
            window.dispatchEvent(new CustomEvent('cartUpdated'));
        } catch (e) {
            console.error(e);
        }
    },

    add(product) {
        let cart = this.get();
        let existing = cart.find(item => item.id === product.id);

        if (existing) {
            existing.quantity += (product.quantity || 1);
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                image: product.image,
                quantity: product.quantity || 1,
                details: product.details || 'Standard'
            });
        }
        this.save(cart);
        this.showToast(`Added "${product.name}" to cart!`, 'success');
    },

    updateQuantity(id, quantity) {
        let cart = this.get();
        let itemIndex = cart.findIndex(item => item.id === id);

        if (itemIndex > -1) {
            if (quantity <= 0) {
                cart.splice(itemIndex, 1);
            } else {
                cart[itemIndex].quantity = parseInt(quantity);
            }
            this.save(cart);
        }
    },

    remove(id) {
        let cart = this.get();
        let filtered = cart.filter(item => item.id !== id);
        this.save(filtered);
    },

    clear() {
        this.save([]);
        localStorage.removeItem('decoratenow_coupon');
        localStorage.removeItem('decoratenow_redeemed_points');
    },

    getCount() {
        return this.get().reduce((sum, item) => sum + item.quantity, 0);
    },

    getSubtotal() {
        return this.get().reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    getDiscount() {
        const coupon = this.getCoupon();
        const subtotal = this.getSubtotal();
        let discount = 0;
        
        if (coupon) {
            if (coupon.type === 'percent') {
                discount += subtotal * (coupon.value / 100);
            } else if (coupon.type === 'flat') {
                discount += Math.min(coupon.value, subtotal);
            }
        }

        // Add loyalty points discount (1 point = $1 off)
        const redeemed = this.getRedeemedPoints();
        discount += redeemed;

        return Math.min(discount, subtotal);
    },

    getTax() {
        // GST 18% for Indian luxury markets
        const taxableAmount = Math.max(0, this.getSubtotal() - this.getDiscount());
        return taxableAmount * 0.18;
    },

    getShipping() {
        const subtotal = this.getSubtotal();
        if (subtotal === 0) return 0;
        // Free shipping above $250, else $15 flat rate
        return subtotal >= 250 ? 0 : 15.00;
    },

    getTotal() {
        const afterDiscount = this.getSubtotal() - this.getDiscount();
        return Math.max(0, afterDiscount + this.getTax() + this.getShipping());
    },

    getCoupon() {
        try {
            return JSON.parse(localStorage.getItem('decoratenow_coupon')) || null;
        } catch (e) {
            return null;
        }
    },

    applyCoupon(code) {
        const upperCode = code.trim().toUpperCase();
        let coupon = null;

        if (upperCode === 'DECOR20') {
            coupon = { code: 'DECOR20', type: 'percent', value: 20 };
        } else if (upperCode === 'WELCOME10') {
            coupon = { code: 'WELCOME10', type: 'flat', value: 10 };
        }

        if (coupon) {
            localStorage.setItem('decoratenow_coupon', JSON.stringify(coupon));
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            this.showToast(`Coupon "${upperCode}" applied!`, 'success');
            return { success: true, message: 'Coupon applied!' };
        } else {
            return { success: false, message: 'Invalid coupon code.' };
        }
    },

    removeCoupon() {
        localStorage.removeItem('decoratenow_coupon');
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        this.showToast('Coupon removed.', 'info');
    },

    // 2. Loyalty Points engine
    getLoyaltyPoints() {
        // Default to 120 points on first visit so user has some to test with
        if (localStorage.getItem('decoratenow_loyalty_points') === null) {
            localStorage.setItem('decoratenow_loyalty_points', '120');
        }
        return parseInt(localStorage.getItem('decoratenow_loyalty_points')) || 0;
    },

    saveLoyaltyPoints(pts) {
        localStorage.setItem('decoratenow_loyalty_points', pts.toString());
    },

    getRedeemedPoints() {
        return parseInt(localStorage.getItem('decoratenow_redeemed_points')) || 0;
    },

    redeemPoints(pts) {
        const balance = this.getLoyaltyPoints();
        const subtotal = this.getSubtotal();
        const maxRedeemable = Math.floor(subtotal - (this.getCoupon() ? this.getDiscount() : 0));
        
        const toRedeem = Math.min(pts, balance, maxRedeemable);
        if (toRedeem > 0) {
            localStorage.setItem('decoratenow_redeemed_points', toRedeem.toString());
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            this.showToast(`Redeemed ${toRedeem} points ($${toRedeem} discount)!`, 'success');
            return { success: true, amount: toRedeem };
        }
        return { success: false, message: 'Could not redeem points' };
    },

    cancelRedemption() {
        localStorage.removeItem('decoratenow_redeemed_points');
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        this.showToast('Points redemption cancelled.', 'info');
    },

    // 3. Wishlist Management
    getWishlist() {
        try {
            return JSON.parse(localStorage.getItem('decoratenow_wishlist')) || [];
        } catch (e) {
            return [];
        }
    },

    toggleWishlist(productId) {
        let list = this.getWishlist();
        let added = false;
        
        if (list.includes(productId)) {
            list = list.filter(id => id !== productId);
            this.showToast('Removed from Wishlist', 'info');
        } else {
            list.push(productId);
            added = true;
            this.showToast('Added to Wishlist!', 'success');
        }
        localStorage.setItem('decoratenow_wishlist', JSON.stringify(list));
        window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { productId, added } }));
        return added;
    },

    // 4. Compare List (max 3 products)
    getCompare() {
        try {
            return JSON.parse(localStorage.getItem('decoratenow_compare')) || [];
        } catch (e) {
            return [];
        }
    },

    toggleCompare(productId) {
        let list = this.getCompare();
        let added = false;
        
        if (list.includes(productId)) {
            list = list.filter(id => id !== productId);
            this.showToast('Removed from Compare list', 'info');
        } else {
            if (list.length >= 3) {
                this.showToast('Compare list is full! Max 3 products.', 'warning');
                return false;
            }
            list.push(productId);
            added = true;
            this.showToast('Added to Compare list!', 'success');
        }
        localStorage.setItem('decoratenow_compare', JSON.stringify(list));
        window.dispatchEvent(new CustomEvent('compareUpdated', { detail: { productId, added } }));
        return true;
    },

    clearCompare() {
        localStorage.setItem('decoratenow_compare', JSON.stringify([]));
        window.dispatchEvent(new CustomEvent('compareUpdated'));
    },

    // 5. Recently Viewed tracker (max 4 products)
    getRecentlyViewed() {
        try {
            return JSON.parse(localStorage.getItem('decoratenow_recently_viewed')) || [];
        } catch (e) {
            return [];
        }
    },

    trackView(productId) {
        let list = this.getRecentlyViewed();
        // Remove duplicate if exists, to move it to first position
        list = list.filter(id => id !== productId);
        list.unshift(productId); // Add to beginning
        if (list.length > 4) {
            list.pop(); // Keep only last 4
        }
        localStorage.setItem('decoratenow_recently_viewed', JSON.stringify(list));
    },

    // 6. Order History persistence
    getOrders() {
        try {
            return JSON.parse(localStorage.getItem('decoratenow_orders')) || [];
        } catch (e) {
            return [];
        }
    },

    createOrder(shippingAddress, paymentMethod) {
        const cartItems = this.get();
        if (cartItems.length === 0) return null;

        const subtotal = this.getSubtotal();
        const discount = this.getDiscount();
        const tax = this.getTax();
        const shipping = this.getShipping();
        const total = this.getTotal();

        const orderId = 'DN-' + Math.floor(100000 + Math.random() * 900000);
        const orderDate = new Date().toISOString();

        // Calculate loyalty points earned (1 point per $10 spent on final total)
        const pointsEarned = Math.floor(total / 10);
        
        // Deduct redeemed loyalty points from balance and add earned points
        const redeemed = this.getRedeemedPoints();
        const currentPoints = this.getLoyaltyPoints();
        const newPointsBalance = Math.max(0, currentPoints - redeemed + pointsEarned);
        this.saveLoyaltyPoints(newPointsBalance);

        const newOrder = {
            id: orderId,
            date: orderDate,
            items: cartItems,
            pricing: { subtotal, discount, tax, shipping, total },
            shipping: shippingAddress,
            payment: { method: paymentMethod, status: 'Paid' },
            status: 'Order Placed', // Tracking status
            pointsEarned: pointsEarned,
            pointsRedeemed: redeemed
        };

        const orders = this.getOrders();
        orders.unshift(newOrder); // Add to beginning of history
        localStorage.setItem('decoratenow_orders', JSON.stringify(orders));

        // Clear active cart state
        this.clear();

        return newOrder;
    },

    // Fallback UI Toast triggers (wired into global.js)
    showToast(message, type = 'success') {
        if (window.showToast) {
            window.showToast(message, type);
        } else {
            console.log(`[Toast ${type}]: ${message}`);
        }
    }
};

window.Cart = Cart;
window.Compare = {
    get: () => Cart.getCompare(),
    toggle: (id) => Cart.toggleCompare(id),
    clear: () => Cart.clearCompare()
};
window.RecentlyViewed = {
    get: () => Cart.getRecentlyViewed(),
    add: (id) => Cart.trackView(id)
};
