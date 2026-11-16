import PostEditor from "@/components/admin/PostEditor";

export default async function EditPost({ params }: PageProps<"/admin/edit/[slug]">) {
  return <PostEditor slug={(await params).slug} />;
}
