import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

export default function ProfilePage() {
  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: undefined,
    joinDate: 'January 2024',
    totalArticles: 1247,
    favorites: 89,
    categories: ['Technology', 'Sports', 'Finance'],
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Overview */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-700">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                <p className="text-sm text-gray-500">Member since {user.joinDate}</p>
              </div>
              <Button variant="outline">
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {user.totalArticles.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Articles Read
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {user.favorites}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Favorites
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {user.categories.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Active Categories
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={user.name}
                readOnly
              />
              <Input
                label="Email Address"
                value={user.email}
                readOnly
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Change Password
              </Button>
              <Button variant="outline" size="sm">
                Update Email
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Interests */}
        <Card>
          <CardHeader>
            <CardTitle>Your Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              These categories are used to personalize your content feed.
            </p>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Download My Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Privacy Settings
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
