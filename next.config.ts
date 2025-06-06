import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'yeyak.seoul.go.kr',
            pathname: '/web/common/file/**',
          },
          {
            protocol: 'https',
            hostname: 'encrypted-tbn0.gstatic.com',
            pathname: '/web/common/file/**',
          },
        ],
    },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);