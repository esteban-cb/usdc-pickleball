# Pickleball Tournament Platform

A decentralized platform for organizing and registering for pickleball tournaments using USDC payments.

## Features

- Create and manage pickleball tournaments
- Register for events with USDC payments (coming soon)
- DUPR rating integration
- ENS and Base name resolution
- Real-time registration updates
- Event filtering by format, skill level, and price range
- Dark mode support

## Important Notes

- This is a development version that works locally only
- Registration data is stored in-memory and will be cleared on server restart
- Database setup is required for persistent storage

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Vercel Postgres
- WalletConnect
- Wagmi
- Viem
- DUPR API Integration

## Local Development Setup

1. Clone the repository:

```bash
git clone https://github.com/esteban-cb/usdc-pickleball.git
cd usdc-pickleball
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Required environment variables:
- `DATABASE_URL`: Vercel Postgres connection string
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: WalletConnect project ID

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Database Setup

1. Create a Postgres database in your Vercel dashboard
2. Run the schema migrations (see schema.sql, startLine: 1, endLine: 10)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [DUPR](https://mydupr.com) for ratings integration
- [WalletConnect](https://walletconnect.com) for wallet connectivity
- [Vercel](https://vercel.com) for hosting and database