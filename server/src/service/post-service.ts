import { db } from "../db";
import { CreatePostInput } from "../schema/post-schemas";

export async function createPost(post: CreatePostInput) {
    return db.post.create({
        data: {
            title: post.title,
            description: post.description,
            ...(post.foodId && { food: { connect: { id: post.foodId } } }),
            author: { connect: { id: post.authorId } },
        },
    });
}

export function getPostById(postId: number) {
    return db.post.findUnique({
        where: { id: postId },
    });
}

export function getPostsByAuthor(authorId: number) {
    return db.post.findMany({
        where: { authorId },
    });
}

export function getAllPosts() {
    return db.post.findMany();
}

export function deletePost(postId: number) {
    return db.post.delete({
        where: { id: postId },
    });
}
