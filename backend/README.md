# AI Restaurant Backend

Quick start:

1. cd backend
2. cp .env.example .env and set values
3. npm install
4. npm run dev

APIs:

- POST /auth/register
- POST /auth/login
- Manager endpoints: /manager/menu (requires manager role)
- Orders: /orders

Socket.IO namespaces:

- /chef
- /waiter
- /manager
- /table:<id>

Next steps:

- Implement Socket.IO event emits when orders are created/updated
- Integrate Razorpay for online payments
- Add OpenAI-based recommendation endpoints
