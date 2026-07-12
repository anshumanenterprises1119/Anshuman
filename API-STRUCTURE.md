# Next.js API Architecture Specification

This document details the backend REST endpoints and handlers for the multi-brand ecommerce platform (`Anshuman Enterprises` and `FutureWithAi`).

---

## 1. OTP Authentication Flows (`/api/auth`)

These endpoints use Supabase Auth to log users in securely using Email OTP without password requirements.

### A. Send OTP
*   **Endpoint**: `POST /api/auth/send-otp`
*   **Authentication**: None
*   **Payload**:
    ```json
    {
      "email": "user@example.com"
    }
    ```
*   **Backend Logic**:
    1. Validate email structure formats.
    2. Call Supabase Auth `signInWithOtp` for the target email address.
    3. Supabase triggers native verification email containing a 6-digit OTP code to the recipient.
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "OTP verification email has been sent successfully"
    }
    ```

### B. Verify OTP
*   **Endpoint**: `POST /api/auth/verify-otp`
*   **Authentication**: None
*   **Payload**:
    ```json
    {
      "email": "user@example.com",
      "otp": "482019"
    }
    ```
*   **Backend Logic**:
    1. Submit email and OTP token directly to Supabase Auth `verifyOtp` validation.
    2. On success, return JWT auth token and user profiles metadata.
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "profile": {
        "id": "84c8a2b1-592f-4c54-9457-a3f18e11e550",
        "email": "user@example.com",
        "full_name": "Aditya Tiwari",
        "role": "customer"
      }
    }
    ```

---

## 2. Cart & Checkout Processing (`/api/checkout`)

Performs server-side validation to prevent price manipulations and double-selling.

*   **Endpoint**: `POST /api/checkout`
*   **Authentication**: JWT Token (Bearer)
*   **Payload**:
    ```json
    {
      "brandSlug": "anshuman-enterprises",
      "items": [
        { "productId": "2a15c328-971c-4b53-8de1-c1e1bc89a74a", "quantity": 2 }
      ],
      "shippingAddressId": "91a8e10d-74d1-4e8c-8f1e-f3b184cc89e8",
      "paymentMethod": "cod",
      "couponCode": "WELCOME10"
    }
    ```
*   **Backend Logic**:
    1. Fetch products & inventory details from database.
    2. **Price Validation**: Double check active pricing in database against calculated totals.
    3. **Inventory Transaction**: For physical products, execute a PostgreSQL transaction checking `quantity - reserved >= order_qty`. If yes, increment `reserved`.
    4. **Apply Coupon**: Query `coupons` table. Validate expiration, minimum cart limits, and usage bounds. Deduct discount.
    5. **Save Order**: Create an entry in `orders` and `order_items`. Snap addresses as JSON objects directly in the order.
    6. **Checkout Delivery**:
        *   **COD**: Set status = `processing` and return order confirmation.
        *   **UPI/Card (Online PG)**: Instantiate a PhonePe payment request with callback URLs (`/api/webhook/phonepe`). Return PhonePe gateway page URL.
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "orderId": "61a5b82c-497c-47b2-841d-d92b86cc8910",
      "paymentUrl": null, 
      "message": "Order processed successfully (COD)"
    }
    ```

---

## 3. Payment Gateway Callbacks (`/api/webhook`)

Updates transaction records based on third-party payment success notifications.

*   **Endpoint**: `POST /api/webhook/phonepe`
*   **Authentication**: PhonePe Header Signature (validated using salt index & salt key)
*   **Payload**: Base64 encoded payload detailing payment confirmation.
*   **Backend Logic**:
    1. Extract payload & header validation signature.
    2. Confirm signature matches server computation.
    3. Decode parameters. Locate order by transaction ID.
    4. Verify totals match.
    5. **Update Order State**:
        *   Set payment status = `paid`.
        *   If order contains **digital products**:
            1. Query `digital_assets` linked to the products.
            2. Generate randomly obfuscated UUID `digital_access_tokens` entries.
            3. Set expiration (if limited) and maximum downloads threshold.
            4. Send a download notification SMS/Email containing:
               `https://futurewithai.online/api/download/[UUID]`
        *   If order contains **physical products**:
            1. Deduct quantity and subtract from reserved pool in `inventory`.
            2. Alert warehouse staff on Appsmith dashboard.
    6. Return standard 200 OK callback to PhonePe.

---

## 4. Secure Asset Delivery (`/api/download/[token]`)

*   **Endpoint**: `GET /api/download/[token]`
*   **Authentication**: URL path token (UUID)
*   **Response**: Binary attachment stream (ZIP/PDF)
*   **Backend Logic**:
    1. Query `digital_access_tokens` by token ID.
    2. Check expiration and max download bounds.
    3. Select filename and key from `digital_assets`.
    4. Request pre-signed temporary S3 URL from Cloudflare R2 bucket.
    5. Redirect client directly to download stream, masking credentials.
    6. Increment download counter.
