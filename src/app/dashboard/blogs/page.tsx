export default function BlogsPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-title font-bold">Blogs</h1>
        <p className="text-muted-foreground">
          Manage your blog posts
        </p>
      </div>
      
      <div className="rounded-lg border bg-card p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Blog Management</h2>
        <p className="text-muted-foreground">
          This is where you'll manage all your blog posts
        </p>
      </div>
    </div>
  );
}