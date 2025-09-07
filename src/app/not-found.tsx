import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl font-bold text-blue-600 mb-2">404</div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Page Not Found
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
            
            <div className="space-y-3">
              <Link href="/">
                <Button variant="primary" className="w-full">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/trending">
                <Button variant="outline" className="w-full">
                  View Trending
                </Button>
              </Link>
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              <p>Need help? Contact support or check our documentation.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
