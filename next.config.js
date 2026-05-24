// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ['images.unsplash.com', 'avatars.githubusercontent.com'],
//   },
// }

// module.exports = nextConfig



// /** @type {import('next').NextConfig} */
// const supabaseUrl =
//   process.env.NEXT_PUBLIC_SUPABASE_URL
// const nextConfig = {
//   images: {
//     domains: [
//       'images.unsplash.com',
//       'avatars.githubusercontent.com',
//       supabaseUrl
//     ],
//     remotePatterns: [
//       {
//         protocol: 'http',
//         hostname: 'localhost',
//         port: '3002',
//         pathname: '/uploads/**',
//       },
//     ],
//   },
// };

// module.exports = nextConfig;



// /** @type {import('next').NextConfig} */

// const supabaseUrl =
//   process.env.NEXT_PUBLIC_SUPABASE_URL;

// const supabaseHostname =
//   supabaseUrl
//     ? new URL(supabaseUrl).hostname
//     : undefined;

// const nextConfig = {
//   images: {

//     domains: [
//       'images.unsplash.com',
//       'avatars.githubusercontent.com',

//       ...(supabaseHostname
//         ? [supabaseHostname]
//         : []),
//     ],

//     remotePatterns: [
//       {
//         protocol: 'http',
//         hostname: 'localhost',
//         port: '3002',
//         pathname: '/uploads/**',
//       },
//     ],
//   },
// };

// module.exports = nextConfig;



/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'avatars.githubusercontent.com',
      'aivmhxjezdladwmfzamj.supabase.co',
    ],

    remotePatterns: [
      {
        protocol: 'https',
        hostname:
          'aivmhxjezdladwmfzamj.supabase.co',
      },

      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },

      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3002',
        pathname: '/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;